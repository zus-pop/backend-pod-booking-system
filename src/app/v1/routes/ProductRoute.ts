import { Router } from "express";
import ProductController from "../../controllers/ProductController.ts";

export const ProductRouter = Router();

// GET: api/v1/products
/**
 * @openapi
 * tags:
 *   name: Products
 *   description: The Products managing API
 * /api/v1/products:
 *   get:
 *     summary: Get lists of Products
 *     tags: [Products]
 *     parameters:
 *      - in: query
 *        name: name
 *        schema:
 *          type: string
 *        description: The name of the Product
 *      - in: query
 *        name: category_id
 *        schema:
 *          type: number
 *        description: The id of the Product category
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
 *                      product_id:
 *                          type: integer
 *                          description: id of product
 *                          example: 1
 *                      product_name:
 *                          type: string
 *                          description: name of product
 *                          example: Product A
 *                      category_id:
 *                          type: integer
 *                          description: id of category
 *                          example: 2
 *                      price:
 *                          type: number
 *                          description: price of product
 *                          example: 100.00
 *       404:
 *         description: No products found
 */
ProductRouter.get("/", ProductController.find);

//GET: api/v1/products/{id}
/**
 * @openapi
 * /api/v1/products/{id}:
 *  get:
 *      summary: Get a Product by ID
 *      tags: [Products]
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          description: The ID of the product
 *          schema:
 *            type: integer
 *            minimum: 1
 *            example: 1
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: integer
 *                                  description: ID of the product
 *                                  example: 1
 *                              name:
 *                                  type: string
 *                                  description: Name of the product
 *                                  example: "Product A"
 *                              price:
 *                                  type: number
 *                                  description: Price of the product
 *                                  example: 100.50
 *          404:
 *              description: Product not found
 *          500:
 *              description: Internal server error
 */
ProductRouter.get("/:id", ProductController.findById);
//POST: api/v1/products
/**
 * @openapi
 * /api/v1/products:
 *  post:
 *      summary: Create a new Product
 *      tags: [Products]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              description: Name of the product
 *                              example: "Product A"
 *                          price:
 *                              type: number
 *                              description: Price of the product
 *                              example: 100.50
 *      responses:
 *          201:
 *              description: Product created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: integer
 *                                  description: ID of the new product
 *                                  example: 1
 *                              name:
 *                                  type: string
 *                                  description: Name of the product
 *                                  example: "Product A"
 *                              price:
 *                                  type: number
 *                                  description: Price of the product
 *                                  example: 100.50
 */
ProductRouter.post("/", ProductController.createNewProduct);
//PUT: api/v1/products/{id}
/**
 * @openapi
 * /api/v1/products/{id}:
 *  put:
 *      summary: Update a Product by ID
 *      tags: [Products]
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          description: The ID of the product
 *          schema:
 *            type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              description: Name of the product
 *                              example: "Updated Product A"
 *                          price:
 *                              type: number
 *                              description: Price of the product
 *                              example: 120.00
 *      responses:
 *          200:
 *              description: Product updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: integer
 *                                  description: ID of the updated product
 *                                  example: 1
 *                              name:
 *                                  type: string
 *                                  description: Name of the product
 *                                  example: "Updated Product A"
 *                              price:
 *                                  type: number
 *                                  description: Price of the product
 *                                  example: 120.00
 *          404:
 *              description: Product not found
 */
ProductRouter.put("/:id", ProductController.updateProduct);
