import { ResultSetHeader, RowDataPacket } from "mysql2";
import { POD } from "../types/type.ts";
import { PoolConnection } from "mysql2/promise";
import PODTypeRepository from "./PODTypeRepository.ts";
import StoreRepository from "./StoreRepository.ts";
import PODUtilityRepository from "./PODUtilityRepository.ts";

const podMapping = async (pod: POD, connection: PoolConnection) => {
  const type = await PODTypeRepository.findById(pod.type_id!, connection);
  const store = await StoreRepository.findById(pod.store_id!, connection);
  const utilities = await PODUtilityRepository.findByPodId(
    pod.pod_id!,
    connection
  );
  return {
    pod_id: pod.pod_id,
    pod_name: pod.pod_name,
    description: pod.description,
    image: pod.image,
    utilities: utilities,
    is_available: pod.is_available,
    type: type,
    store: store,
  };
};

const findAll = async (connection: PoolConnection) => {
  const sql = "SELECT ?? FROM ??";
  const columns = [
    "pod_id",
    "pod_name",
    "type_id",
    "description",
    "image",
    "is_available",
    "store_id",
  ];
  const values = [columns, "POD"];
  const [pods] = await connection.query<RowDataPacket[]>(sql, values);
  return pods as POD[];
};

const findById = async (id: number, connection: PoolConnection) => {
  const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
  const columns = [
    "pod_id",
    "pod_name",
    "type_id",
    "description",
    "image",
    "is_available",
    "store_id",
  ];
  const values = [columns, "POD", "pod_id", id];
  const [pods] = await connection.query<RowDataPacket[]>(sql, values);
  return podMapping(pods[0] as POD, connection);
};

const findByName = async (name: string, connection: PoolConnection) => {
  const sql = "SELECT ?? FROM ?? WHERE ?? LIKE ?";
  const columns = [
    "pod_id",
    "pod_name",
    "type_id",
    "description",
    "image",
    "is_available",
    "store_id",
  ];
  const values = [columns, "POD", "pod_name", `%${name}%`];
  const [pods] = await connection.query<RowDataPacket[]>(sql, values);
  return pods as POD[];
};

const findByType = async (pod_type: number, connection: PoolConnection) => {
  const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
  const columns = [
    "pod_id",
    "pod_name",
    "type_id",
    "description",
    "image",
    "is_available",
    "store_id",
  ];
  const values = [columns, "POD", "type_id", pod_type];
  const [pods] = await connection.query<RowDataPacket[]>(sql, values);
  return pods as POD[];
};

const findByStoreId = async (store_id: number, connection: PoolConnection) => {
  const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
  const columns = [
    "pod_id",
    "pod_name",
    "type_id",
    "description",
    "image",
    "is_available",
    "store_id",
  ];
  const values = [columns, "POD", "store_id", store_id];
  const [pods] = await connection.query<RowDataPacket[]>(sql, values);
  return pods as POD[];
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
  const values = ["POD", "is_available", false, "pod_id", id];
  const [result] = await connection.query<RowDataPacket[]>(sql, values);
  return result;
};

const updatePOD = async (pod: POD, connection: PoolConnection) => {
  const sql = `UPDATE POD SET ? WHERE pod_id = ?`;
  const [result] = await connection.query<ResultSetHeader>(sql, [
    pod,
    pod.pod_id,
  ]);
  return result.affectedRows > 0;
};

const sortPODByRating = async (connection: PoolConnection) => {
  const sql = `
    SELECT POD.pod_id, POD.pod_name, AVG(Booking.rating) AS avg_rating
    FROM POD
    JOIN Booking ON Booking.pod_id = POD.pod_id
    WHERE Booking.rating IS NOT NULL
    GROUP BY POD.pod_id
    ORDER BY avg_rating DESC;
  `;
  const [rows] = await connection.query<RowDataPacket[]>(sql);
  return rows;
};

const sortPODByNameAZ = async (connection: PoolConnection) => {
  const sql = "SELECT * FROM POD ORDER BY pod_name ASC";
  const [rows] = await connection.query<RowDataPacket[]>(sql);
  return rows;
};

const sortPODByNameZA = async (connection: PoolConnection) => {
  const sql = "SELECT * FROM POD ORDER BY pod_name DESC";
  const [rows] = await connection.query<RowDataPacket[]>(sql);
  return rows;
};

export default {
  findAll,
  findById,
  findByName,
  findByType,
  findByStoreId,
  createNewPod,
  deleteOnePod,
  updatePOD,
  sortPODByRating,
  sortPODByNameAZ,
  sortPODByNameZA,
};
