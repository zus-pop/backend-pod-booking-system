import { Router } from "express";
import StorePriceController from "../../controllers/StorePriceController.ts";
import { validateEmptyObject } from "../../middlewares/emptyObject.ts";

export const StorePriceRouter = Router();

// GET: api/v1/store-prices
/**
 * @openapi
 * tags:
 *  name: Store Prices
 *  description: The Store Prices managing API
 * /api/v1/store-prices:
 *  get:
 *      summary: Get list of Store Prices
 *      tags: [Store Prices]
 *      parameters:
 *          - in: query
 *            name: store_id
 *            schema:
 *              type: number
 *            description: id of store
 *          - in: query
 *            name: type_id
 *            schema:
 *              type: number
 *            description: id of POD type
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
StorePriceRouter.get("/", StorePriceController.find);

// POST: api/v1/store-prices
/**
 * @openapi
 * /api/v1/store-prices:
 *  post:
 *      summary: Create new store price
 *      tags: [Store Prices]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          start_hour:
 *                              type: integer
 *                              description: Start hour for store price
 *                              example: 6
 *                          end_hour:
 *                              type: integer
 *                              description: End hour for store price
 *                              example: 12
 *                          price:
 *                              type: integer
 *                              description: price for the period
 *                              example: 80000
 *                          type_id:
 *                              type: integer
 *                              description: id of pod type
 *                              example: 1
 *                          store_id:
 *                              type: integer
 *                              description: id of store
 *                              example: 1
 *                          days_of_week:
 *                              type: array
 *                              items:
 *                                  type: string
 *                                  description: days of the week
 *                                  example: Monday
 *                          priority:
 *                              type: integer
 *                              enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 *                              description: days of the week
 *                              example: 8
 *      responses:
 *          201:
 *              description: Store price updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: success message response
 *          400:
 *              description: Updated failed
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: failed message response
 */
StorePriceRouter.post(
    "/",
    validateEmptyObject,
    StorePriceController.createNewStorePrice
);

// PUT: api/v1/store-prices/:id
/**
 * @openapi
 * /api/v1/store-prices/{id}:
 *  put:
 *      summary: Update new store price
 *      tags: [Store Prices]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *                type: number
 *            required: true
 *            description: The store price id
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          start_hour:
 *                              type: integer
 *                              description: Start hour for store price
 *                              example: 6
 *                          end_hour:
 *                              type: integer
 *                              description: End hour for store price
 *                              example: 12
 *                          price:
 *                              type: integer
 *                              description: price for the period
 *                              example: 80000
 *                          type_id:
 *                              type: integer
 *                              description: id of pod type
 *                              example: 1
 *                          store_id:
 *                              type: integer
 *                              description: id of store
 *                              example: 1
 *                          days_of_week:
 *                              type: array
 *                              items:
 *                                  type: string
 *                                  description: days of the week
 *                                  example: Monday
 *                          priority:
 *                              type: integer
 *                              enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 *                              description: days of the week
 *                              example: 8
 *      responses:
 *          201:
 *              description: Store price created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: success message response
 *          400:
 *              description: Created failed
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: failed message response
 */
StorePriceRouter.put(
    "/:id",
    validateEmptyObject,
    StorePriceController.updateStorePrice
);

// DELETE: api/v1/store-prices/:id
/**
 * @openapi
 * /api/v1/store-prices/{id}:
 *  delete:
 *      summary: Delete new store price
 *      tags: [Store Prices]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *                type: number
 *            required: true
 *            description: The store price id
 *      responses:
 *          201:
 *              description: Store price delete
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: success message response
 *          400:
 *              description: Delete failed
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: failed message response
 */
StorePriceRouter.delete("/:id", StorePriceController.removeStorePrice);
