import { pool } from "../config/pool.ts";
import PODRepo from "../repositories/PODRepository.ts";

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

export default {
    findAllPOD,
    findPODById,
};
