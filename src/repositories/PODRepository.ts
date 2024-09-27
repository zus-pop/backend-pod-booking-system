import { RowDataPacket } from "mysql2";
import { pool } from "../config/pool.ts";
import { POD } from "../types/type.ts";

const connection = await pool.getConnection();

const findAll = async () => {
    const sql = "SELECT ?? FROM ??";
    const colum = ["pod_id", "pod_name", "type_id", "is_available"];
    const values = [colum, "POD"];
    const [pods] = await connection.query<RowDataPacket[]>(sql, values);
    return pods as POD[];
};

const findById = async (id: number) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const colum = ["pod_id", "pod_name", "type_id", "is_available"];
    const values = [colum, "POD", "pod_id", id];
    const [pod] = await connection.query<RowDataPacket[]>(sql, values);
    return pod[0] as POD;
};

export default {
    findAll,
    findById,
};
