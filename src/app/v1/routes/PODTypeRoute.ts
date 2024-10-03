import PODTypeController from "../../controllers/PODTypeController.ts";
import { Router } from "express";

export const PODTypeRouter = Router();

// GET: api/v1/pod-types
/**
 * @openapi
 * tags:
 *  name: POD Types
 *  description: The POD Types managing API
 * /api/v1/pod-types:
 *  get:
 *      summary: Get list of POD types
 *      tags: [POD Types]
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
 *                                  type_id:
 *                                      type: integer
 *                                      description: id of pod type
 *                                      example: 1
 *                                  type_name:
 *                                      type: string
 *                                      description: name of pod type
 *                                      example: Meeting POD
 *                                  capacity:
 *                                      type: number
 *                                      example: 6
 *          404:
 *              description: No POD Types found
 */
PODTypeRouter.get("/", PODTypeController.findAll);

// GET: api/v1/pod-types/:id
/**
 * @openapi
 * /api/v1/pod-types/{id}:
 *     get:
 *      summary: Get a single pod type by its id
 *      tags: [POD Types]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: number
 *            required: true
 *            description: The POD Type id
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                  type_id:
 *                                      type: integer
 *                                      description: id of pod type
 *                                      example: 1
 *                                  type_name:
 *                                      type: string
 *                                      description: name of pod type
 *                                      example: Meeting POD
 *                                  capacity:
 *                                      type: number
 *                                      example: 6
 *          404:
 *              description: POD Type not found
 *
 */
PODTypeRouter.get("/:id", PODTypeController.findById);