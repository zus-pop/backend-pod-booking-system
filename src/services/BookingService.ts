import moment from "moment";
import BookingRepo from "../repositories/BookingRepository.ts";
import { Booking, BookingProduct } from "../types/type.ts";
import BookingProductService from "./BookingProductService.ts";

const FORMAT_TYPE = "YYYY-MM-DD HH:mm:ss";

const findAllBooking = async () => {
    try {
        const bookings = await BookingRepo.findAll();
        return bookings;
    } catch (err) {
        return null;
    }
};

const findBookingById = async (id: number) => {
    try {
        const booking = await BookingRepo.findById(id);
        return booking;
    } catch (err) {
        return null;
    }
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
    try {
        await BookingRepo.beginTransaction();
        const bookingResult = await BookingRepo.create(booking);
        const bookingProductsResult =
            await BookingProductService.createBookingProductList(
                bookingProducts,
                bookingResult.insertId
            );
        // Update soon

        await BookingRepo.commit();
    } catch (err) {
        await BookingRepo.rollback();
        return null;
    }
    return 1;
};

const updateABooking = async (booking: Booking) => {
    try {
        const result = await BookingRepo.update(booking);
        return result;
    } catch (err) {
        return null;
    }
};

export default {
    findAllBooking,
    findBookingById,
    createABooking,
    updateABooking,
};
