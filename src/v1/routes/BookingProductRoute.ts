import { Router } from "express";
import BookingProductController from "../../controllers/BookingProductController.ts";

export const BookingProductRouter = Router();

// GET: api/v1/booking-products
/**
 * @openapi
 * tags:
 *   name: Booking Products
 *   description: The Payments managing API
 * /api/v1/booking-products:
 *   get:
 *     summary: Get lists of Payments
 *     tags: [Booking Products]
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
 *                      product_id:
 *                          type: integer
 *                          description: id of product
 *                          example: 3
 *                      unit_price:
 *                          type: integer
 *                          format: double
 *                          description: unit price of product
 *                          example: 30000
 *                      quantity:
 *                          type: integer
 *                          description: quantity of product
 *                          example: 2
 *       404:
 *         description: No booking products found
 *
 */
BookingProductRouter.get("/", BookingProductController.findAll);

// GET: api/v1/booking-products/:booking_id
/**
 * @openapi
 * /api/v1/booking-products/{booking_id}:
 *  get:
 *    summary: Get a single booking by its id
 *    tags: [Booking Products]
 *    parameters:
 *          - in: path
 *            name: booking_id
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
BookingProductRouter.get(
    "/:booking_id",
    BookingProductController.findByBookingId
);
