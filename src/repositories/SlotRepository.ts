import { Slot } from "../types/type.ts";
import moment from "moment";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

const findAll = async (connection: PoolConnection) => {
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
    const [slots] = await connection.query<RowDataPacket[]>(sql, values);
    return slots as Slot[];
};

const findById = async (id: number, connection: PoolConnection) => {
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
    const [slots] = await connection.query<RowDataPacket[]>(sql, values);
    return slots[0] as Slot;
};

const update = async (slot: Slot, connection: PoolConnection) => {
    const sql = "UPDATE ?? SET ? WHERE ?? = ?";
    const values = ["Slot", slot, "slot_id", slot.slot_id];
    const [result] = await connection.query<ResultSetHeader>(sql, values);
    return result;
};

export default {
    findAll,
    findById,
    update,
};
