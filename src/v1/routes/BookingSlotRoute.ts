import BookingSlotController from "../../controllers/BookingSlotController.ts";
import { Router } from "express";

export const BookingSlotRouter = Router();

// GET: api/v1/booking-slots
BookingSlotRouter.get("/", BookingSlotController.findAllSlot);

// GET: api/v1/booking-slots/:booking_id
BookingSlotRouter.get(
    "/:booking_id",
    BookingSlotController.findAllSlotByBookingId
);
