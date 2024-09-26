import { ResultSetHeader } from "mysql2";
import { pool } from "../config/pool.ts";
import { BookingProduct } from "../types/type.ts";

const connection = await pool.getConnection();

const findAll = async () => {
    try {
        const sql = "SELECT ?? FROM ??";
        const columns = ["booking_id", "product_id", "unit_price", "quantity"];
        const values = [columns, "Booking_Product"];
        const [bookingProducts] = await connection.query<BookingProduct[]>(
            sql,
            values
        );
        return bookingProducts;
    } catch (err) {
        console.log(err);
        return null;
    }
};

const findByBookingId = async (booking_id: number) => {
    try {
        const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
        const columns = ["booking_id", "product_id", "unit_price", "quantity"];
        const values = [columns, "Booking_Product", "booking_id", booking_id];
        const [bookingProducts] = await connection.query<BookingProduct[]>(
            sql,
            values
        );
        return bookingProducts;
    } catch (err) {
        console.log(err);
        return null;
    }
};

const create = async (bookingProducts: BookingProduct) => {
    try {
        await connection.beginTransaction();
        const sql = "INSERT INTO ?? SET ?";
        const values = ["Booking_Product", bookingProducts];
        const [result] = await connection.query<ResultSetHeader>(sql, values);
        await connection.commit();
        return result;
    } catch (err) {
        console.log(err);
        await connection.rollback();
        return null;
    }
};

export default {
    findAll,
    findByBookingId,
    create,
};
