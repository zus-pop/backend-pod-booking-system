import { ResultSetHeader, RowDataPacket } from "mysql2";
import {
    Booking,
    BookingQueries,
    BookingStatus,
    Pagination,
    Payment,
    POD,
    Product,
    Slot,
} from "../types/type.ts";
import { PoolConnection } from "mysql2/promise";
import PODRepository from "./PODRepository.ts";
import BookingSlotRepository from "./BookingSlotRepository.ts";
import BookingProductRepository from "./BookingProductRepository.ts";
import UserRepository from "./UserRepository.ts";
import PaymentRepository from "./PaymentRepository.ts";

export interface MappingOptions {
    slot?: boolean;
    product?: boolean;
    pod?: boolean;
    user?: boolean;
    payment?: boolean;
}

export interface MappingResponse {
    booking_id?: number;
    booking_date?: string;
    booking_status?: keyof typeof BookingStatus;
    rating?: number;
    comment?: string;
    pod?: POD;
    slots?: Slot[];
    products?: Product[];
    user?: {
        user_id: number;
        user_name: string;
        email: string;
    };
    payment?: Payment;
}

const bookingMapper = async (
    booking: Booking,
    connection: PoolConnection,
    options?: MappingOptions
) => {
    const mappingResult: MappingResponse = {
        booking_id: booking.booking_id,
        booking_date: booking.booking_date as string,
        booking_status: booking.booking_status,
        rating: booking.rating,
        comment: booking.comment,
    };
    if (options?.pod) {
        const pod = await PODRepository.findById(booking.pod_id!, connection);
        mappingResult.pod = pod;
    }

    if (options?.slot) {
        const slots = await BookingSlotRepository.findAllSlotByBookingId(
            booking.booking_id!,
            connection
        );
        mappingResult.slots = slots;
    }

    if (options?.product) {
        const products = await BookingProductRepository.findByBookingId(
            booking.booking_id!,
            connection
        );
        mappingResult.products = products;
    }

    if (options?.user) {
        const user = await UserRepository.findById(
            booking.user_id!,
            connection
        );
        mappingResult.user = {
            user_id: user.user_id!,
            user_name: user.user_name!,
            email: user.email!,
        };
    }

    if (options?.payment) {
        const payment = await PaymentRepository.findByBookingId(
            booking.booking_id!,
            connection
        );
        mappingResult.payment = payment;
    }
    return mappingResult;
};

const find = async (
    filters: BookingQueries = {},
    connection: PoolConnection,
    pagination?: Pagination,
    mappingOptions?: MappingOptions
) => {
    const conditions: string[] = [];
    const queryParams: any[] = [];
    let sql = "SELECT ?? FROM ??";
    let countSql = "SELECT COUNT(*) AS total FROM Booking";

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
        const where = ` WHERE ${conditions.join(" AND ")}`;
        sql += where;
        countSql += where;
    }

    const [totalCount] = await connection.query<RowDataPacket[]>(
        countSql,
        queryParams
    );

    sql += ` ORDER BY ?? DESC`;
    queryParams.push("booking_date");

    if (pagination) {
        const { page, limit } = pagination;
        const offset = (page - 1) * limit;
        sql += ` LIMIT ? OFFSET ? `;
        queryParams.push(limit, offset);
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
    return {
        bookings: await Promise.all(
            bookings.map(
                async (booking) =>
                    await bookingMapper(booking, connection, mappingOptions)
            )
        ),
        total: totalCount[0].total as number,
    };
};

const findById = async (
    id: number,
    connection: PoolConnection,
    mappingOptions?: MappingOptions
) => {
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
    const booking = await bookingMapper(
        bookings[0] as Booking,
        connection,
        mappingOptions
    );
    return booking;
};

const findByUserId = async (
    user_id: number,
    connection: PoolConnection,
    filters: BookingQueries,
    pagination?: Pagination,
    mappingOptions?: MappingOptions
) => {
    const conditions: string[] = [];
    const queryParams: any[] = [];
    let sql = "SELECT ?? FROM ??";
    let countSql = "SELECT COUNT(*) AS total FROM Booking";

    conditions.push(`?? = ?`);
    queryParams.push("user_id", user_id);

    Object.keys(filters).forEach((filter) => {
        const key = filter;
        const value = filters[filter as keyof BookingQueries];
        if (value !== null && value !== undefined) {
            if (key === "booking_date") {
                conditions.push(`DATE(${key}) = ?`);
            } else {
                conditions.push(`${key} = ?`);
            }
            queryParams.push(value);
        }
    });

    if (conditions.length) {
        const where = ` WHERE ${conditions.join(" AND ")}`;
        sql += where;
        countSql += where;
    }

    const [totalCount] = await connection.query<RowDataPacket[]>(
        countSql,
        queryParams
    );

    sql += " ORDER BY ?? DESC";
    queryParams.push("booking_date");

    if (pagination) {
        const { page, limit } = pagination;
        const offset = (page - 1) * limit;
        sql += " LIMIT ? OFFSET ?";
        queryParams.push(limit, offset);
    }

    const columns = [
        "booking_id",
        "pod_id",
        "user_id",
        "booking_date",
        "booking_status",
        "rating",
        "comment",
    ];
    const values = [columns, "Booking", ...queryParams];
    const [rows] = await connection.query<RowDataPacket[]>(sql, values);
    const bookings = rows as Booking[];
    return {
        bookings: await Promise.all(
            bookings.map(
                async (booking) =>
                    await bookingMapper(booking, connection, mappingOptions)
            )
        ),
        total: totalCount[0].total as number,
    };
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
