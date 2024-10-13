import PODController from "../../controllers/PODController.ts";
import StoreController from "../../controllers/StoreController.ts";
import { Router } from "express";
import { upload } from "../../utils/google-cloud-storage.ts";

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
 *              description: No stores found
 */
StoreRouter.get("/", StoreController.findAll);

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
