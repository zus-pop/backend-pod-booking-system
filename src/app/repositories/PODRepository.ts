import { ResultSetHeader, RowDataPacket } from "mysql2";
import { POD, SortCriteria, PODQueries } from "../types/type.ts";
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

const find = async (
  filters: PODQueries = {},
  comparator: SortCriteria,
  connection: PoolConnection
) => {
  const conditions: string[] = [];
  const queryParams: any[] = [];
  const { column, order } = comparator;
  let sql = "SELECT ?? FROM ??";
  Object.keys(filters).forEach((filter) => {
    const key = filter;
    const value = filters[filter as keyof PODQueries];
    if (value) {
      if (key === "pod_name") {
        conditions.push(`${key} LIKE ?`);
        queryParams.push(`%${value}%`);
      } else {
        conditions.push(`${key} = ?`);
        queryParams.push(value);
      }
    }
  });

  if (conditions.length) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  if (column && order) {
    sql += ` ORDER BY ${column} ${order}`;
  }

  const columns = [
    "pod_id",
    "pod_name",
    "type_id",
    "description",
    "image",
    "is_available",
    "store_id",
  ];
  const values = [columns, "POD", ...queryParams];
  console.log(connection.format(sql, values));
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

const sortPODByRating = async (
  filters: PODQueries = {},
  comparator: SortCriteria,
  connection: PoolConnection
): Promise<POD[]> => {
  const conditions: string[] = [];
  const queryParams: any[] = [];
  const { column, order } = comparator;

  let sql = `
    SELECT POD.pod_id, POD.pod_name, AVG(Booking.rating) AS avg_rating
    FROM POD
    JOIN Booking ON Booking.pod_id = POD.pod_id
  `;

  Object.keys(filters).forEach((filter) => {
    const key = filter;
    const value = filters[filter as keyof PODQueries];
    if (value) {
      if (key === "pod_name") {
        conditions.push(`POD.${key} LIKE ?`);
        queryParams.push(`%${value}%`);
      } else {
        conditions.push(`POD.${key} = ?`);
        queryParams.push(value);
      }
    }
  });

  if (conditions.length) {
    sql += ` WHERE ${conditions.join(" AND ")} AND Booking.rating IS NOT NULL`;
  } else {
    sql += ` WHERE Booking.rating IS NOT NULL`;
  }

  sql += ` GROUP BY POD.pod_id`;

  if (column && order) {
    sql += ` ORDER BY ${column} ${order}`;
  } else {
    sql += ` ORDER BY avg_rating DESC`;
  }

  console.log(connection.format(sql, queryParams));
  const [rows] = await connection.query<RowDataPacket[]>(sql, queryParams);
  return rows as POD[];
};

export default {
  find,
  findById,
  findByName,
  findByType,
  findByStoreId,
  createNewPod,
  deleteOnePod,
  updatePOD,
  sortPODByRating,
};
