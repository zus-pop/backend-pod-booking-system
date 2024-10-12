import SlotController from "../../controllers/SlotController.ts";
import { Router } from "express";

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
 *                                  unit_price:
 *                                      type: number
 *                                      format: double
 *                                      example: 80000
 *                                  is_available:
 *                                      type: number
 *                                      example: 1
 */
SlotRouter.get("/", SlotController.findAll);

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
 *                                  unit_price:
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
 *                          unit_price:
 *                              type: integer
 *                              format: double
 *                              description: unit price for each slot
 *                              example: 80000
 *      responses:
 *          200:
 *              description: Slots created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: number
 *                              description: id of the generated slot
 *                              example: [1, 2, 3]
 */
SlotRouter.post("/", SlotController.generateSlots);
