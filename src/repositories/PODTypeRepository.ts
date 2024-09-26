import { pool } from "../config/pool.ts";
import { PODType } from "../types/type.ts";

const connection = await pool.getConnection();

const findAll = async () => {
    try {
        const sql = "SELECT ?? FROM ??";
        const columns = ["type_id", "type_name", "capacity"];
        const values = [columns, "POD_Type"];
        const [podTypes] = await connection.query<PODType[]>(sql, values);
        return podTypes;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const findById = async (id: number) => {
    try {
        const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
        const columns = ["type_id", "type_name", "capacity"];
        const values = [columns, "POD_Type", "type_id", id];
        const [podTypes] = await connection.query<PODType[]>(sql, values);
        return podTypes[0];
    } catch (err) {
        console.error(err);
        return null;
    }
};

export default {
    findAll,
    findById,
};
