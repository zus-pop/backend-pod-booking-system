import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import {
    POD,
    PODQueries,
    PODType,
    PODUtility,
    Pagination,
    SortCriteria,
    Store,
} from "../types/type.ts";
import PODTypeRepository from "./PODTypeRepository.ts";
import PODUtilityRepository from "./PODUtilityRepository.ts";
import StoreRepository from "./StoreRepository.ts";

export interface MappingOptions {
    type?: boolean;
    store?: boolean;
    utility?: boolean;
}

export interface MappingResponse {
    pod_id?: number;
    pod_name?: string;
    description?: string;
    image?: string;
    utilities?: PODUtility[];
    is_available?: boolean;
    type?: PODType;
    store?: Store;
}

const podMapping = async (
    pod: POD,
    connection: PoolConnection,
    options?: MappingOptions
) => {
    const mappingResult: MappingResponse = {
        pod_id: pod.pod_id,
        pod_name: pod.pod_name,
        description: pod.description,
        image: pod.image,
        is_available: pod.is_available,
    };

    if (options) {
        if (options.type) {
            const type = await PODTypeRepository.findById(
                pod.type_id!,
                connection
            );
            mappingResult.type = type;
        }

        if (options.store) {
            const store = await StoreRepository.findById(
                pod.store_id!,
                connection
            );
            mappingResult.store = store;
        }

        if (options.utility) {
            const utilities = await PODUtilityRepository.findByPodId(
                pod.pod_id!,
                connection
            );
            mappingResult.utilities = utilities;
        }
    }
    return mappingResult;
};

const find = async (
    filters: PODQueries = {},
    comparator: SortCriteria,
    pagination: Pagination,
    connection: PoolConnection,
    mappingOptions?: MappingOptions
) => {
    const conditions: string[] = [];
    const queryParams: any[] = [];
    const { orderBy, direction } = comparator;
    let sql = "SELECT ?? FROM ??";
    let countSql = "SELECT COUNT(*) AS total FROM POD";

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
        const where = ` WHERE ${conditions.join(" AND ")}`;
        sql += where;
        countSql += where;
    }

    sql += ` ORDER BY ${orderBy} ${direction}`;

    const { limit, page } = pagination;
    const offset = (page! - 1) * limit!;
    sql += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

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
    const [rows] = await connection.query<RowDataPacket[]>(sql, values);
    const [totalResult] = await connection.query<RowDataPacket[]>(
        countSql,
        queryParams.slice(0, conditions.length)
    );
    const pods = rows as POD[];
    return {
        pods: await Promise.all(
            pods.map((pod) => podMapping(pod, connection, mappingOptions))
        ),
        total: totalResult[0].total as number,
    };
};

const findById = async (
    id: number,
    connection: PoolConnection,
    mappingOptions?: MappingOptions
) => {
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
    return podMapping(pods[0] as POD, connection, mappingOptions);
};

const findByStoreId = async (
    store_id: number,
    pagination: Pagination,
    connection: PoolConnection,
    mappingOptions?: MappingOptions
) => {
    const conditions: string[] = [];
    const queryParams: any[] = [];
    let sql = "SELECT ?? FROM ??";
    let countSql = "SELECT COUNT(*) AS total FROM POD";

    conditions.push(`?? = ?`);
    queryParams.push("store_id", store_id);

    if (conditions.length) {
        const where = ` WHERE ${conditions.join(" AND ")}`;
        sql += where;
        countSql += where;
    }

    const [totalCount] = await connection.query<RowDataPacket[]>(
        countSql,
        queryParams
    );

    const { page, limit } = pagination;
    const offset = (page! - 1) * limit!;
    sql += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

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
    const [rows] = await connection.query<RowDataPacket[]>(sql, values);
    const pods = rows as POD[];
    return {
        pods: await Promise.all(
            pods.map(
                async (pod) => await podMapping(pod, connection, mappingOptions)
            )
        ),
        total: totalCount[0].total as number,
    };
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
    const { orderBy, direction } = comparator;

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
        sql += ` WHERE ${conditions.join(
            " AND "
        )} AND Booking.rating IS NOT NULL`;
    } else {
        sql += ` WHERE Booking.rating IS NOT NULL`;
    }

    sql += ` GROUP BY POD.pod_id`;

    if (orderBy && direction) {
        sql += ` ORDER BY ${orderBy} ${direction}`;
    } else {
        sql += ` ORDER BY avg_rating DESC`;
    }

    console.log(connection.format(sql, queryParams));
    const [rows] = await connection.query<RowDataPacket[]>(sql, queryParams);
    return rows as POD[];
};

const getAveragePodUsageTime = async (
    connection: PoolConnection
): Promise<{ pod: POD; avg_usage_time: number }[]> => {
    const sql = `
      SELECT 
          p.*, 
          AVG(TIMESTAMPDIFF(MINUTE, sl.start_time, sl.end_time)) AS avg_usage_time
      FROM POD p
      JOIN Slot sl ON p.pod_id = sl.pod_id
      GROUP BY p.pod_id;
  `;
    const [rows] = await connection.query<RowDataPacket[]>(sql);
    return rows.map((row) => ({
        pod: {
            pod_id: row.pod_id,
            pod_name: row.pod_name,
            type_id: row.type_id,
            description: row.description,
            image: row.image,
            is_available: row.is_available,
            store_id: row.store_id,
        },
        avg_usage_time: row.avg_usage_time,
    }));
};

const getTotalRevenueByPod = async (
    connection: PoolConnection
): Promise<{ pod: POD; revenue: number }[]> => {
    const sql = `
    SELECT p.*, 
           COALESCE(SUM(pay.total_cost), 0) AS revenue
    FROM POD p
    LEFT JOIN Booking b ON p.pod_id = b.pod_id
    LEFT JOIN Payment pay ON b.booking_id = pay.booking_id
    GROUP BY p.pod_id;
  `;
    const [rows] = await connection.query<RowDataPacket[]>(sql);
    return rows.map((row) => ({
        pod: {
            pod_id: row.pod_id,
            pod_name: row.pod_name,
            type_id: row.type_id,
            description: row.description,
            image: row.image,
            is_available: row.is_available,
            store_id: row.store_id,
        },
        revenue: row.revenue,
    }));
};

export default {
    find,
    findById,
    findByStoreId,
    createNewPod,
    deleteOnePod,
    updatePOD,
    sortPODByRating,
    getAveragePodUsageTime,
    getTotalRevenueByPod,
};
