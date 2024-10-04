import PODUtilityController from "../../controllers/PODUtilityController.ts";
import { Router } from "express";

export const PODUtilityRouter = Router();

// GET: api/v1/pod-utilities
/**
 * @openapi
 * tags:
 *  name: POD Utilities
 *  description: The POD Utilities managing API
 * /api/v1/pod-utilities:
 *  get:
 *      summary: Get list of POD utilities
 *      tags: [POD Utilities]
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
 *                                  utility_id:
 *                                      type: integer
 *                                      description: id of pod utility
 *                                      example: 1
 *                                  utility_name:
 *                                      type: string
 *                                      description: name of pod utility
 *                                      example: Whiteboard
 *                                  utility_description:
 *                                      type: string
 *                                      example: Whiteboard for meetings
 *          404:
 *              description: No POD Utilities found
 */
PODUtilityRouter.get("/", PODUtilityController.findAll);

// GET: api/v1/pod-utilities/:id
/**
 * @openapi
 * /api/v1/pod-utilities/{id}:
 *     get:
 *      summary: Get a single pod utility by its id
 *      tags: [POD Utilities]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: number
 *            required: true
 *            description: The POD Utility id
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              utility_id:
 *                                  type: integer
 *                                  description: id of pod utility
 *                                  example: 1
 *                              utility_name:
 *                                  type: string
 *                                  description: name of pod utility
 *                                  example: Whiteboard
 *                              utility_description:
 *                                  type: string
 *                                  example: Whiteboard for meetings
 *          404:
 *              description: POD Utility not found
 */
PODUtilityRouter.get("/:id", PODUtilityController.findById);
