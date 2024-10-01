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
