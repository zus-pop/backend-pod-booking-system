import BookingController from "../../controllers/BookingController.ts";
import { Router } from "express";
import { validateEmptyObject } from "../../middlewares/emptyObject.ts";
import { authenticateToken } from "../../middlewares/authenticateToken.ts";

export const BookingRouter = Router();

// GET: api/v1/bookings
BookingRouter.get("/", BookingController.findAll);

// GET: api/v1/bookings/:id
BookingRouter.get("/:id", BookingController.findById);

// POST: api/v1/bookings
// BookingRouter.post("/", authenticateToken, validateEmptyObject, BookingController.create);

// PUT: api/v1/bookings
BookingRouter.put("/", validateEmptyObject, BookingController.update);
