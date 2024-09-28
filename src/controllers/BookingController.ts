import BookingService from "../services/BookingService.ts";
import { Request, Response } from "express";
import { Booking, BookingProduct } from "../types/type.ts";

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

const create = async (req: Request, res: Response) => {
    const {
        booking,
        bookingProducts,
    }: { booking: Booking; bookingProducts: BookingProduct[] } = req.body;
    const { payload } = req;

    const result = await BookingService.createABooking(
        booking,
        bookingProducts,
        payload.user_id
    );
    if (!result) {
        return res.status(400).json({ message: "Failed to create booking" });
    }
    return res
        .status(200)
        .json({ result, message: "Create a booking successfully" });
};

const update = async (req: Request, res: Response) => {
    const booking: Booking = req.body;
    const result = await BookingService.updateABooking(booking);
    if (!result || !result.affectedRows) {
        return res.status(404).json({ message: "Booking not found" });
    }
    return res.status(200).json({ result, message: "Update successfully" });
};

export default {
    findAll,
    findById,
    create,
    update,
};
