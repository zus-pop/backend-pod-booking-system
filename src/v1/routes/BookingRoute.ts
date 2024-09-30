import BookingController from "../../controllers/BookingController.ts";
import { Router } from "express";
import { validateEmptyObject } from "../../middlewares/emptyObject.ts";

export const BookingRouter = Router();

// GET: api/v1/bookings
/**
 * @openapi
 * tags:
 *   name: Bookings
 *   description: The Payments managing API
 * /api/v1/bookings:
 *   get:
 *     summary: Get lists of Payments
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *              type: array
 *              items:
 *                  type: object
 *                  properties:
 *                      booking_id:
 *                          type: integer
 *                          description: id of booking
 *                          example: 1
 *                      pod_id:
 *                          type: integer
 *                          description: id of pod
 *                          example: 3
 *                      user_id:
 *                          type: integer
 *                          description: id of user
 *                          example: 4
 *                      rating:
 *                          type: integer
 *                          format: double
 *                          description: rating of booking
 *                          example: 5.0
 *                      comment:
 *                          type: string
 *                          description: feedback of booking
 *                          example: đỉnh nóc, kịch trần, bay phấp phới
 *                      booking_date:
 *                          type: string
 *                          format: date-time
 *                          description: date-time of booking
 *                          example: 2024-05-28T12:30:08Z
 *                      booking_status:
 *                          type: string
 *                          description: status of booking
 *                          enum: [Pending, Confirmed, Canceled, Completed, Ongoing]
 *                          example: Pending
 *       404:
 *         description: No bookings found
 *
 */
BookingRouter.get("/", BookingController.findAll);

// GET: api/v1/bookings/:id
/**
 * @openapi
 * /api/v1/bookings/{id}:
 *     get:
 *      summary: Get a single booking by its id
 *      tags: [Bookings]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: number
 *            required: true
 *            description: The Booking id
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              booking_id:
 *                                  type: integer
 *                                  description: id of booking
 *                                  example: 1
 *                              pod_id:
 *                                  type: integer
 *                                  description: id of pod
 *                                  example: 3
 *                              user_id:
 *                                  type: integer
 *                                  description: id of user
 *                                  example: 4
 *                              rating:
 *                                  type: integer
 *                                  format: double
 *                                  description: rating of booking
 *                                  example: 5.0
 *                              comment:
 *                                  type: string
 *                                  description: feedback of booking
 *                                  example: đỉnh nóc, kịch trần, bay phấp phới
 *                              booking_date:
 *                                  type: string
 *                                  format: date-time
 *                                  description: date-time of booking
 *                                  example: 2024-05-28T12:30:08Z
 *                              booking_status:
 *                                  type: string
 *                                  description: status of booking
 *                                  enum: [Pending, Confirmed, Canceled, Complete, Ongoing]
 *                                  example: Pending
 *          404:
 *              description: Booking found
*
*/
BookingRouter.get("/:id", BookingController.findById);

// POST: api/v1/bookings
// BookingRouter.post("/", authenticateToken, validateEmptyObject, BookingController.create);

// PUT: api/v1/bookings
/**
 * @openapi
 * /api/v1/bookings:
 *  put:
 *      summary: Update Booking status
 *      tags: [Bookings]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          booking_id:
 *                              type: integer
 *                              required: true
 *                          booking_status:
 *                              type: string
 *                              required: true
 *                              enum: [Pending, Confirmed, Canceled, Complete, Ongoing]
 *      responses:
 *          200:
 *              description: Update successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              result:
 *                                  type: object
 *                                  description: result meta data
 *                              message:
 *                                  type: string
 *                                  description: update message response
 *                                  example: Update successfully
 *          404:
 *              description: Update Failed
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: update message response
 *                                  example: Booking not found
*/
BookingRouter.put("/", validateEmptyObject, BookingController.update);
