import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Store } from "../types/type.ts";

const findAll = async (connection: PoolConnection) => {
  const sql = "SELECT ?? FROM ??";
  const columns = ["store_id", "store_name", "address", "hotline", "image"];
  const values = [columns, "Store"];
  const [stores] = await connection.query<RowDataPacket[]>(sql, values);
  return stores;
};

const findById = async (id: number, connection: PoolConnection) => {
  const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
  const columns = ["store_id", "store_name", "address", "hotline", "image"];
  const values = [columns, "Store", "store_id", id];
  const [stores] = await connection.query<RowDataPacket[]>(sql, values);
  return stores[0] as Store;
};

const createNewStore = async (store: Store, connection: PoolConnection) => {
  const sql = "INSERT INTO Store SET ?";
  const [result] = await connection.query<ResultSetHeader>(sql, [store]);
  return result.insertId;
};

const updateStore = async (store: Store, connection: PoolConnection) => {
  const sql = "UPDATE Store SET ? WHERE store_id = ?";
  const [result] = await connection.query<ResultSetHeader>(sql, [
    store,
    store.store_id,
  ]);
  return result.affectedRows > 0;
};

const deleteById = async (id: number, connection: PoolConnection) => {
  const sql = "DELETE FROM Store WHERE store_id = ?";
  const values = [id];
  const [result] = await connection.query<ResultSetHeader>(sql, values);
  return result.affectedRows > 0;
};

export default {
  findAll,
  findById,
  createNewStore,
  updateStore,
  deleteById,
};
