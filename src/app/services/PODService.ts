import { pool } from "../config/pool.ts";
import PODRepo from "../repositories/PODRepository.ts";
import { POD } from "../types/type.ts";

const findAllPOD = async () => {
    const connection = await pool.getConnection();
    try {
        const PODs = await PODRepo.findAll(connection);
        return PODs;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};

const findPODById = async (id: number) => {
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

const findPODByName = async (name: string) => {
    const connection = await pool.getConnection();
    try {
        const pods = await PODRepo.findByName(name, connection);
        return pods;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};

const findPODByType = async (pod_type: number) => {
    const connection = await pool.getConnection();
    try {
        const PODs = await PODRepo.findByType(pod_type, connection);
        return PODs;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};

const findByStoreId = async (store_id: number) => {
    const connection = await pool.getConnection();
    try {
        const pods = await PODRepo.findByStoreId(store_id, connection);
        return pods;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};

const createNewPOD = async (newPod: POD) => {
    const connection = await pool.getConnection();
    try {
        const insertId = await PODRepo.createNewPod(newPod, connection);
        return insertId;
    } catch (err) {
        console.log(err);
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

export default {
    findAllPOD,
    findPODById,
    findPODByName,
    findPODByType,
    findByStoreId,
    createNewPOD,
    deletePODById,
    updatePOD,
};
