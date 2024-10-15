import BookingService from "../services/BookingService.ts";
import { Request, Response } from "express";
import { Booking, BookingSlot, BookingStatus } from "../types/type.ts";

const find = async (req: Request, res: Response) => {
    const { booking_status, booking_date } = req.query;
    const bookings = await BookingService.find({
        booking_status: booking_status as keyof typeof BookingStatus,
        booking_date: booking_date as string,
    });
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

const findByUserId = async (req: Request, res: Response) => {
    const { payload } = req;
    const bookings = await BookingService.findByUserId(payload.user_id);
    if (!bookings || !bookings.length) {
        return res.status(404).json({ message: "No bookings found" });
    }
    return res.status(200).json(bookings);
};

const create = async (req: Request, res: Response) => {
    const {
        booking,
        bookingSlots,
    }: { booking: Booking; bookingSlots: BookingSlot[] } = req.body;
    const { payload } = req;
    const result = await BookingService.createABooking(
        booking,
        bookingSlots,
        payload.user_id
    );
    if (!result) {
        return res.status(400).json({ message: "Failed to create booking" });
    }
    return res.status(200).json(result);
};

const update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const booking: Booking = {
        ...req.body,
        booking_id: id,
    };
    const result = await BookingService.updateABooking(booking);
    if (!result || !result.affectedRows) {
        return res.status(404).json({ message: "Booking not found" });
    }
    return res.status(200).json({ result, message: "Update successfully" });
};

export default {
    find,
    findById,
    findByUserId,
    create,
    update,
};
