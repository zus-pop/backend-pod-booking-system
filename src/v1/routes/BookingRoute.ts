import BookingController from "../../controllers/BookingController.ts";
import { Router } from "express";

export const BookingRouter = Router();

// GET: api/v1/bookings
BookingRouter.get("/", BookingController.findAll);

// GET: api/v1/bookings/:id
BookingRouter.get("/:id", BookingController.findById);
