import { PoolConnection, RowDataPacket } from "mysql2/promise";
import { Utility } from "../types/type.ts";

const findAll = async (connection: PoolConnection) => {
  const sql = "SELECT ?? FROM ??";
  const colum = ["utility_id", "utility_name", "description"];
  const values = [colum, "Utility"];
  const [utility] = await connection.query<RowDataPacket[]>(sql, values);
  return utility;
};

const findById = async (id: number, connection: PoolConnection) => {
  const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
  const colum = ["utility_id", "utility_name", "description"];
  const values = [colum, "Utility", "utility_id", id];
  const [utility] = await connection.query<RowDataPacket[]>(sql, values);
  return utility[0] as Utility;
};
export default {
  findAll,
  findById,
};
