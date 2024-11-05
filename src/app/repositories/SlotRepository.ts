import moment from "moment";
import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
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

const updateExpiredSlot = async (connection: PoolConnection) => {
    const sql = "UPDATE ?? SET ? WHERE ?? <= ? AND ?? = ?";
    const values = [
        "Slot",
        { is_available: false },
        "start_time",
        moment().utcOffset(+7).format("YYYY-MM-DD HH:mm:ss"),
        "is_available",
        true,
    ];
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

const getDailyRevenueBySlot = async (
    connection: PoolConnection
): Promise<{ date: string; daily_revenue: number }[]> => {
    const sql = `
      SELECT 
          DATE(pay.payment_date) AS date,
          COALESCE(SUM(bs.unit_price), 0) AS daily_revenue
      FROM 
          Booking_Slot bs
      LEFT JOIN 
          Booking b ON bs.booking_id = b.booking_id
      LEFT JOIN 
          Payment pay ON b.booking_id = pay.booking_id
      WHERE 
          pay.payment_status = 'Paid'
          AND pay.payment_for = 'Slot'
      GROUP BY 
          DATE(pay.payment_date)
      ORDER BY 
          DATE(pay.payment_date);
    `;
    const [rows] = await connection.query<RowDataPacket[]>(sql);
    return rows as { date: string; daily_revenue: number }[];
};

const getMonthlyRevenueBySlot = async (
    connection: PoolConnection
): Promise<{ month: string; monthly_revenue: number }[]> => {
    const sql = `
      SELECT 
          DATE_FORMAT(pay.payment_date, '%Y-%m') AS month,
          COALESCE(SUM(bs.unit_price), 0) AS monthly_revenue
      FROM 
          Booking_Slot bs
      LEFT JOIN 
          Booking b ON bs.booking_id = b.booking_id
      LEFT JOIN 
          Payment pay ON b.booking_id = pay.booking_id
      WHERE 
          pay.payment_status = 'Paid'
          AND pay.payment_for = 'Slot'
      GROUP BY 
          DATE_FORMAT(pay.payment_date, '%Y-%m')
      ORDER BY 
          DATE_FORMAT(pay.payment_date, '%Y-%m');
    `;
    const [rows] = await connection.query<RowDataPacket[]>(sql);
    return rows as { month: string; monthly_revenue: number }[];
};

const getTotalSlotRevenue = async (
    connection: PoolConnection
): Promise<{ totalSlotRevenue: number }> => {
    const sql = `
      SELECT 
          COALESCE(SUM(bs.unit_price), 0) AS totalSlotRevenue
      FROM 
          Booking_Slot bs
      LEFT JOIN 
          Booking b ON bs.booking_id = b.booking_id
      LEFT JOIN 
          Payment pay ON b.booking_id = pay.booking_id
      WHERE 
          pay.payment_status = 'Paid'
          AND pay.payment_for = 'Slot';
    `;
    const [rows] = await connection.query<RowDataPacket[]>(sql);
    return rows[0] as { totalSlotRevenue: number };
};

export default {
    find,
    findById,
    findByMultipleId,
    checkOverlappingSlots,
    create,
    update,
    updateStatusMultipleSlot,
    updateExpiredSlot,
    remove,
    getDailyRevenueBySlot,
    getMonthlyRevenueBySlot,
    getTotalSlotRevenue,
};
