import PaymentController from "../../controllers/PaymentController.ts";
import { Router } from "express";

export const PaymentRouter = Router();

// GET: api/v1/payments/daily-revenue
/**
 * @openapi
 * /api/v1/payments/daily-revenue:
 *   get:
 *     summary: Get daily revenue from payments
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Successfully retrieved daily revenue
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: The date of the revenue
 *                     example: 2024-08-30
 *                   daily_revenue:
 *                     type: number
 *                     format: float
 *                     description: The total revenue for the day
 *                     example: 80000
 *       404:
 *         description: No revenue data found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No revenue data found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
PaymentRouter.get("/daily-revenue", PaymentController.getDailyRevenue);

// GET: api/v1/payments/monthly-revenue
/**
 * @openapi
 * /api/v1/payments/monthly-revenue:
 *   get:
 *     summary: Get monthly revenue from payments
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Successfully retrieved monthly revenue
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   year:
 *                     type: integer
 *                     description: The year of the revenue
 *                     example: 2024
 *                   month:
 *                     type: integer
 *                     description: The month of the revenue
 *                     example: 8
 *                   monthly_revenue:
 *                     type: number
 *                     format: float
 *                     description: The total revenue for the month
 *                     example: 240000
 *       404:
 *         description: No revenue data found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No revenue data found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
PaymentRouter.get("/monthly-revenue", PaymentController.getMonthlyRevenue);

// GET: api/v1/payments
/**
 * @openapi
 * tags:
 *   name: Payments
 *   description: The Payments managing API
 * /api/v1/payments:
 *   get:
 *     summary: Get lists of Payments
 *     tags: [Payments]
 *     parameters:
 *          - in: query
 *            name: payment_status
 *            schema:
 *              type: string
 *              enum: [Unpaid, Paid, Failed]
 *            description: Status of the payment
 *          - in: query
 *            name: payment_date
 *            schema:
 *              type: string
 *              format: date
 *            description: Date of the payment
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 *            description: The size for each page of the Payment list
 *          - in: query
 *            name: page
 *            schema:
 *              type: integer
 *            description: The current page of the Payment list
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
 *                      payment_id:
 *                          type: integer
 *                          description: id of payment
 *                          example: 1
 *                      booking_id:
 *                          type: integer
 *                          description: id of booking
 *                          example: 1
 *                      transaction_id:
 *                          type: integer
 *                          description: id of online payment API
 *                          example: 12413_123912
 *                      total_cost:
 *                          type: integer
 *                          description: total cost of booking
 *                          example: 80000
 *                      payment_date:
 *                          type: string
 *                          format: date-time
 *                          description: date-time of payment
 *                          example: 2024-08-30T15:00:08Z
 *                      payment_status:
 *                          type: string
 *                          description: status of payment
 *                          enum: [Processing, Unpaid, Paid, Failed]
 *                          example: Unpaid
 *       404:
 *         description: No Payments found
 *
 */
PaymentRouter.get("/", PaymentController.find);

// GET: api/v1/payments/:id
/**
 * @openapi
 * /api/v1/payments/{id}:
 *     get:
 *      summary: Get a payment by its id
 *      tags: [Payments]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: number
 *            required: true
 *            description: The Payment id
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              payment_id:
 *                                  type: integer
 *                                  description: id of payment
 *                                  example: 1
 *                              booking_id:
 *                                  type: integer
 *                                  description: id of booking
 *                                  example: 1
 *                              transaction_id:
 *                                  type: integer
 *                                  description: id of online payment API
 *                                  example: 12413_123912
 *                              total_cost:
 *                                  type: integer
 *                                  description: total cost of booking
 *                                  example: 80000
 *                              payment_date:
 *                                  type: string
 *                                  format: date-time
 *                                  description: date-time of payment
 *                                  example: 2024-08-30T15:00:08Z
 *                              payment_status:
 *                                  type: string
 *                                  description: status of payment
 *                                  enum: [Processing, Unpaid, Paid, Failed]
 *                                  example: Unpaid
 *          404:
 *              description: Payment not found
 *
 */
PaymentRouter.get("/:id", PaymentController.findById);

// POST: api/v1/payments/callback-slot
PaymentRouter.post("/callback-slot", PaymentController.callbackSlot);

// POST: api/c1/payments/callback-product
PaymentRouter.post("/callback-product", PaymentController.callbackProduct);
