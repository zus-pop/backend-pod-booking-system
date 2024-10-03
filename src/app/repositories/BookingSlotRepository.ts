import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
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

const createMany = async (
    bookingSlots: BookingSlot[],
    connection: PoolConnection
) => {
    const sql = "INSERT INTO ?? (??) VALUES ?";
    const values = [
        "Booking_Slot",
        ["booking_id", "slot_id", "price"],
        bookingSlots.map((bookingSlot) => [
            bookingSlot.booking_id,
            bookingSlot.slot_id,
            bookingSlot.price,
        ]),
    ];
    const [rows] = await connection.query<ResultSetHeader>(sql, values);
    return rows;
};

export default {
    findAllSlot,
    findAllSlotByBookingId,
    createMany,
};
