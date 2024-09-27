import BookingProductRepository from "../repositories/BookingProductRepository.ts";
import { BookingProduct } from "../types/type.ts";

const findAllBookingProducts = async () => {
    try {
        const bookingProducts = await BookingProductRepository.findAll();
        return bookingProducts;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const findByBookingId = (booking_id: number) => {
    try {
        const bookingProducts =
            BookingProductRepository.findByBookingId(booking_id);
        return bookingProducts;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const createBookingProductList = async (
    bookingProducts: BookingProduct[],
    booking_id: number
) => {
    try {
        bookingProducts = bookingProducts.map((product) => ({
            ...product,
            booking_id,
        }));
        const result = await BookingProductRepository.create(bookingProducts);
        return result;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export default {
    findAllBookingProducts,
    findByBookingId,
    createBookingProductList,
};
