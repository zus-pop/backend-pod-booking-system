import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Booking } from "../types/type.ts";
import { PoolConnection } from "mysql2/promise";
import PODRepository from "./PODRepository.ts";
import BookingSlotRepository from "./BookingSlotRepository.ts";
import BookingProductRepository from "./BookingProductRepository.ts";

const bookingMapper = async (booking: Booking, connection: PoolConnection) => {
    const pod = await PODRepository.findById(booking.pod_id!, connection);
    const slots = await BookingSlotRepository.findAllSlotByBookingId(
        booking.booking_id!,
        connection
    );
    const products = await BookingProductRepository.findByBookingId(
        booking.booking_id!,
        connection
    );
    return {
        booking_id: booking.booking_id,
        booking_date: booking.booking_date,
        booking_status: booking.booking_status,
        rating: booking.rating,
        comment: booking.comment,
        pod,
        slots,
        products,
    };
};

const findAll = async (connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ??";
    const columns = [
        "booking_id",
        "pod_id",
        "user_id",
        "booking_date",
        "booking_status",
    ];
    const values = [columns, "Booking"];
    const [bookings] = await connection.query<RowDataPacket[]>(sql, values);
    return bookings as Booking[];
};

const findById = async (id: number, connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = [
        "booking_id",
        "pod_id",
        "user_id",
        "booking_date",
        "booking_status",
        "rating",
        "comment",
    ];
    const values = [columns, "Booking", "booking_id", id];
    const [bookings] = await connection.query<RowDataPacket[]>(sql, values);
    const booking = await bookingMapper(bookings[0] as Booking, connection);
    return booking;
};

const findByUserId = async (user_id: number, connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = [
        "booking_id",
        "pod_id",
        "user_id",
        "booking_date",
        "booking_status",
    ];
    const values = [columns, "Booking", "user_id", user_id];
    const [rows] = await connection.query<RowDataPacket[]>(sql, values);
    const bookings = rows as Booking[];
    return await Promise.all(
        bookings.map(
            async (booking) => await bookingMapper(booking, connection)
        )
    );
};

const create = async (booking: Booking, connection: PoolConnection) => {
    const sql = "INSERT INTO ?? SET ?";
    const values = ["Booking", booking];
    const [result] = await connection.query<ResultSetHeader>(sql, values);
    return result;
};

const update = async (booking: Booking, connection: PoolConnection) => {
    const sql = "UPDATE ?? SET ? WHERE ?? = ?";
    const values = ["Booking", booking, "booking_id", booking.booking_id];
    const [result] = await connection.query<ResultSetHeader>(sql, values);
    return result;
};

// const remove = async (id: number) => {
//     try {
//         const sql = "DELETE FROM ?? WHERE ?? = ?";
//         const values = ["Booking", "booking_id", id];
//         const [result] = await connection.query<ResultSetHeader>(sql, values);
//         return result.affectedRows;
//     } catch (err) {
//         console.error(err);
//         return null;
//     }
// };

export default {
    findAll,
    findById,
    findByUserId,
    create,
    update,
    // remove,
};
