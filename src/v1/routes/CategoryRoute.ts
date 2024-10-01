import { Router } from "express";
import CategoryController from "../../controllers/CategoryController.ts";

export const CategoryRouter = Router();

// GET: api/v1/categories
/**
 * @openapi
 * tags:
 *   name: Categories
 *   description: The Categories managing API
 * /api/v1/categories:
 *   get:
 *     summary: Get lists of Categories
 *     tags: [Categories]
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
 *                      category_id:
 *                          type: integer
 *                          description: id of category
 *                          example: 1
 *                      category_name:
 *                          type: string
 *                          description: name of category
 *                          example: "Electronics"
 *                      description:
 *                          type: string
 *                          description: description of category
 *                          example: "Devices and gadgets"
 *       404:
 *         description: No Categories found
 */
CategoryRouter.get("/", CategoryController.findAll);

// GET: api/v1/categories/:id
/**
 * @openapi
 * /api/v1/categories/{id}:
 *     get:
 *      summary: Get a single category by its id
 *      tags: [Categories]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            required: true
 *            description: The Category id
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              category_id:
 *                                  type: integer
 *                                  description: id of category
 *                                  example: 1
 *                              category_name:
 *                                  type: string
 *                                  description: name of category
 *                                  example: "Electronics"
 *                              description:
 *                                  type: string
 *                                  description: description of category
 *                                  example: "Devices and gadgets"
 *          404:
 *              description: No Category found
 */
CategoryRouter.get("/:id", CategoryController.findById);

// POST: api/v1/categories
/**
 * @openapi
 * /api/v1/categories:
 *   post:
 *     summary: Create a new Category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_name:
 *                 type: string
 *                 description: Name of the category
 *                 example: "Electronics"
 *               description:
 *                 type: string
 *                 description: Description of the category
 *                 example: "Devices and gadgets"
 *     responses:
 *       201:
 *         description: Category created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category_id:
 *                   type: integer
 *                   description: ID of the newly created category
 *                   example: 1
 *                 category_name:
 *                   type: string
 *                   description: Name of the category
 *                   example: "Electronics"
 *                 description:
 *                   type: string
 *                   description: Description of the category
 *                   example: "Devices and gadgets"
 */
CategoryRouter.post("/", CategoryController.createNewCategory);

// PUT: api/v1/categories/:id
/**
 * @openapi
 * /api/v1/categories/{id}:
 *   put:
 *     summary: Update a Category by its id
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the category
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_name:
 *                 type: string
 *                 description: Updated name of the category
 *                 example: "Home Appliances"
 *               description:
 *                 type: string
 *                 description: Updated description of the category
 *                 example: "Household items and appliances"
 *     responses:
 *       200:
 *         description: Category updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category_id:
 *                   type: integer
 *                   description: ID of the updated category
 *                   example: 1
 *                 category_name:
 *                   type: string
 *                   description: Updated name of the category
 *                   example: "Home Appliances"
 *                 description:
 *                   type: string
 *                   description: Updated description of the category
 *                   example: "Household items and appliances"
 *       404:
 *         description: No Category found
 */
CategoryRouter.put("/:id", CategoryController.updateCategory);
