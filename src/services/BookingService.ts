import BookingRepo from "../repositories/BookingRepository.ts";
import { Booking } from "../types/type.ts";

const findAllBooking = () => {
    return BookingRepo.findAll();
};

const findBookingById = (id: number) => {
    return BookingRepo.findById(id);
};

const createABooking = (booking: Booking) => {
    // TODO: create new booking and tracking booking status background task
    // return BookingRepo.create(booking);
};

const updateABooking = (booking: Booking) => {
    // TODO: update booking and tracking booking status background task
    // return  BookingRepo.update(booking);
};

export default {
    findAllBooking,
    findBookingById,
    createABooking,
    updateABooking,
};
