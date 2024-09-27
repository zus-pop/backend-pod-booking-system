import { RowDataPacket } from "mysql2";
import { pool } from "../config/pool.ts";
import { PODType } from "../types/type.ts";

const connection = await pool.getConnection();

const findAll = async () => {
    const sql = "SELECT ?? FROM ??";
    const columns = ["type_id", "type_name", "capacity"];
    const values = [columns, "POD_Type"];
    const [podTypes] = await connection.query<RowDataPacket[]>(sql, values);
    return podTypes as PODType[];
};

const findById = async (id: number) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = ["type_id", "type_name", "capacity"];
    const values = [columns, "POD_Type", "type_id", id];
    const [podTypes] = await connection.query<RowDataPacket[]>(sql, values);
    return podTypes[0] as PODType;
};

export default {
    findAll,
    findById,
};
