import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Pagination, StorePrice, StorePriceQueries } from "../types/type.ts";
import { convertBitFieldToStringDays } from "../utils/days-and-bitfield.ts";
import PODTypeRepository from "./PODTypeRepository.ts";

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

    sql += ` ORDER BY ?? DESC`;
    queryParams.push(["priority", "start_hour", "end_hour", "price"]);

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
        "priority",
    ];
    const values = [columns, "Store_Price", ...queryParams];
    const [rows] = await connection.query<RowDataPacket[]>(sql, values);
    const prices = rows as StorePrice[];
    return {
        storePrices: await Promise.all(
            prices.map(async (price) => ({
                id: price.id,
                start_hour: price.start_hour,
                end_hour: price.end_hour,
                price: price.price,
                store_id: price.store_id,
                type: await PODTypeRepository.findById(
                    price.type_id!,
                    connection
                ),
                days_of_week: convertBitFieldToStringDays(
                    price.days_of_week as number
                ),
                priority: price.priority,
            }))
        ),
        total: totalCount[0].total as number,
    };
};

const create = async (store_price: StorePrice, connection: PoolConnection) => {
    const sql = "INSERT INTO ?? SET ?";
    const values = ["Store_Price", store_price];
    const [result] = await connection.query<ResultSetHeader>(sql, values);
    return result.insertId;
};

const update = async (
    store_price: StorePrice,
    id: number,
    connection: PoolConnection
) => {
    const sql = "UPDATE ?? SET ? WHERE ?? = ?";
    const values = ["Store_Price", store_price, "id", id];
    const [result] = await connection.query<ResultSetHeader>(sql, values);
    return result.affectedRows;
};

const remove = async (id: number, connection: PoolConnection) => {
    const sql = "DELETE FROM ?? WHERE ?? = ?";
    const values = ["Store_Price", "id", id];
    const [result] = await connection.query<ResultSetHeader>(sql, values);
    return result.affectedRows;
};

export default {
    find,
    create,
    update,
    remove,
};
