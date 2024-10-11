import PODController from "../../controllers/PODController.ts";
import StoreController from "../../controllers/StoreController.ts";
import { Router } from "express";

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
 *                                      example: Quan 1, TP.Ho Chi Minh
 *                                  hotline:
 *                                      type: string
 *                                      example: 0123456789
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
 *                                      example: Quan 1, TP.Ho Chi Minh
 *                                  hotline:
 *                                      type: string
 *                                      example: 0123456789
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
