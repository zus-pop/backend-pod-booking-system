import { PoolConnection, RowDataPacket } from "mysql2/promise";
import { BookingSlot } from "../types/type.ts";

const findAllSlot = async (connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ??";
    const columns = ["id", "booking_id", "slot_id", "price"];
    const values = [columns, "Booking_Slot"];
    const [rows] = await connection.query<RowDataPacket[]>(sql, values);
    return rows as BookingSlot[];
};

const findAllSlotByBookingId = async (
    booking_id: number,
    connection: PoolConnection
) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = ["id", "booking_id", "slot_id", "price"];
    const values = [columns, "Booking_Slot", "booking_id", booking_id];
    const [rows] = await connection.query<RowDataPacket[]>(sql, values);
    return rows as BookingSlot[];
};

export default {
    findAllSlot,
    findAllSlotByBookingId,
};
