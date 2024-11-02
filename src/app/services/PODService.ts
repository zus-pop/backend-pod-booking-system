import { pool } from "../config/pool.ts";
import PODRepo, { MappingOptions } from "../repositories/PODRepository.ts";
import PODUtilityRepository from "../repositories/PODUtilityRepository.ts";
import {
    POD,
    PODQueries,
    PODUtility,
    Pagination,
    SortCriteria,
} from "../types/type.ts";

const find = async (
    filters: PODQueries,
    comparator: SortCriteria,
    pagination: Pagination,
    mappingOptions?: MappingOptions
) => {
    const connection = await pool.getConnection();
    try {
        const PODs = await PODRepo.find(
            filters,
            comparator,
            pagination,
            connection,
            mappingOptions
        );
        return PODs;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};

const findPODById = async (id: number, mappingOptions: MappingOptions) => {
    if (isNaN(id)) {
        throw new Error("Invalid ID");
    }
    const connection = await pool.getConnection();
    try {
        const POD = await PODRepo.findById(id, connection, mappingOptions);
        return POD;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};

const findByStoreId = async (
    store_id: number,
    pagination: Pagination,
    mappingOptions?: MappingOptions
) => {
    const connection = await pool.getConnection();
    try {
        const pods = await PODRepo.findByStoreId(
            store_id,
            pagination,
            connection,
            mappingOptions
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
        if (utilities.length) {
            await PODUtilityRepository.create(
                utilities.map<PODUtility>((utility) => ({
                    pod_id: insertId,
                    utility_id: utility,
                })),
                connection
            );
        }
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

const updatePOD = async (pod: POD, utilities: number[]) => {
    const connection = await pool.getConnection();
    try {
        const updated = await PODRepo.updatePOD(pod, connection);
        if (utilities.length) {
            await PODUtilityRepository.remove(pod.pod_id!, connection);
            await PODUtilityRepository.create(
                utilities.map<PODUtility>((utility) => ({
                    pod_id: pod.pod_id,
                    utility_id: utility,
                })),
                connection
            );
        }
        return updated;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const sortPODByRating = async (
    filters: PODQueries,
    comparator: SortCriteria
) => {
    const connection = await pool.getConnection();
    try {
        const sortedPODs = await PODRepo.sortPODByRating(
            filters,
            comparator,
            connection
        );
        return sortedPODs;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const getAveragePodUsageTime = async () => {
    const connection = await pool.getConnection();
    try {
        const avgUsageTimes = await PODRepo.getAveragePodUsageTime(connection);
        return avgUsageTimes;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const getTotalRevenueByPod = async () => {
    const connection = await pool.getConnection();
    try {
        const totalRevenue = await PODRepo.getTotalRevenueByPod(connection);
        return totalRevenue;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const getDailyRevenueByPOD = async () => {
    const connection = await pool.getConnection();
    try {
        const dailyRevenue = await PODRepo.getDailyRevenueByPOD(connection);
        return dailyRevenue;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const getMonthlyRevenueByPOD = async () => {
    const connection = await pool.getConnection();
    try {
        const monthlyRevenue = await PODRepo.getMonthlyRevenueByPOD(connection);
        return monthlyRevenue;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const getTotalPodRevenue = async () => {
    const connection = await pool.getConnection();
    try {
        const totalPodRevenue = await PODRepo.getTotalPodRevenue(connection);
        return totalPodRevenue;
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
    getAveragePodUsageTime,
    getTotalRevenueByPod,
    getDailyRevenueByPOD,
    getMonthlyRevenueByPOD,
    getTotalPodRevenue,
};
