import { RowDataPacket } from "mysql2";
import { POD } from "../types/type.ts";
import { PoolConnection } from "mysql2/promise";


const findAll = async (connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ??";
    const colum = ["pod_id", "pod_name", "type_id", "is_available"];
    const values = [colum, "POD"];
    const [pods] = await connection.query<RowDataPacket[]>(sql, values);
    return pods as POD[];
};

const findById = async (id: number, connection: PoolConnection) => {
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
