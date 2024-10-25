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
