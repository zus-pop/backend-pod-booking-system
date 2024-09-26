import moment from "moment";
import BookingRepo from "../repositories/BookingRepository.ts";
import { Booking, BookingProduct } from "../types/type.ts";

const FORMAT_TYPE = "YYYY-MM-DD HH:mm:ss";

const findAllBooking = () => {
    return BookingRepo.findAll();
};

const findBookingById = (id: number) => {
    return BookingRepo.findById(id);
};

const createABooking = (
    booking: Booking,
    products: BookingProduct[],
    user_id: number
) => {
    // TODO: create new booking and tracking booking status background task
    booking = {
        ...booking,
        user_id,
        booking_date: moment().format(FORMAT_TYPE),
        booking_status: "Pending",
    };
    console.log(booking);
    return BookingRepo.create(booking);
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
