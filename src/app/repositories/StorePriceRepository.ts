import { PoolConnection, RowDataPacket } from "mysql2/promise";
import { Pagination, StorePrice, StorePriceQueries } from "../types/type.ts";

const find = async (
    filters: StorePriceQueries,
    connection: PoolConnection,
    pagination?: Pagination
) => {
    const conditions: string[] = [];
    const queryParams: any[] = [];
    let sql = "SELECT ?? FROM ??";
    let countSql = "SELECT COUNT(*) AS total FROM Store_Price";

    Object.keys(filters).forEach((filter) => {
        const key = filter;
        const value = filters[filter as keyof StorePriceQueries];
        if (value !== null && value !== undefined) {
            conditions.push(`${key} = ?`);
            queryParams.push(value);
        }
    });

    if (conditions.length) {
        const where = ` WHERE ${conditions.join(" AND ")}`;
        sql += where;
        countSql += where;
    }

    const [totalCount] = await connection.query<RowDataPacket[]>(
        countSql,
        queryParams
    );

    if (pagination) {
        const { page, limit } = pagination;
        const offset = (page - 1) * limit;
        sql += ` LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);
    }

    const columns = [
        "id",
        "start_hour",
        "end_hour",
        "price",
        "store_id",
        "type_id",
        "days_of_week",
    ];
    const values = [columns, "Store_Price", ...queryParams];
    const [prices] = await connection.query<RowDataPacket[]>(sql, values);
    return {
        storePrices: prices as StorePrice[],
        total: totalCount[0].total as number,
    };
};

export default {
    find,
};
