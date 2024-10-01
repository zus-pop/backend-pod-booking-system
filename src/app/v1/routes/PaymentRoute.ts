import PaymentController from "../../controllers/PaymentController.ts";
import { Router } from "express";

export const PaymentRouter = Router();

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
PaymentRouter.get("/", PaymentController.findAll);

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

// POST: api/v1/payments/callback
PaymentRouter.post("/callback", PaymentController.callback);
