import { pool } from "../config/pool.ts";
import PODTypeRepo from "../repositories/PODTypeRepository.ts";

const connection = await pool.getConnection();

const findAllPODType = async () => {
    try {
        const podTypes = await PODTypeRepo.findAll(connection);
        return podTypes;
    } catch (err) {
        console.error(err);
    }
};

const findPODTypeById = async (id: number) => {
    try {
        const podType = await PODTypeRepo.findById(id, connection);
        return podType;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export default {
    findAllPODType,
    findPODTypeById,
};
