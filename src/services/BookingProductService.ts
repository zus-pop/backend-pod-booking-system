import { pool } from "../config/pool.ts";
import BookingProductRepository from "../repositories/BookingProductRepository.ts";

const connection = await pool.getConnection();

const findAllBookingProducts = async () => {
    try {
        const bookingProducts = await BookingProductRepository.findAll(
            connection
        );
        return bookingProducts;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const findByBookingId = (booking_id: number) => {
    try {
        const bookingProducts = BookingProductRepository.findByBookingId(
            booking_id,
            connection
        );
        return bookingProducts;
    } catch (err) {
        console.error(err);
        return null;
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
