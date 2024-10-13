import { pool } from "../config/pool.ts";
import StoreRepo from "../repositories/StoreRepository.ts";
import { Store } from "../types/type.ts";

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

export default {
  findAllStore,
  findStoreById,
  createNewStore,
  updateStore,
};
