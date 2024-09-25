import "dotenv/config";
import { pool } from "../config/pool.ts";
import { Slot } from "../types/type.ts";
import moment from "moment";

const connection = await pool.getConnection();

const findAll = async () => {
    try {
        const sql = "SELECT ?? FROM ??";
        const colums = [
            "slot_id",
            "pod_id",
            "start_time",
            "end_time",
            "unit_price",
            "is_available",
        ];
        const values = [colums, "Slot"];
        const [rows] = await connection.query<Slot[]>(sql, values);
        return rows;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export default {
    findAll,
};