import { Router } from "express";
import ProductController from "../../controllers/ProductController.ts";
import { upload } from "../../utils/google-cloud-storage.ts";

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
 *        name: product_name
 *        schema:
 *          type: string
 *        description: The name of the Product
 *      - in: query
 *        name: category_id
 *        schema:
 *          type: number
 *        description: The id of the Product category
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *        description: The size for each page of the Product list
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *        description: The current page of the Product list
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                products:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          product_id:
 *                              type: integer
 *                              description: id of product
 *                              example: 1
 *                          product_name:
 *                              type: string
 *                              description: name of product
 *                              example: Product A
 *                          category_id:
 *                              type: integer
 *                              description: id of category
 *                              example: 2
 *                          price:
 *                              type: number
 *                              description: price of product
 *                              example: 100.00
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

// POST: api/v1/products
/**
 * @openapi
 * /api/v1/products:
 *     post:
 *       summary: Create a new Product
 *       tags: [Products]
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 product_name:
 *                   type: string
 *                   description: name of product
 *                 description:
 *                   type: string
 *                   description: description of product
 *                 image:
 *                   type: string
 *                   format: binary
 *                   description: image of product
 *                 category_id:
 *                   type: integer
 *                   description: id category of product
 *                 price:
 *                   type: number
 *                   description: price of product
 *                 store_id:
 *                   type: integer
 *                   description: id store's product
 *                 stock:
 *                   type: integer
 *                   description: stock of product
 *       responses:
 *         201:
 *           description: Product created successfully
 *         400:
 *           description: Failed to create new Product
 */
ProductRouter.post(
  "/",
  upload.single("image"),
  ProductController.createNewProduct
);

// PUT: api/v1/products/{id}
/**
 * @openapi
 * /api/v1/products/{id}:
 *  put:
 *      summary: Update a product by ID
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
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 product_name:
 *                   type: string
 *                   description: name of product
 *                 description:
 *                   type: string
 *                   description: description of product
 *                 image:
 *                   type: string
 *                   format: binary
 *                   description: image of product
 *                 category_id:
 *                   type: integer
 *                   description: id category of product
 *                 store_id:
 *                   type: integer
 *                   description: id store's product
 *                 price:
 *                   type: number
 *                   description: price of the product
 *                 stock:
 *                   type: number
 *                   description: stock of the product
 *      responses:
 *          200:
 *              description: Product updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              product_id:
 *                                  type: integer
 *                                  description: ID of the updated product
 *                                  example: 1
 *                              product_name:
 *                                  type: string
 *                                  description: Name of the product
 *                                  example: "Updated Product A"
 *          404:
 *              description: Product not found
 */
ProductRouter.put(
  "/:id",
  upload.single("image"),
  ProductController.updateProduct
);

// DELETE: api/v1/products/{id}
/**
 * @openapi
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete a Product by its id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found or deletion failed
 */
ProductRouter.delete("/:id", ProductController.deleteProduct);
