import BookingController from "../../controllers/BookingController.ts";
import { Router } from "express";
import { validateEmptyObject } from "../../middlewares/emptyObject.ts";
import { authenticateToken } from "../../middlewares/authenticateToken.ts";
import { checkAllAvailableSlot } from "../../middlewares/checkAllAvailableSlot.ts";
import BookingProductController from "../../controllers/BookingProductController.ts";
import BookingSlotController from "../../controllers/BookingSlotController.ts";

export const BookingRouter = Router();

// GET: api/v1/bookings
/**
 * @openapi
 * tags:
 *   name: Bookings
 *   description: The Payments managing API
 * /api/v1/bookings:
 *   get:
 *     summary: Get list of Bookings
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

// GET: api/v1/bookings/:id/products
/**
 * @openapi
 * /api/v1/bookings/{id}/products:
 *  get:
 *    summary: Get list of booking products by booking id
 *    tags: [Bookings]
 *    parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: number
 *            required: true
 *            description: The Booking id
 *    responses:
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
 *                              product_id:
 *                                  type: integer
 *                                  description: id of product
 *                                  example: 3
 *                              unit_price:
 *                                  type: integer
 *                                  format: double
 *                                  description: unit price of product
 *                                  example: 30000
 *                              quantity:
 *                                  type: integer
 *                                  description: quantity of product
 *                                  example: 2
 *          404:
 *              description: No booking products found
*/
BookingRouter.get("/:id/products", BookingProductController.findByBookingId);

// GET: api/v1/bookings/:id/slots
/**
 * @openapi
 * /api/v1/bookings/{id}/slots:
 *     get:
 *      summary: Get a list of booking slots by booking id
 *      tags: [Bookings]
 *      parameters:
 *          - in: path
 *            name: id
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
BookingRouter.get("/:id/slots", BookingSlotController.findAllSlotByBookingId);

// POST: api/v1/bookings
/**
* @openapi
 * /api/v1/bookings:
 *  post:
 *      summary: Create a new booking
 *      security:
 *          - Authorization: []
 *      tags: [Bookings]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          booking:
 *                              type: object
 *                              properties:
 *                                  pod_id:
 *                                      type: integer
 *                                      description: id of selected POD
 *                                      example: 1
 *                          bookingSlots:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      slot_id:
 *                                          type: integer
 *                                          description: id of POD's selected slot
 *                                          example: 1
 *                                      price:
 *                                          type: integer
 *                                          format: double
 *                                          description: the price for the selected slot
 *                                          example: 80000
 *      responses:
 *           200:
 *              description: Create a booking
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              payment_url:
 *                                  type: string
 *                                  description: payment link for from online payment API
 *                                  example: https://example.com/pay
 *                              message:
 *                                  type: string
 *                                  description: message about the response status
 *                                  example: Booking created successfully
 *           400:
 *               description: Create a booking failed
 *               content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                               message:
 *                                   type: string
 *                                   description: message about the response status failed
 *                                   example: Booking failed
 */
BookingRouter.post(
    "/",
    authenticateToken,
    validateEmptyObject,
    checkAllAvailableSlot,
    BookingController.create
);

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
