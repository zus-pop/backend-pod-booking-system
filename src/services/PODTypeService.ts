import { pool } from "../config/pool.ts";
import PODTypeRepo from "../repositories/PODTypeRepository.ts";


const findAllPODType = async () => {
    const connection = await pool.getConnection();
    try {
        const podTypes = await PODTypeRepo.findAll(connection);
        return podTypes;
    } catch (err) {
        console.error(err);
    } finally {
        connection.release();
    }
};

const findPODTypeById = async (id: number) => {
    const connection = await pool.getConnection();
    try {
        const podType = await PODTypeRepo.findById(id, connection);
        return podType;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};

export default {
    findAllPODType,
    findPODTypeById,
};
