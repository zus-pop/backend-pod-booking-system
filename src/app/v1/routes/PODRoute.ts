import { Router } from "express";
import PODController from "../../controllers/PODController.ts";

export const PODRouter = Router();

// GET: api/v1/pods
/**
 * @openapi
 * tags:
 *   name: PODs
 *   description: The PODs managing API
 * /api/v1/pods:
 *   get:
 *     summary: Get lists of PODs
 *     tags: [PODs]
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
 *                      pod_id:
 *                          type: integer
 *                          description: id of pod
 *                          example: 1
 *                      pod_name:
 *                          type: string
 *                          description: name of pod
 *                          example: POD A
 *                      type_id:
 *                          type: integer
 *                          description: type of pod
 *                          example: 1
 *                      is_available:
 *                          type: integer
 *                          description: status of pod
 *                          example: 1
 *       404:
 *         description: No PODs found
 *
 */
PODRouter.get("/", PODController.findAll);

// GET: api/v1/pods/:id
/**
 * @openapi
 * /api/v1/pods/{id}:
 *     get:
 *      summary: Get a single pod by its id
 *      tags: [PODs]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: number
 *            required: true
 *            description: The POD id
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              pod_id:
 *                                  type: integer
 *                                  description: id of pod
 *                                  example: 1
 *                              pod_name:
 *                                  type: string
 *                                  description: name of pod
 *                                  example: POD A
 *                              type_id:
 *                                  type: integer
 *                                  description: type of pod
 *                                  example: 1
 *                              is_available:
 *                                  type: integer
 *                                  description: status of pod
 *                                  example: 1
 *          404:
 *              description: No POD found
 *
 */
PODRouter.get("/:id", PODController.findById);
// GET: api/v1/pods/:id/utilities
/**
 * @openapi
 * /api/v1/pods/{id}/utilities:
 *     get:
 *      summary: Get utilities of a specific POD
 *      tags: [PODs]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: number
 *            required: true
 *            description: The POD id
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
 *              description: No utilities found for this POD
 */
PODRouter.get("/:id/utilities", PODController.findUtilitiesByPodId);
