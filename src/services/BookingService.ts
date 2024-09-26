import moment from "moment";
import BookingRepo from "../repositories/BookingRepository.ts";
import { Booking, BookingProduct } from "../types/type.ts";
import BookingProductRepository from "../repositories/BookingProductRepository.ts";
import BookingProductService from "./BookingProductService.ts";

const FORMAT_TYPE = "YYYY-MM-DD HH:mm:ss";

const findAllBooking = () => {
    return BookingRepo.findAll();
};

const findBookingById = (id: number) => {
    return BookingRepo.findById(id);
};

const createABooking = async (
    booking: Booking,
    bookingProducts: BookingProduct[],
    user_id: number
) => {
    booking = {
        ...booking,
        user_id,
        booking_date: moment().format(FORMAT_TYPE),
        booking_status: "Pending",
    };
    const bookingResult = await BookingRepo.create(booking);
    if (bookingResult?.affectedRows) {
        const bookingProductsResult = await BookingProductService.createBookingProductList(
            bookingProducts,
            bookingResult.insertId
        );
        if (bookingProductsResult) {
            // Update Soon
        }
    }
    return 1;
};

const updateABooking = (booking: Booking) => {
    return BookingRepo.update(booking);
};

export default {
    findAllBooking,
    findBookingById,
    createABooking,
    updateABooking,
};
