import { Router } from "express";
import BookingProductController from "../../controllers/BookingProductController.ts";

export const BookingProductRouter = Router();

// GET: api/v1/booking-products
BookingProductRouter.get("/", BookingProductController.findAll);

// GET: api/v1/booking-products/:booking_id
BookingProductRouter.get(
    "/:booking_id",
    BookingProductController.findByBookingId
);
