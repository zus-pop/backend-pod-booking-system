import SlotController from "../../controllers/SlotController.ts";
import { Router } from "express";
import { validateEmptyObject } from "../../middlewares/emptyObject.ts";

export const SlotRouter = Router();

// GET: api/v1/slots
/**
 * @openapi
 * tags:
 *  name: Slots
 *  description: The Slots managing API
 * /api/v1/slots:
 *  get:
 *      summary: Get list of Slots
 *      tags: [Slots]
 *      parameters:
 *          - in: query
 *            name: pod_id
 *            schema:
 *              type: integer
 *            description: id of the pod
 *          - in: query
 *            name: date
 *            schema:
 *              type: string
 *              format: date
 *            description: selected date for list of slots
 *          - in: query
 *            name: start_time
 *            schema:
 *              type: string
 *            description: time start for list of slots
 *          - in: query
 *            name: end_time
 *            schema:
 *              type: string
 *            description: time end for list of slots
 *          - in: query
 *            name: is_available
 *            schema:
 *              type: boolean
 *            description: available status for list of slots
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  slot_id:
 *                                      type: integer
 *                                      description: id of slot
 *                                      example: 1
 *                                  pod_id:
 *                                      type: string
 *                                      description: id of pod
 *                                      example: 2
 *                                  start_time:
 *                                      type: string
 *                                      format: date-time
 *                                      example: 2024-08-30T07:00:00Z
 *                                  end_time:
 *                                      type: string
 *                                      format: date-time
 *                                      example: 2024-08-30T08:00:00Z
 *                                  price:
 *                                      type: number
 *                                      format: double
 *                                      example: 80000
 *                                  is_available:
 *                                      type: number
 *                                      example: 1
 */
SlotRouter.get("/", SlotController.find);

// GET: api/v1/slots/daily-revenue
/**
 * @openapi
 * /api/v1/slots/daily-revenue:
 *   get:
 *     summary: Get daily revenue for all slots
 *     tags: [Slots]
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
 *                     example: "2023-10-01"
 *                   daily_revenue:
 *                     type: number
 *                     format: float
 *                     description: The daily revenue
 *                     example: 1000.0
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
SlotRouter.get("/daily-revenue", SlotController.getDailyRevenueBySlot);

// GET: api/v1/slots/monthly-revenue
/**
 * @openapi
 * /api/v1/slots/monthly-revenue:
 *   get:
 *     summary: Get monthly revenue for all slots
 *     tags: [Slots]
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
 *                   month:
 *                     type: string
 *                     format: date
 *                     description: The month of the revenue
 *                     example: "2023-10"
 *                   monthly_revenue:
 *                     type: number
 *                     format: float
 *                     description: The monthly revenue
 *                     example: 10000.0
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
SlotRouter.get("/monthly-revenue", SlotController.getMonthlyRevenueBySlot);

// GET: api/v1/slots/total-revenue
/**
 * @openapi
 * /api/v1/slots/total-revenue:
 *   get:
 *     summary: Get total slot revenue
 *     tags: [Slots]
 *     responses:
 *       200:
 *         description: Successfully retrieved total slot revenue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSlotRevenue:
 *                   type: number
 *                   format: float
 *                   description: The total revenue of all slots
 *                   example: 1000000.0
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
SlotRouter.get("/total-revenue", SlotController.getTotalSlotRevenue);

// GET: api/v1/slots/total-slot-refunded
/**
 * @openapi
 * /api/v1/slots/total-slot-refunded:
 *   get:
 *     summary: Get total number of refunded slots
 *     tags: [Slots]
 *     responses:
 *       200:
 *         description: Successfully retrieved total number of refunded slots
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSlotsRefunded:
 *                   type: number
 *                   description: The total number of refunded slots
 *                   example: 5
 *       404:
 *         description: No refunded slots found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No refunded slots found"
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
SlotRouter.get("/total-slot-refunded", SlotController.getTotalSlotsRefunded);

// GET: api/v1/slots/total-refunded-amount
/**
 * @openapi
 * /api/v1/slots/total-refunded-amount:
 *   get:
 *     summary: Get total refunded amount
 *     tags: [Slots]
 *     responses:
 *       200:
 *         description: Successfully retrieved total refunded amount
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRefunded:
 *                   type: number
 *                   description: The total refunded amount
 *                   example: 5000
 *       404:
 *         description: No refunded amount found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No refunded amount found"
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
SlotRouter.get("/total-refunded-amount", SlotController.getTotalRefundedAmount);

// GET: api/v1/slots/daily-refunded-amount
/**
 * @openapi
 * /api/v1/slots/daily-refunded-amount:
 *   get:
 *     summary: Get daily refunded amount for slots
 *     tags: [Slots]
 *     responses:
 *       200:
 *         description: Successfully retrieved daily refunded amount
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
 *                     description: The date of the refund
 *                     example: "2023-10-01"
 *                   total_refunded:
 *                     type: number
 *                     description: The total refunded amount for the day
 *                     example: 5000
 *       404:
 *         description: No refunded amount found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No refunded amount found"
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
SlotRouter.get(
    "/daily-refunded-amount",
    SlotController.getDailyRefundedAmountBySlot
);

// GET: api/v1/slots/:id
/**
 * @openapi
 * /api/v1/slots/{id}:
 *  get:
 *      summary: Get a single slot by its id
 *      tags: [Slots]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *                type: number
 *            required: true
 *            description: The slot id
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                  slot_id:
 *                                      type: integer
 *                                      description: id of slot
 *                                      example: 1
 *                                  pod_id:
 *                                      type: string
 *                                      description: id of pod
 *                                      example: 2
 *                                  start_time:
 *                                      type: string
 *                                      format: date-time
 *                                      example: 2024-08-30T07:00:00Z
 *                                  end_time:
 *                                      type: string
 *                                      format: date-time
 *                                      example: 2024-08-30T08:00:00Z
 *                                  price:
 *                                      type: number
 *                                      format: double
 *                                      example: 80000
 *                                  is_available:
 *                                      type: number
 *                                      example: 1
 */
SlotRouter.get("/:id", SlotController.findById);

// POST: api/v1/slots
/**
 * @openapi
 * /api/v1/slots:
 *  post:
 *      summary: Generate slots
 *      tags: [Slots]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          startDate:
 *                              type: string
 *                              format: date
 *                              description: Start date for generating slots
 *                              example: 2024-08-30
 *                          endDate:
 *                              type: string
 *                              format: date
 *                              description: End date for generating slots
 *                              example: 2024-08-30
 *                          startHour:
 *                              type: integer
 *                              description: Start hour for generating slots
 *                              example: 7
 *                          endHour:
 *                              type: integer
 *                              description: End hour for generating slots
 *                              example: 10
 *                          durationMinutes:
 *                              type: integer
 *                              description: Duration for each slot by minute
 *                              example: 30
 *                          pod_id:
 *                              type: integer
 *                              description: id of the target pod for generating slots
 *                              example: 1
 *                          price:
 *                              type: integer
 *                              format: double
 *                              description: unit price for each slot
 *                              example: 80000
 *      responses:
 *          201:
 *              description: Slot created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: the number of slots are generated
 *          400:
 *              description: Overlapping slot
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: The overlapping slot and the overlap type
 */
SlotRouter.post("/", SlotController.generateSlots);

// PUT: api/v1/slots/:id
/**
 * @openapi
 * /api/v1/slots/{id}:
 *  put:
 *      summary: Update slot
 *      tags: [Slots]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *                type: number
 *            required: true
 *            description: The slot id
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          price:
 *                              type: integer
 *                              format: double
 *                              description: unit price for each slot
 *                              example: 80000
 *                          is_available:
 *                              type: boolean
 *                              description: available status of slot
 *                              example: true
 *      responses:
 *          201:
 *              description: Slot updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message response
 *          400:
 *              description: Update Failed
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: The overlapping slot and the overlap type
 */
SlotRouter.put("/:id", validateEmptyObject, SlotController.updateSlot);

// DELETE: api/v1/slots/:id
/**
 * @openapi
 * /api/v1/slots/{id}:
 *  delete:
 *      summary: Delete slot
 *      tags: [Slots]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *                type: number
 *            required: true
 *            description: The slot id
 *      responses:
 *          201:
 *              description: Slot deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: the number of slots are generated
 *          400:
 *              description: Delete failed
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: The overlapping slot and the overlap type
 */
SlotRouter.delete("/:id", SlotController.removeSlot);
