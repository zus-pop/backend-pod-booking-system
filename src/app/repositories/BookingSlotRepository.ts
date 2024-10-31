import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { BookingSlot } from "../types/type.ts";
import SlotRepository from "./SlotRepository.ts";

const findAllSlot = async (connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ??";
    const columns = [
        "id",
        "booking_id",
        "slot_id",
        "unit_price",
        "is_checked_in",
    ];
    const values = [columns, "Booking_Slot"];
    const [rows] = await connection.query<RowDataPacket[]>(sql, values);
    return rows as BookingSlot[];
};

const findAllSlotByBookingId = async (
    booking_id: number,
    connection: PoolConnection
) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = [
        "id",
        "booking_id",
        "slot_id",
        "unit_price",
        "is_checked_in",
    ];
    const values = [columns, "Booking_Slot", "booking_id", booking_id];
    const [rows] = await connection.query<RowDataPacket[]>(sql, values);
    const bookingSlots = rows as BookingSlot[];
    if (!bookingSlots || !bookingSlots.length) {
        return [];
    }
    const slots = await SlotRepository.findByMultipleId(
        bookingSlots.map((bookingSlot) => bookingSlot.slot_id!),
        connection
    );
    return slots.map((slot, index) => ({
        ...slot,
        price: bookingSlots[index].unit_price,
    }));
};

const createMany = async (
    bookingSlots: BookingSlot[],
    connection: PoolConnection
) => {
    const sql = "INSERT INTO ?? (??) VALUES ?";
    const values = [
        "Booking_Slot",
        ["booking_id", "slot_id", "unit_price"],
        bookingSlots.map((bookingSlot) => [
            bookingSlot.booking_id,
            bookingSlot.slot_id,
            bookingSlot.unit_price,
        ]),
    ];
    const [rows] = await connection.query<ResultSetHeader>(sql, values);
    return rows;
};

const updateCheckin = async (
    slot_id: number,
    booking_id: number,
    is_checked_in: boolean,
    connection: PoolConnection
) => {
    const sql = "UPDATE ?? SET ? WHERE ?? = ? AND ?? = ?";
    const values = [
        "Booking_Slot",
        { is_checked_in },
        "slot_id",
        slot_id,
        "booking_id",
        booking_id,
    ];
    const [rows] = await connection.query<ResultSetHeader>(sql, values);
    return rows;
};

export default {
    findAllSlot,
    findAllSlotByBookingId,
    createMany,
    updateCheckin,
};
