import { pool } from "../config/pool.ts";
import RoleRepo from "../repositories/RoleRepository.ts";

const findAllRole = async () => {
    const connection = await pool.getConnection();
    try {
        const roles = await RoleRepo.findAll(connection);
        return roles;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const findRoleById = async (id: number) => {
    const connection = await pool.getConnection();
    try {
        const role = await RoleRepo.findById(id, connection);
        return role;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

export default {
    findAllRole,
    findRoleById,
};
