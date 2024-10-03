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

const findByMultipleId = async (
    slot_ids: number[],
    connection: PoolConnection
) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? IN ( ? )";
    const colums = [
        "slot_id",
        "pod_id",
        "start_time",
        "end_time",
        "unit_price",
        "is_available",
    ];
    const values = [colums, "Slot", "slot_id", slot_ids];
    const [slots] = await connection.query<RowDataPacket[]>(sql, values);
    return slots as Slot[];
};

const findByPodId = async (pod_id: number, connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const colums = [
        "slot_id",
        "pod_id",
        "start_time",
        "end_time",
        "unit_price",
        "is_available",
    ];
    const values = [colums, "Slot", "pod_id", pod_id];
    const [slots] = await connection.query<RowDataPacket[]>(sql, values);
    return slots as Slot[];
};

const update = async (slot: Slot, connection: PoolConnection) => {
    const sql = "UPDATE ?? SET ? WHERE ?? = ?";
    const values = ["Slot", slot, "slot_id", slot.slot_id];
    const [result] = await connection.query<ResultSetHeader>(sql, values);
    return result;
};

const updateStatusMultipleSlot = async (
    is_available: boolean,
    slot_ids: number[],
    connection: PoolConnection
) => {
    const sql = "UPDATE ?? SET ? WHERE ?? IN ( ? )";
    const values = ["Slot", { is_available }, "slot_id", slot_ids];
    const [result] = await connection.query<ResultSetHeader>(sql, values);
    return result;
};

const findAvailableSlotByDate = async (
    date: Date | string,
    connection: PoolConnection
) => {
    const sql = "SELECT ?? FROM ?? WHERE DATE(??) = ? AND ?? = ?";
    const colums = [
        "slot_id",
        "pod_id",
        "start_time",
        "end_time",
        "unit_price",
        "is_available",
    ];
    const values = [
        colums,
        "Slot",
        "start_time",
        moment(date).format("YYYY-MM-DD"),
        "is_available",
        true,
    ];
    console.log(connection.format(sql, values));
    const [slots] = await connection.query<RowDataPacket[]>(sql, values);
    return slots as Slot[];
};

const findAvailableSlotByDateAndPodId = async (
    pod_id: number,
    date: Date | string,
    connection: PoolConnection
) => {
    const sql = "SELECT ?? FROM ?? WHERE DATE(??) = ? AND ?? = ? AND ?? = ?";
    const colums = [
        "slot_id",
        "pod_id",
        "start_time",
        "end_time",
        "unit_price",
        "is_available",
    ];
    const values = [
        colums,
        "Slot",
        "start_time",
        moment(date).format("YYYY-MM-DD"),
        "is_available",
        true,
        "pod_id",
        pod_id,
    ];
    console.log(connection.format(sql, values));
    const [slots] = await connection.query<RowDataPacket[]>(sql, values);
    return slots as Slot[];
};

export default {
    findAll,
    findById,
    findByMultipleId,
    findByPodId, //haven't been used yet
    findAvailableSlotByDate, //haven't been used yet
    findAvailableSlotByDateAndPodId,
    update,
    updateStatusMultipleSlot,
};
