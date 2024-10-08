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

// POST: api/v1/pods
/**
 * @openapi
 * /api/v1/pods:
 *     post:
 *       summary: Create a new POD
 *       tags: [PODs]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pod_id:
 *                   type: integer
 *                   description: id of pod
 *                 pod_name:
 *                   type: string
 *                   description: name of pod
 *                 type_id:
 *                   type: integer
 *                   description: type of pod
 *                 is_available:
 *                   type: integer
 *                   description: availability status
 *       responses:
 *         201:
 *           description: POD created successfully
 *         400:
 *           description: Failed to create new POD
 */
PODRouter.post("/", PODController.createNewPod);

// DELETE: api/v1/pods/:id
/**
 * @openapi
 * /api/v1/pods/{id}:
 *   delete:
 *     summary: Mark a POD as unavailable by its id
 *     tags: [PODs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The POD id
 *     responses:
 *       200:
 *         description: POD marked as unavailable successfully
 *       404:
 *         description: No POD found or failed to update
 */
PODRouter.delete("/:id", PODController.deleteOnePod);

// PUT: api/v1/pods/{id}
/**
 * @openapi
 * /api/v1/pods/{id}:
 *  put:
 *      summary: Update a POD by ID
 *      tags: [PODs]
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          description: The ID of the POD
 *          schema:
 *            type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          pod_name:
 *                              type: string
 *                              description: Name of the POD
 *                              example: "Updated POD A"
 *                          type_id:
 *                              type: number
 *                              description: Type of the POD
 *                              example: 2
 *                          description:
 *                              type: string
 *                              description: Description of the POD
 *                              example: "This is an updated POD"
 *                          is_available:
 *                              type: boolean
 *                              description: Availability of the POD
 *                              example: true
 *      responses:
 *          200:
 *              description: POD updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: integer
 *                                  description: ID of the updated POD
 *                                  example: 1
 *                              pod_name:
 *                                  type: string
 *                                  description: Name of the POD
 *                                  example: "Updated POD A"
 *          404:
 *              description: POD not found
 */
PODRouter.put("/:id", PODController.updatePOD);
