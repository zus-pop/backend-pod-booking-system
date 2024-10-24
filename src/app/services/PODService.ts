import { pool } from "../config/pool.ts";
import PODRepo from "../repositories/PODRepository.ts";
import PODUtilityRepository from "../repositories/PODUtilityRepository.ts";
import {
    POD,
    SortCriteria,
    PODQueries,
    PODUtility,
    Pagination,
} from "../types/type.ts";

const find = async (
    filters: PODQueries,
    comparator: SortCriteria,
    pagination: Pagination
) => {
    const connection = await pool.getConnection();
    try {
        const PODs = await PODRepo.find(
            filters,
            comparator,
            pagination,
            connection
        );
        return PODs;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};

const findPODById = async (id: number) => {
    if (isNaN(id)) {
        throw new Error("Invalid ID");
    }
    const connection = await pool.getConnection();
    try {
        const POD = await PODRepo.findById(id, connection);
        return POD;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};

const findByStoreId = async (store_id: number, pagination: Pagination) => {
    const connection = await pool.getConnection();
    try {
        const pods = await PODRepo.findByStoreId(
            store_id,
            pagination,
            connection
        );
        return pods;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};

const createNewPOD = async (newPod: POD, utilities: number[]) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const insertId = await PODRepo.createNewPod(newPod, connection);
        await PODUtilityRepository.create(
            utilities.map<PODUtility>((utility) => ({
                pod_id: insertId,
                utility_id: utility,
            })),
            connection
        );
        await connection.commit();
        return insertId;
    } catch (err) {
        console.log(err);
        await connection.rollback();
        return null;
    } finally {
        connection.release();
    }
};

const deletePODById = async (id: number) => {
    const connection = await pool.getConnection();
    try {
        const result = await PODRepo.deleteOnePod(id, connection);
        if (!result) {
            return null;
        }
        return result;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};

const updatePOD = async (pod: POD) => {
    const connection = await pool.getConnection();
    try {
        const updated = await PODRepo.updatePOD(pod, connection);
        return updated;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const sortPODByRating = async () => {
    const connection = await pool.getConnection();
    try {
        const sortedPODs = await PODRepo.sortPODByRating(connection);
        return sortedPODs;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

export default {
    find,
    findPODById,
    findByStoreId,
    createNewPOD,
    deletePODById,
    updatePOD,
    sortPODByRating,
};
