import BookingSlotController from "../../controllers/BookingSlotController.ts";
import { Router } from "express";

export const BookingSlotRouter = Router();

// GET: api/v1/booking-slots
/**
 * @openapi
 * tags:
 *  name: Booking Slots
 *  description: The Booking slots managing API
 * /api/v1/booking-slots:
 *  get:
 *      summary: Get list of Booking Slots
 *      tags: [Booking Slots]
 *      responses:
 *          200:
 *              description: Success.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: integer
 *                                      description: id of booking slot
 *                                      example: 2
 *                                  booking_id:
 *                                      type: integer
 *                                      description: id of booking
 *                                      example: 4
 *                                  slot_id:
 *                                      type: integer
 *                                      description: id of slot
 *                                      example: 8
 *          404:
 *              description: Not found any booking slot
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: response error message
 *                                  example: Not found any slot!
 */
BookingSlotRouter.get("/", BookingSlotController.findAllSlot);

// GET: api/v1/booking-slots/:booking_id
/**
 * @openapi
 * /api/v1/booking-slots/{booking_id}:
 *     get:
 *      summary: Get a single pod by its id
 *      tags: [Booking Slots]
 *      parameters:
 *          - in: path
 *            name: booking_id
 *            schema:
 *              type: number
 *            required: true
 *            description: The booking id
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: integer
 *                                      description: id of booking slot
 *                                      example: 2
 *                                  booking_id:
 *                                      type: integer
 *                                      description: id of booking
 *                                      example: 4
 *                                  slot_id:
 *                                      type: integer
 *                                      description: id of slot
 *                                      example: 8
 *          404:
 *              description: No POD found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: response error message
 *                                  example: Not found any slot!
 *
 */
BookingSlotRouter.get(
    "/:booking_id",
    BookingSlotController.findAllSlotByBookingId
);
