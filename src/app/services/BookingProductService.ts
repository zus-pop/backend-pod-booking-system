import { pool } from "../config/pool.ts";
import BookingProductRepository from "../repositories/BookingProductRepository.ts";

const findAllBookingProducts = async () => {
    const connection = await pool.getConnection();
    try {
        const bookingProducts = await BookingProductRepository.findAll(
            connection
        );
        return bookingProducts;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const findByBookingId = async (booking_id: number) => {
    const connection = await pool.getConnection();
    try {
        const bookingProducts = BookingProductRepository.findByBookingId(
            booking_id,
            connection
        );
        return bookingProducts;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

// const createBookingProductList = async (
//     bookingProducts: BookingProduct[],
// ) => {
//     try {
//         const result = await BookingProductRepository.create(bookingProducts);
//         return result;
//     } catch (err) {
//         throw err;
//     }
// };

export default {
    findAllBookingProducts,
    findByBookingId,
    // createBookingProductList,
};
