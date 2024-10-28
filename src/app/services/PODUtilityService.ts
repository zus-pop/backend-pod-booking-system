import { pool } from "../config/pool.ts";
import PODUtilityRepo from "../repositories/PODUtilityRepository.ts";

const findAll = async () => {
    const connection = await pool.getConnection();
    try {
        const podUtility = await PODUtilityRepo.findAll(connection);
        return podUtility;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};
const findById = async (id: number) => {
    const connection = await pool.getConnection();
    try {
        const podUtility = await PODUtilityRepo.findById(id, connection);
        return podUtility;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};

const findByPodId = async (podId: number) => {
    const connection = await pool.getConnection();
    try {
        const utilities = await PODUtilityRepo.findByPodId(podId, connection);
        return utilities;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

// const createPODUtilities = async (podUtilites: PODUtility[]) => {
//     const connection = await pool.getConnection();
//     try {
//         const result = await PODUtilityRepo.create(podUtilites, connection);
//         return result;
//     } catch (err) {
//     } finally {
//         connection.release();
//     }
// };

export default {
    findAll,
    findById,
    findByPodId,
    // createPODUtilities,
};
