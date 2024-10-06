import { PoolConnection, RowDataPacket } from "mysql2/promise";

const findAll = async (connection: PoolConnection) => {
  const sql = "SELECT ?? FROM ??";
  const columns = ["id", "pod_id", "utility_id"];
  const values = [columns, "POD_Utility"];
  const [podUtilities] = await connection.query<RowDataPacket[]>(sql, values);
  return podUtilities;
};

const findById = async (id: number, connection: PoolConnection) => {
  const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
  const columns = ["id", "pod_id", "utility_id"];
  const values = [columns, "POD_Utility", "id", id];
  const [podUtilities] = await connection.query<RowDataPacket[]>(sql, values);
  return podUtilities[0];
};

const findByPodId = async (podId: number, connection: PoolConnection) => {
  const sql =
    "SELECT ?? FROM ?? pu JOIN ?? u ON pu.utility_id = u.utility_id WHERE ?? = ?";
  const columns = ["u.utility_id", "u.utility_name", "u.description"];
  const values = [columns, "POD_Utility", "Utility", "pu.pod_id", podId];
  const [utilities] = await connection.query<RowDataPacket[]>(sql, values);
  return utilities;
};

export default {
  findAll,
  findById,
  findByPodId,
};
