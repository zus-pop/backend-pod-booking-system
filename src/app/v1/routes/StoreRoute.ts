import PODController from "../../controllers/PODController.ts";
import StoreController from "../../controllers/StoreController.ts";
import { Router } from "express";
import { upload } from "../../utils/google-cloud-storage.ts";
import StorePriceController from "../../controllers/StorePriceController.ts";

export const StoreRouter = Router();

// GET: api/v1/stores
/**
 * @openapi
 * tags:
 *  name: Stores
 *  description: The Stores managing API
 * /api/v1/stores:
 *  get:
 *      summary: Get list of Stores
 *      tags: [Stores]
 *      parameters:
 *        - in: query
 *          name: store_name
 *          schema:
 *              type: string
 *          description: The name of the Store
 *        - in: query
 *          name: address
 *          schema:
 *              type: string
 *          description: The address of the Store
 *        - in: query
 *          name: page
 *          schema:
 *              type: number
 *          description: The current page of the Store list
 *        - in: query
 *          name: limit
 *          schema:
 *              type: number
 *          description: The size for each page of the Store list
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              stores:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          store_id:
 *                                              type: integer
 *                                              description: id of store
 *                                              example: 1
 *                                          store_name:
 *                                              type: string
 *                                              description: name of store
 *                                              example: 2
 *                                          address:
 *                                              type: string
 *                                              description: address of store
 *                                              example: Quan 1, TP.Ho Chi Minh
 *                                          hotline:
 *                                              type: string
 *                                              description: hotline of store
 *                                              example: 0123456789
 *                                          image:
 *                                              type: string
 *                                              description: imageUrl of store
 *                                              example: https://googleapis/...
 *                              total:
 *                                  type: integer
 *                                  description: total number of rows from the query (use this to set the pagination)
 *                                  example: 8
 *          404:
 *              description: No stores found
 */
StoreRouter.get("/", StoreController.find);

// GET: api/v1/stores/total-revenue
/**
 * @openapi
 * /api/v1/stores/total-revenue:
 *   get:
 *     summary: Get total revenue for each store
 *     tags: [Stores]
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
 *                   store_id:
 *                     type: integer
 *                     description: The ID of the store
 *                     example: 1
 *                   store_name:
 *                     type: string
 *                     description: The name of the store
 *                     example: "Store A"
 *                   revenue:
 *                     type: number
 *                     format: float
 *                     description: The total revenue of the store
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
StoreRouter.get("/total-revenue", StoreController.getTotalRevenueByStore);

// GET: api/v1/stores/:id/daily-revenue
/**
 * @openapi
 * /api/v1/stores/{id}/daily-revenue:
 *   get:
 *     summary: Get daily revenue for a store
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The Store id
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
 *                     description: The daily revenue of the store
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
StoreRouter.get("/:id/daily-revenue", StoreController.getDailyRevenueByStore);

// GET: api/v1/stores/:id
/**
 * @openapi
 * /api/v1/stores/{id}:
 *     get:
 *      summary: Get a single store by its id
 *      tags: [Stores]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: number
 *            required: true
 *            description: The Store id
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                  store_id:
 *                                      type: integer
 *                                      description: id of store
 *                                      example: 1
 *                                  store_name:
 *                                      type: string
 *                                      description: name of store
 *                                      example: 2
 *                                  address:
 *                                      type: string
 *                                      description: address of store
 *                                      example: Quan 1, TP.Ho Chi Minh
 *                                  hotline:
 *                                      type: string
 *                                      description: hotline of store
 *                                      example: 0123456789
 *                                  image:
 *                                      type: string
 *                                      description: imageUrl of store
 *                                      example: https://googleapis/...
 *          404:
 *              description: Store not found
 *
 */
StoreRouter.get("/:id", StoreController.findById);

/**
 * @openapi
 * /api/v1/stores/{id}/pods:
 *     get:
 *      summary: Get list of pods by store id
 *      tags: [Stores]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: number
 *            required: true
 *            description: The Store id
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 *            description: The size for each page of the POD list
 *          - in: query
 *            name: page
 *            schema:
 *              type: integer
 *            description: The current page of the POD list
 *      responses:
 *        200:
 *          description: Success.
 *          content:
 *            application/json:
 *              schema:
 *               type: array
 *               items:
 *                   type: object
 *                   properties:
 *                       pod_id:
 *                           type: integer
 *                           description: id of pod
 *                           example: 1
 *                       pod_name:
 *                           type: string
 *                           description: name of pod
 *                           example: POD A
 *                       type_id:
 *                           type: integer
 *                           description: type of pod
 *                           example: 1
 *                       is_available:
 *                           type: integer
 *                           description: status of pod
 *                           example: 1
 *        404:
 *          description: No PODs found
 */
StoreRouter.get("/:id/pods", PODController.findByStoreId);

// GET: api/v1/stores/:store_id/pod-type/:type_id/prices
/**
 * @openapi
 * /api/v1/stores/{store_id}/pod-type/{type_id}/prices:
 *  get:
 *      summary: Get list of Store Prices
 *      tags: [Stores]
 *      parameters:
 *          - in: path
 *            name: store_id
 *            schema:
 *              type: number
 *            required: true
 *            description: The Store id
 *          - in: path
 *            name: type_id
 *            schema:
 *              type: number
 *            required: true
 *            description: The POD type id
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 *            description: The size for each page of the list
 *          - in: query
 *            name: page
 *            schema:
 *              type: integer
 *            description: The current page of the list
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
 *                                  id:
 *                                      type: integer
 *                                      description: id of store price
 *                                      example: 1
 *                                  start_hour:
 *                                      type: integer
 *                                      description: start hour
 *                                      example: 7
 *                                  end_hour:
 *                                      type: integer
 *                                      description: end hour
 *                                      example: 12
 *                                  price:
 *                                      type: integer
 *                                      description: price for time slot
 *                                      example: 80000
 *                                  store_id:
 *                                      type: integer
 *                                      description: id of store
 *                                      example: 4
 *                                  type:
 *                                      type: object
 *                                      properties:
 *                                          type_id:
 *                                              type: integer
 *                                              description: pod type id map to the time frame
 *                                              example: 3
 *                                          type_name:
 *                                              type: string
 *                                              description: pod type name
 *                                              example: Single POD
 *                                          capacity:
 *                                              type: integer
 *                                              description: pod type id map to the time frame
 *                                              example: 1
 *                                  days_of_week:
 *                                      type: integer
 *                                      description: the num of days that the time frame is applied for describe in 7 bits
 *                                      example: 127
 *                                  priority:
 *                                      type: integer
 *                                      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 *                                      description: days of the week
 *                                      example: 8
 *          404:
 *              description: No store prices found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: error message response
 *                                  example: No store prices found!
 */
StoreRouter.get(
  "/:store_id/pod-type/:type_id/prices",
  StorePriceController.findByStoreIdAndTypeId
);

// POST: api/v1/stores
/**
 * @openapi
 * /api/v1/stores:
 *   post:
 *     summary: Create a new Store
 *     tags: [Stores]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               store_name:
 *                 type: string
 *                 description: name of the store
 *               address:
 *                 type: string
 *                 description: address of the store
 *               hotline:
 *                 type: string
 *                 description: hotline of the store
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: image of the store
 *     responses:
 *       201:
 *         description: Store created successfully
 *       400:
 *         description: Failed to create new Store
 */
StoreRouter.post("/", upload.single("image"), StoreController.createNewStore);

/**
 * @openapi
 * /api/v1/stores/{id}:
 *  put:
 *      summary: Update a Store by ID
 *      tags: [Stores]
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          description: The ID of the Store
 *          schema:
 *            type: integer
 *      requestBody:
 *          required: true
 *          content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 store_name:
 *                   type: string
 *                   description: name of store
 *                 address:
 *                   type: string
 *                   description: address of store
 *                 hotline:
 *                   type: string
 *                   description: contact hotline of store
 *                 image:
 *                   type: string
 *                   format: binary
 *                   description: image of store
 *      responses:
 *          200:
 *              description: Store updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              store_id:
 *                                  type: integer
 *                                  description: ID of the updated Store
 *                                  example: 1
 *                              store_name:
 *                                  type: string
 *                                  description: Name of the Store
 *                                  example: "Updated Store A"
 *          404:
 *              description: Store not found
 */
StoreRouter.put("/:id", upload.single("image"), StoreController.updateStore);

// DELETE: api/v1/stores/:id
/**
 * @openapi
 * /api/v1/stores/{id}:
 *   delete:
 *     summary: Delete a Store by ID
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The Store id
 *     responses:
 *       200:
 *         description: Store deleted
 *       404:
 *         description: Store not found
 */
StoreRouter.delete("/:id", StoreController.deleteStore);
