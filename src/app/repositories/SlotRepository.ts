import { ResultSetHeader, RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";
import { Slot, SlotQueries } from "../types/type.ts";

const find = async (filters: SlotQueries, connection: PoolConnection) => {
    const conditions: string[] = [];
    const queryParams: any[] = [];
    let sql = "SELECT ?? FROM ??";

    Object.keys(filters).forEach((filter) => {
        const key = filter;
        const value = filters[filter as keyof SlotQueries];
        if (value !== undefined && value !== null) {
            switch (key) {
                case "pod_id":
                    conditions.push(`${key} = ?`);
                    queryParams.push(value);
                    break;
                case "date":
                    conditions.push(`DATE(start_time) = ?`);
                    queryParams.push(value);
                    break;
                case "start_time":
                    conditions.push(`TIME(${key}) >= ?`);
                    queryParams.push(value);
                    break;
                case "end_time":
                    conditions.push(`TIME(${key}) <= ?`);
                    queryParams.push(value);
                    break;
                case "is_available":
                    conditions.push(`${key} = ?`);
                    queryParams.push(value);
                    break;
                default:
                    throw new Error(`${key} option is not supported`);
            }
        }
    });

    if (conditions.length) {
        const where = ` WHERE ${conditions.join(" AND ")}`;
        sql += where;
    }

    const colums = [
        "slot_id",
        "pod_id",
        "start_time",
        "end_time",
        "price",
        "is_available",
    ];
    const values = [colums, "Slot", ...queryParams];
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
        "price",
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
        "price",
        "is_available",
    ];
    const values = [colums, "Slot", "slot_id", slot_ids];
    const [slots] = await connection.query<RowDataPacket[]>(sql, values);
    return slots as Slot[];
};

const create = async (slot: Slot, connection: PoolConnection) => {
    const sql = "INSERT INTO ?? SET ?";
    const values = ["Slot", slot];
    console.log(connection.format(sql, values));
    const [result] = await connection.query<ResultSetHeader>(sql, values);
    return result;
};

const update = async (slot: Slot, id: number, connection: PoolConnection) => {
    const sql = "UPDATE ?? SET ? WHERE ?? = ?";
    const values = ["Slot", slot, "slot_id", id];
    const [result] = await connection.query<ResultSetHeader>(sql, values);
    return result;
};

const remove = async (id: number, connection: PoolConnection) => {
    const sql = "DELETE FROM ?? WHERE ?? = ?";
    const values = ["Slot", "slot_id", id];
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

const checkOverlappingSlots = async (
    pod_id: number,
    start_time: string,
    end_time: string,
    connection: PoolConnection
) => {
    const sql = `
    SELECT slot_id, start_time, end_time FROM Slot
    WHERE pod_id = :pod_id
    AND (
        (:start_time <= start_time AND end_time <= :end_time) OR
        (start_time <= :start_time AND :end_time <= end_time) OR
        (start_time <= :start_time AND :start_time < end_time) OR
        (start_time < :end_time AND :end_time <= end_time) 
        )
    `;
    const values = {
        pod_id,
        start_time,
        end_time,
    };
    const [overlappingSlots] = await connection.query<RowDataPacket[]>(
        sql,
        values
    );
    return overlappingSlots as Slot[];
};

export default {
    find,
    findById,
    findByMultipleId,
    checkOverlappingSlots,
    create,
    update,
    updateStatusMultipleSlot,
    remove,
};
