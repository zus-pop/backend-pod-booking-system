import { Router } from "express";
import PODController from "../../controllers/PODController.ts";
import { upload } from "../../utils/google-cloud-storage.ts";

export const PODRouter = Router();

// GET: api/v1/pods/sorted-by-rating
/**
 * @openapi
 * /api/v1/pods/sorted-by-rating:
 *   get:
 *     summary: Get PODs sorted by average rating
 *     tags: [PODs]
 *     responses:
 *       200:
 *         description: List of PODs sorted by average rating
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pod_id:
 *                     type: integer
 *                     description: The POD ID
 *                     example: 1
 *                   pod_name:
 *                     type: string
 *                     description: The name of the POD
 *                     example: "Pod A"
 *                   avg_rating:
 *                     type: number
 *                     description: The average rating of the POD
 *                     example: 4.5
 *       500:
 *         description: Failed to fetch PODs
 */
PODRouter.get("/sorted-by-rating", PODController.sortPODByRating);

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
 *     parameters:
 *      - in: query
 *        name: name
 *        schema:
 *          type: string
 *        description: The name of the POD
 *      - in: query
 *        name: type_id
 *        schema:
 *          type: integer
 *        description: The id of the POD type
 *      - in: query
 *        name: column
 *        schema:
 *          type: string
 *          enum: [pod_id, pod_name]
 *        description: The list will be ordered by this column
 *      - in: query
 *        name: order
 *        schema:
 *          type: string
 *          enum: [ASC, asc, DESC, desc]
 *        description: order type of the list
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
PODRouter.get("/", PODController.find);

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
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 pod_name:
 *                   type: string
 *                   description: name of pod
 *                 description:
 *                   type: string
 *                   description: description of pod
 *                 image:
 *                   type: string
 *                   format: binary
 *                   description: image of pod
 *                 type_id:
 *                   type: integer
 *                   description: id type of pod
 *                 store_id:
 *                   type: integer
 *                   description: id store's pod
 *                 utilities:
 *                   type: string
 *                   description: list of id of utilities in a JSON format
 *                   example: "[1, 2, 3]"
 *       responses:
 *         201:
 *           description: POD created successfully
 *         400:
 *           description: Failed to create new POD
 */
PODRouter.post("/", upload.single("image"), PODController.createNewPod);

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
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 pod_name:
 *                   type: string
 *                   description: name of pod
 *                 description:
 *                   type: string
 *                   description: description of pod
 *                 image:
 *                   type: string
 *                   format: binary
 *                   description: image of pod
 *                 type_id:
 *                   type: integer
 *                   description: id type of pod
 *                 store_id:
 *                   type: integer
 *                   description: id store's pod
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
PODRouter.put("/:id", upload.single("image"), PODController.updatePOD);
