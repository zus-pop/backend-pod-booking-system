import { PoolConnection, RowDataPacket } from "mysql2/promise";
import { Store } from "../types/type.ts";

const findAll = async (connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ??";
    const columns = ["store_id", "store_name", "address", "hotline", "image"];
    const values = [columns, "Store"];
    const [stores] = await connection.query<RowDataPacket[]>(sql, values);
    return stores;
};

const findById = async (id: number, connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = ["store_id", "store_name", "address", "hotline", "image"];
    const values = [columns, "Store", "store_id", id];
    const [stores] = await connection.query<RowDataPacket[]>(sql, values);
    return stores[0] as Store;
};

export default {
    findAll,
    findById,
};
