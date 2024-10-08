import { ResultSetHeader, RowDataPacket } from "mysql2";
import { POD } from "../types/type.ts";
import { PoolConnection } from "mysql2/promise";

const findAll = async (connection: PoolConnection) => {
  const sql = "SELECT ?? FROM ??";
  const colum = ["pod_id", "pod_name", "type_id", "is_available"];
  const values = [colum, "POD"];
  const [pods] = await connection.query<RowDataPacket[]>(sql, values);
  return pods as POD[];
};

const findById = async (id: number, connection: PoolConnection) => {
  const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
  const colum = ["pod_id", "pod_name", "type_id", "is_available"];
  const values = [colum, "POD", "pod_id", id];
  const [pod] = await connection.query<RowDataPacket[]>(sql, values);
  return pod[0] as POD;
};

const createNewPod = async (pod: POD, connection: PoolConnection) => {
  const sql = "INSERT INTO POD SET ?";
  const [result] = await connection.query<ResultSetHeader>(sql, [pod]);
  return result.insertId;
};

const deleteOnePod = async (id: number, connection: PoolConnection) => {
  const existingPod = await findById(id, connection);
  if (!existingPod) {
    return null;
  }

  const sql = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
  const values = ["POD", "is_available", 0, "pod_id", id];
  const [result] = await connection.query<RowDataPacket[]>(sql, values);
  return result;
};

const updatePOD = async (pod: POD, connection: PoolConnection) => {
  const sql = `UPDATE POD SET ? WHERE pod_id = ?`;
  const [result] = await connection.query<ResultSetHeader>(sql, [
    pod, // Các field của POD cần cập nhật
    pod.pod_id, // ID của POD
  ]);
  return result.affectedRows > 0;
};

export default {
  findAll,
  findById,
  createNewPod,
  deleteOnePod,
  updatePOD,
};
