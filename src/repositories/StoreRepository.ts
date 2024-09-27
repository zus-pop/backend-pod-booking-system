import { RowDataPacket } from "mysql2";
import { pool } from "../config/pool.ts";
import { Store } from "../types/type.ts";

const connection = await pool.getConnection();

const findAll = async () => {
  const sql = "SELECT ?? FROM ??";
  const columns = ["store_id", "store_name", "address", "hotline"];
  const values = [columns, "Store"];
  const [stores] = await connection.query<RowDataPacket[]>(sql, values);
  return stores;
};

const findById = async (id: number) => {
  const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
  const columns = ["store_id", "store_name", "address", "hotline"];
  const values = [columns, "Store", "store_id", id];
  const [stores] = await connection.query<RowDataPacket[]>(sql, values);
  return stores[0] as Store;
};

export default {
  findAll,
  findById,
};
