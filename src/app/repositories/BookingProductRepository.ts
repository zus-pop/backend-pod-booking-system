import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { BookingProduct, Product } from "../types/type.ts";
import ProductRepository from "./ProductRepository.ts";

const findAll = async (connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ??";
    const columns = ["booking_id", "product_id", "unit_price", "quantity"];
    const values = [columns, "Booking_Product"];
    const [bookingProducts] = await connection.query<RowDataPacket[]>(
        sql,
        values
    );
    return bookingProducts as BookingProduct[];
};

const findByBookingId = async (
    booking_id: number,
    connection: PoolConnection
) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = ["booking_id", "product_id", "unit_price", "quantity"];
    const values = [columns, "Booking_Product", "booking_id", booking_id];
    const [rows] = await connection.query<RowDataPacket[]>(sql, values);
    const bookingProducts = rows as BookingProduct[];
    if (!bookingProducts || !bookingProducts.length) {
        return [];
    }
    const products = await ProductRepository.findByMultipleId(
        bookingProducts.map((bookingProduct) => bookingProduct.product_id!),
        connection
    );
    return products.map((product, index) => ({
        ...product,
        quantity: bookingProducts[index].quantity,
        unit_price: bookingProducts[index].unit_price,
    }));
};

const create = async (
    bookingProducts: BookingProduct[],
    connection: PoolConnection
) => {
    const sql = "INSERT INTO ?? (??) VALUES ?";
    const columns = ["booking_id", "product_id", "unit_price", "quantity"];
    const values = [
        "Booking_Product",
        columns,
        bookingProducts.map((item) => [
            item.booking_id,
            item.product_id,
            item.unit_price,
            item.quantity,
        ]),
    ];
    const [result] = await connection.query<ResultSetHeader>(sql, values);
    return result;
};

export default {
    findAll,
    findByBookingId,
    create,
};
