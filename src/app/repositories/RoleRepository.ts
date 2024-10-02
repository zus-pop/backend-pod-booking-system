import { PoolConnection, RowDataPacket } from "mysql2/promise";
import { Role } from "../types/type.ts";

const findAll = async (connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ??";
    const columns = ["role_id", "role_name"];
    const values = [columns, "Role"];
    const [rows] = await connection.query<RowDataPacket[]>(sql, values);
    return rows as Role[];
};

const findById = async (id: number, connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = ["role_id", "role_name"];
    const values = [columns, "Role", "role_id", id];
    const [rows] = await connection.query<RowDataPacket[]>(sql, values);
    return rows[0] as Role;
};

export default {
    findAll,
    findById,
};
