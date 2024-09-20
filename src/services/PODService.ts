import { pool } from "../database/db.ts";
import { POD } from "../types/type.ts";

const connection = await pool.getConnection();

const findAll = async () => {
    try {
        const sql = "SELECT ?? FROM ??";
        const colum = ["pod_id", "pod_name", "type_id", "is_available"];
        const values = [colum, "POD"];
        const [pod] = await connection.query<POD[]>(sql, values);
        return pod;
    } catch (err) {
        console.error("error:", err);
        return null;
    }
};

const findById = async (id: number) => {
    try {
        const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
        const colum = ["pod_id", "pod_name", "type_id", "is_available"];
        const values = [colum, "POD", "pod_id", id];
        const [pod] = await connection.query<POD[]>(sql, values);
        return pod[0];
    } catch (err) {
        console.error("error:", err);
        return null;
    }
};

export default {
    findAll,
    findById,
};
