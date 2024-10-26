import BookingService from "../services/BookingService.ts";
import { Request, Response } from "express";
import { Booking, BookingSlot, BookingStatus } from "../types/type.ts";

const find = async (req: Request, res: Response) => {
  const { booking_status, booking_date, page, limit } = req.query;
  const result = await BookingService.find(
    {
      booking_status: booking_status as keyof typeof BookingStatus,
      booking_date: booking_date as string,
    },
    {
      page: page ? +page : 1,
      limit: limit ? +limit : 10,
    },
    {
      user: true,
    }
  );
  if (!result || !result.bookings || !result.bookings.length) {
    return res.status(404).json({ message: "No bookings found" });
  }
  return res.status(200).json(result);
};

const findById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = await BookingService.findBookingById(+id, {
    pod: true,
    slot: true,
    product: true,
    user: true,
    payment: true,
  });
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }
  return res.status(200).json(booking);
};

const findByUserId = async (req: Request, res: Response) => {
  const { payload } = req;
  const { booking_status, booking_date, page, limit } = req.query;
  const result = await BookingService.findByUserId(
    payload.user_id,
    {
      booking_status: booking_status as keyof typeof BookingStatus,
      booking_date: booking_date as string,
    },
    {
      page: page ? +page : 1,
      limit: limit ? +limit : 8,
    },
    {
      user: true,
    }
  );
  if (!result || !result.bookings || !result.bookings.length) {
    return res.status(404).json({ message: "No bookings found" });
  }
  return res.status(200).json(result);
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

const getBookingsCountByPod = async (req: Request, res: Response) => {
  try {
    const bookingCounts = await BookingService.countBookingsByPod();
    console.log(bookingCounts);

    if (!bookingCounts || bookingCounts.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    return res.status(200).json(bookingCounts);
  } catch (error) {
    console.error("Error fetching booking counts by pod:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  find,
  findById,
  findByUserId,
  create,
  update,
  getBookingsCountByPod,
};
