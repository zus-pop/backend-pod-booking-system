import { pool } from "../config/pool.ts";
import { POD } from "../types/type.ts";

const connection = await pool.getConnection();

const findAll = async () => {
    const sql = "SELECT ?? FROM ??";
    const colum = ["pod_id", "pod_name", "type_id", "is_available"];
    const values = [colum, "POD"];
    const [pod] = await connection.query<POD[]>(sql, values);
    return pod;
};

const findById = async (id: number) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const colum = ["pod_id", "pod_name", "type_id", "is_available"];
    const values = [colum, "POD", "pod_id", id];
    const [pod] = await connection.query<POD[]>(sql, values);
    return pod[0];
};

export default {
    findAll,
    findById,
};
