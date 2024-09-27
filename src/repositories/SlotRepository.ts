import "dotenv/config";
import { pool } from "../config/pool.ts";
import { Slot } from "../types/type.ts";
import moment from "moment";

const connection = await pool.getConnection();

const findAll = async () => {
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
    const [slots] = await connection.query<Slot[]>(sql, values);
    return slots;
};

const findById = async (id: number) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const colums = [
        "slot_id",
        "pod_id",
        "start_time",
        "end_time",
        "unit_price",
        "is_available",
    ];
    const values = [colums, "Slot", "slot_id", id];
    const [slots] = await connection.query<Slot[]>(sql, values);
    return slots[0];
};

export default {
    findAll,
    findById,
};
