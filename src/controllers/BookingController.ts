import BookingService from "../services/BookingService.ts";
import { Request, Response } from "express";

const findAll = async (_: Request, res: Response) => {
    const bookings = await BookingService.findAllBooking();
    if (!bookings || !bookings.length) {
        return res.status(404).json({ message: "No bookings found" });
    }
    return res.status(200).json(bookings);
};

const findById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const booking = await BookingService.findBookingById(+id);
    if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
    }
    return res.status(200).json(booking);
};

export default {
    findAll,
    findById,
};
