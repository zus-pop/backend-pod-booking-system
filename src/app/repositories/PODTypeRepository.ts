import { RowDataPacket } from "mysql2";
import { POD, PODType } from "../types/type.ts";
import { PoolConnection } from "mysql2/promise";

const findAll = async (connection: PoolConnection) => {
  const sql = "SELECT ?? FROM ??";
  const columns = ["type_id", "type_name", "capacity"];
  const values = [columns, "POD_Type"];
  const [podTypes] = await connection.query<RowDataPacket[]>(sql, values);
  return podTypes as PODType[];
};

const findById = async (id: number, connection: PoolConnection) => {
  const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
  const columns = ["type_id", "type_name", "capacity"];
  const values = [columns, "POD_Type", "type_id", id];
  const [podTypes] = await connection.query<RowDataPacket[]>(sql, values);
  return podTypes[0] as PODType;
};

const findPodsByTypeId = async (typeId: number, connection: PoolConnection) => {
  const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
  const columns = ["pod_id", "pod_name", "description", "is_available"];
  const values = [columns, "POD", "type_id", typeId];
  const [pods] = await connection.query<RowDataPacket[]>(sql, values);
  return pods as POD[];
};

export default {
  findAll,
  findById,
  findPodsByTypeId,
};
