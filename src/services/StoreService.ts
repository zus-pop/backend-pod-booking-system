import { pool } from "../config/pool.ts";
import StoreRepo from "../repositories/StoreRepository.ts";

const findAllStore = async () => {
    const connection = await pool.getConnection();
    try {
        const stores = await StoreRepo.findAll(connection);
        return stores;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const findStoreById = async (id: number) => {
    const connection = await pool.getConnection();
    try {
        const store = StoreRepo.findById(id, connection);
        return store;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

export default {
    findAllStore,
    findStoreById,
};
