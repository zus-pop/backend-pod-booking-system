import { pool } from "../config/pool.ts";
import StoreRepo from "../repositories/StoreRepository.ts";

const connection = await pool.getConnection();

const findAllStore = async () => {
    try {
        const stores = await StoreRepo.findAll(connection);
        return stores;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const findStoreById = (id: number) => {
    try {
        const store = StoreRepo.findById(id, connection);
        return store;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export default {
    findAllStore,
    findStoreById,
};
