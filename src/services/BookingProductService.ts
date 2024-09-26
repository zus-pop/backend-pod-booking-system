import BookingProductRepository from "../repositories/BookingProductRepository.ts";
import { BookingProduct } from "../types/type.ts";

const findAllBookingProducts = () => {
    return BookingProductRepository.findAll();
};

const findByBookingId = (booking_id: number) => {
    return BookingProductRepository.findByBookingId(booking_id);
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
