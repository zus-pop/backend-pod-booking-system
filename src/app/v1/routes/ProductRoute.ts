import { Router } from "express";
import ProductController from "../../controllers/ProductController.ts";

export const ProductRouter = Router();

// GET: api/v1/products
/**
 * @openapi
 * tags:
 *  name: Products
 *  description: The Products managing API
 * /api/v1/products:
 *  get:
 *      summary: Get list of Products
 *      tags: [Products]
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
 *                                      description: ID of the product
 *                                      example: 1
 *                                  name:
 *                                      type: string
 *                                      description: Name of the product
 *                                      example: "Product A"
 *                                  price:
 *                                      type: number
 *                                      description: Price of the product
 *                                      example: 100.50
 *          404:
 *              description: No products found
 */
ProductRouter.get("/", ProductController.findAll);
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
