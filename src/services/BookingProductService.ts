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
    let result;
    for (const product of bookingProducts) {
        product.booking_id = booking_id;
        result = await BookingProductRepository.create(product);
    }
    return result;
};

export default {
    findAllBookingProducts,
    findByBookingId,
    createBookingProductList,
};
