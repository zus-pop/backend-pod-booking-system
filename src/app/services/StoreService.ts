import { pool } from "../config/pool.ts";
import StoreRepo from "../repositories/StoreRepository.ts";
import { Pagination, Store, StoreQueries } from "../types/type.ts";

const find = async (filters: StoreQueries, pagination: Pagination) => {
    const connection = await pool.getConnection();
    try {
        const result = await StoreRepo.find(filters, pagination, connection);
        return result;
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

const createNewStore = async (newStore: Store) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const insertId = await StoreRepo.createNewStore(newStore, connection);
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

const updateStore = async (store: Store) => {
    const connection = await pool.getConnection();
    try {
        const updated = await StoreRepo.updateStore(store, connection);
        return updated;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const deleteStoreById = async (id: number) => {
    const connection = await pool.getConnection();
    try {
        const isdeleted = await StoreRepo.deleteById(id, connection);
        return isdeleted;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

export default {
    find,
    findStoreById,
    createNewStore,
    updateStore,
    deleteStoreById,
};
