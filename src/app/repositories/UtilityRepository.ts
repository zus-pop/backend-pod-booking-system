import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
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

const createNewUtility = async (
  utilityData: Utility,
  connection: PoolConnection
) => {
  const sql = "INSERT INTO Utility SET ?";
  const [result] = await connection.query<ResultSetHeader>(sql, [utilityData]);
  return result.insertId;
};

const updateUtility = async (
  id: number,
  utilityData: Partial<Utility>,
  connection: PoolConnection
) => {
  const sql = "UPDATE Utility SET ? WHERE utility_id = ?";
  const [result] = await connection.query<ResultSetHeader>(sql, [
    utilityData,
    id,
  ]);
  return result.affectedRows > 0;
};

export default {
  findAll,
  findById,
  createNewUtility,
  updateUtility,
};
