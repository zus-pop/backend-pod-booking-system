import { Router } from "express";
import StorePriceController from "../../controllers/StorePriceController.ts";

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
 *                                  type_id:
 *                                      type: integer
 *                                      description: pod type id map to the time frame
 *                                      example: 3
 *                                  days_of_week:
 *                                      type: integer
 *                                      description: the num of days that the time frame is applied for describe in 7 bits
 *                                      example: 127
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
StorePriceRouter.get("/", StorePriceController.findAllStorePrice);

// GET: api/v1/store-prices/:type_id
/**
 * @openapi
 * /api/v1/store-prices/{type_id}:
 *  get:
 *      summary: Get list of Store Prices
 *      tags: [Store Prices]
 *      parameters:
 *         - in: path
 *           name: type_id
 *           schema:
 *             type: number
 *           required: true
 *           description: the pod type id
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
 *                                  type_id:
 *                                      type: integer
 *                                      description: pod type id map to the time frame
 *                                      example: 3
 *                                  days_of_week:
 *                                      type: integer
 *                                      description: the num of days that the time frame is applied for describe in 7 bits
 *                                      example: 127
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
StorePriceRouter.get(
    "/:type_id",
    StorePriceController.findAllStorePriceByPodType
);
