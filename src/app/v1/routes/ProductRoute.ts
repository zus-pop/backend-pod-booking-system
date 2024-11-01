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
 *        name: store_id
 *        schema:
 *          type: number
 *        description: The id of the Product's store
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
 *                          image:
 *                              type: string
 *                              description: image of product
 *                              example: https://googleapis/...
 *                          description:
 *                              type: string
 *                              description: description of product
 *                              example: delicous food
 *                          category_id:
 *                              type: integer
 *                              description: id of category
 *                              example: 2
 *                          price:
 *                              type: number
 *                              description: price of product
 *                              example: 100.00
 *                          store_id:
 *                              type: number
 *                              description: id of store
 *                              example: 100.00
 *                          stock:
 *                              type: integer
 *                              description: stock of product
 *                              example: 120
 *       404:
 *         description: No products found
 */
ProductRouter.get("/", ProductController.find);

// GET: api/v1/products/total-revenue
/**
 * @openapi
 * /api/v1/products/total-revenue-each-product:
 *   get:
 *     summary: Get total revenue for each product
 *     tags: [Products]
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
 *                   product_id:
 *                     type: integer
 *                     description: The ID of the product
 *                     example: 1
 *                   product_name:
 *                     type: string
 *                     description: The name of the product
 *                     example: "Product A"
 *                   product_revenue:
 *                     type: number
 *                     format: float
 *                     description: The total revenue of the product
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
ProductRouter.get(
  "/total-revenue-each-product",
  ProductController.getTotalRevenueByProduct
);

// GET: api/v1/products/daily-revenue
/**
 * @openapi
 * /api/v1/products/daily-revenue:
 *   get:
 *     summary: Get daily revenue for each product
 *     tags: [Products]
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
 *                   product_id:
 *                     type: integer
 *                     description: The ID of the product
 *                     example: 1
 *                   product_name:
 *                     type: string
 *                     description: The name of the product
 *                     example: "Product A"
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: The date of the revenue
 *                     example: "2023-10-01"
 *                   daily_revenue:
 *                     type: number
 *                     format: float
 *                     description: The daily revenue of the product
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
ProductRouter.get("/daily-revenue", ProductController.getDailyRevenueByProduct);

// GET: api/v1/products/monthly-revenue
/**
 * @openapi
 * /api/v1/products/monthly-revenue:
 *   get:
 *     summary: Get monthly revenue for products
 *     tags: [Products]
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
 *                     description: The monthly revenue of the product
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
ProductRouter.get(
  "/monthly-revenue",
  ProductController.getMonthlyRevenueByProduct
);

// GET: api/v1/products/daily-total-revenue
/**
 * @openapi
 * /api/v1/products/daily-total-revenue:
 *   get:
 *     summary: Get daily total revenue for all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Successfully retrieved daily total revenue
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
 *                     description: The daily total revenue of all products
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
ProductRouter.get(
  "/daily-total-revenue",
  ProductController.getDailyTotalRevenue
);

// GET: api/v1/products/total-revenue
/**
 * @openapi
 * /api/v1/products/total-revenue:
 *   get:
 *     summary: Get total revenue for all products saled
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Successfully retrieved total revenue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalAllProductSaled:
 *                   type: number
 *                   format: float
 *                   description: The total revenue of all products
 *                   example: 100000.0
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
ProductRouter.get("/total-revenue", ProductController.getTotalProductRevenue);

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
 *                              product_id:
 *                                  type: integer
 *                                  description: id of product
 *                                  example: 1
 *                              product_name:
 *                                  type: string
 *                                  description: name of product
 *                                  example: Product A
 *                              image:
 *                                  type: string
 *                                  description: image of product
 *                                  example: https://googleapis/...
 *                              description:
 *                                  type: string
 *                                  description: description of product
 *                                  example: delicous food
 *                              category:
 *                                  type: object
 *                                  properties:
 *                                    category_id:
 *                                        type: integer
 *                                        description: id of category
 *                                        example: 2
 *                                    category_name:
 *                                        type: string
 *                                        description: name of category
 *                                        example: Food
 *                              price:
 *                                  type: number
 *                                  description: price of product
 *                                  example: 100.00
 *                              store:
 *                                  type: object
 *                                  properties:
 *                                    store_id:
 *                                        type: integer
 *                                        description: id of store
 *                                        example: 100.00
 *                                    store_name:
 *                                        type: string
 *                                        description: name of store
 *                                        example: PhucLong
 *                                    address:
 *                                        type: string
 *                                        description: address of store
 *                                        example: Binh Tan
 *                                    hotline:
 *                                        type: string
 *                                        description: hotline of store
 *                                        example: 0123654789
 *                                    image:
 *                                        type: string
 *                                        description: image of store
 *                                        example: https://googleapis/...
 *                              stock:
 *                                  type: integer
 *                                  description: stock of product
 *                                  example: 120
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
