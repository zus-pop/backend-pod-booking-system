import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Booking, BookingQueries } from "../types/type.ts";
import { PoolConnection } from "mysql2/promise";
import PODRepository from "./PODRepository.ts";
import BookingSlotRepository from "./BookingSlotRepository.ts";
import BookingProductRepository from "./BookingProductRepository.ts";
import UserRepository from "./UserRepository.ts";
import PaymentRepository from "./PaymentRepository.ts";

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
    const user = await UserRepository.findById(booking.user_id!, connection);

    const payment = await PaymentRepository.findByBookingId(
        booking.booking_id!,
        connection
    );
    return {
        booking_id: booking.booking_id,
        booking_date: booking.booking_date,
        booking_status: booking.booking_status,
        user: {
            user_id: user.user_id,
            user_name: user.user_name,
            email: user.email,
        },
        rating: booking.rating,
        comment: booking.comment,
        pod,
        slots,
        products,
        payment,
    };
};

const find = async (
    filters: BookingQueries = {},
    connection: PoolConnection
) => {
    const conditions: string[] = [];
    const queryParams: string[] = [];
    let sql = "SELECT ?? FROM ??";

    Object.keys(filters).forEach((filter) => {
        const key = filter;
        const value = filters[filter as keyof BookingQueries];
        if (value) {
            if (key === "booking_date") {
                conditions.push(`DATE(${key}) = ?`);
            } else {
                conditions.push(`${key} = ?`);
            }
            queryParams.push(value);
        }
    });

    if (conditions.length) {
        sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    const columns = [
        "booking_id",
        "pod_id",
        "user_id",
        "booking_date",
        "booking_status",
    ];
    const values = [columns, "Booking", ...queryParams];
    const [rows] = await connection.query<RowDataPacket[]>(sql, values);
    const bookings = rows as Booking[];
    return await Promise.all(
        bookings.map(async (booking) => {
            const user = await UserRepository.findById(
                booking.user_id!,
                connection
            );
            return {
                booking_id: booking.booking_id,
                pod_id: booking.pod_id,
                user: {
                    user_id: user.user_id,
                    user_name: user.user_name,
                    email: user.email,
                },
                booking_date: booking.booking_date,
                booking_status: booking.booking_status,
            };
        })
    );
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
        "rating",
        "comment",
    ];
    const values = [columns, "Booking", "user_id", user_id];
    const [rows] = await connection.query<RowDataPacket[]>(sql, values);
    const bookings = rows as Booking[];
    return await Promise.all(
        bookings.map(async (booking) => bookingMapper(booking, connection))
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
    find,
    findById,
    findByUserId,
    create,
    update,
    // remove,
};
