import { Router } from "express";
import PODController from "../../controllers/PODController.ts";
import { upload } from "../../utils/google-cloud-storage.ts";

export const PODRouter = Router();

// GET: api/v1/pods/average-usage-time
/**
 * @openapi
 * /api/v1/pods/average-usage-time:
 *   get:
 *     summary: Get average usage time for each POD
 *     tags: [PODs]
 *     responses:
 *       200:
 *         description: Successfully retrieved average usage times
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pod_id:
 *                     type: integer
 *                     description: The ID of the POD
 *                     example: 1
 *                   pod_name:
 *                     type: string
 *                     description: The name of the POD
 *                     example: "Pod A"
 *                   avg_usage_time:
 *                     type: number
 *                     format: float
 *                     description: The average usage time of the POD in minutes
 *                     example: 45.5
 *       404:
 *         description: No POD usage times found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No POD usage times found"
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
PODRouter.get("/average-usage-time", PODController.getAveragePodUsageTime);

// GET: api/v1/pods/total-revenue
/**
 * @openapi
 * /api/v1/pods/total-revenue:
 *   get:
 *     summary: Get total revenue for each POD
 *     tags: [PODs]
 *     responses:
 *       200:
 *         description: Successfully retrieved total revenue
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pod_id:
 *                     type: integer
 *                     description: The ID of the POD
 *                     example: 1
 *                   pod_name:
 *                     type: string
 *                     description: The name of the POD
 *                     example: "Pod A"
 *                   revenue:
 *                     type: number
 *                     format: float
 *                     description: The total revenue of the POD
 *                     example: 100000.0
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
PODRouter.get("/total-revenue", PODController.getTotalRevenueByPod);

// GET: api/v1/pods/daily-revenue
/**
 * @openapi
 * /api/v1/pods/daily-revenue:
 *   get:
 *     summary: Get daily revenue for all PODs
 *     tags: [PODs]
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
 *                     description: The daily total revenue of all PODs
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
PODRouter.get("/daily-revenue", PODController.getDailyRevenueByPOD);

// GET: api/v1/pods/monthly-revenue
/**
 * @openapi
 * /api/v1/pods/monthly-revenue:
 *   get:
 *     summary: Get monthly revenue for all PODs
 *     tags: [PODs]
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
 *                     description: The month of the revenue
 *                     example: "2023-10"
 *                   monthly_revenue:
 *                     type: number
 *                     format: float
 *                     description: The monthly revenue of the POD
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
PODRouter.get("/monthly-revenue", PODController.getMonthlyRevenueByPOD);

// GET: api/v1/pods/sorted-by-rating
/**
 * @openapi
 * /api/v1/pods/sorted-by-rating:
 *   get:
 *     summary: Get PODs sorted by average rating with optional filters
 *     tags: [PODs]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter PODs by name (partial match)
 *         example: "Pod A"
 *       - in: query
 *         name: type_id
 *         schema:
 *           type: integer
 *         description: Filter PODs by type_id
 *         example: 1
 *       - in: query
 *         name: column
 *         schema:
 *           type: string
 *           enum: [pod_id, pod_name, avg_rating]
 *         description: Column to sort by
 *         example: avg_rating
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order (ascending or descending)
 *         example: DESC
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
 *                     description: The ID of the POD
 *                     example: 1
 *                   pod_name:
 *                     type: string
 *                     description: The name of the POD
 *                     example: "Pod A"
 *                   avg_rating:
 *                     type: number
 *                     format: float
 *                     description: The average rating of the POD
 *                     example: 4.5
 *       404:
 *         description: No PODs found matching the criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No PODs found"
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
 *        name: orderBy
 *        schema:
 *          type: string
 *          enum: [pod_id, pod_name]
 *        description: The list will be ordered by this column
 *      - in: query
 *        name: direction
 *        schema:
 *          type: string
 *          enum: [ASC, asc, DESC, desc]
 *        description: order type of the list
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *        description: The size for each page of the POD list
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *        description: The current page of the POD list
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                  pods:
 *                      type: array
 *                      items:
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
 *                  total:
 *                      type: integer
 *                      description: total number of rows from the query result
 *                      example: 12
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
 *                 utilities:
 *                   type: string
 *                   description: list of id of utilities in a JSON format
 *                   example: [1, 2, 3]
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
