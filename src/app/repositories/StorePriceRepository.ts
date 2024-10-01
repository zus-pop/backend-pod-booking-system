import { PoolConnection, RowDataPacket } from "mysql2/promise";
import { StorePrice } from "../types/type.ts";

const findAllStorePrice = async (connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ??";
    const columns = [
        "id",
        "start_hour",
        "end_hour",
        "price",
        "store_id",
        "type_id",
        "days_of_week",
    ];
    const values = [columns, "Store_Price"];
    const [rows] = await connection.query<RowDataPacket[]>(sql, values);
    return rows as StorePrice[];
};

const findAllStorePriceByPodType = async (
    type_id: number,
    connection: PoolConnection
) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = [
        "id",
        "start_hour",
        "end_hour",
        "price",
        "store_id",
        "type_id",
        "days_of_week",
    ];
    const values = [columns, "Store_Price", "type_id", type_id];
    const [rows] = await connection.query<RowDataPacket[]>(sql, values);
    return rows as StorePrice[];
};

export default {
    findAllStorePrice,
    findAllStorePriceByPodType,
};
