import { Router } from "express";
import UtilityController from "../../controllers/UtilityController.ts";

export const UtilityRouter = Router();

// GET: api/v1/utilities
/**
 * @openapi
 * tags:
 *   name: Utilities
 *   description: The Utilities managing API
 * /api/v1/utilities:
 *   get:
 *     summary: Get list of Utilities
 *     tags: [Utilities]
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   utility_id:
 *                     type: integer
 *                     description: ID of the utility
 *                     example: 1
 *                   utility_name:
 *                     type: string
 *                     description: Name of the utility
 *                     example: Utility A
 *                   utility_description:
 *                     type: string
 *                     description: Description of the utility
 *                     example: This is a description of Utility A
 *       404:
 *         description: No utilities found
 */
UtilityRouter.get("/", UtilityController.findAll);

// GET: api/v1/utilities/:id
/**
 * @openapi
 * /api/v1/utilities/{id}:
 *   get:
 *     summary: Get a single utility by its ID
 *     tags: [Utilities]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The utility ID
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 utility_id:
 *                   type: integer
 *                   description: ID of the utility
 *                   example: 1
 *                 utility_name:
 *                   type: string
 *                   description: Name of the utility
 *                   example: Utility A
 *                 utility_description:
 *                   type: string
 *                   description: Description of the utility
 *                   example: This is a description of Utility A
 *       404:
 *         description: Utility not found
 */
UtilityRouter.get("/:id", UtilityController.findById);

//POST: api/v1/utilities
/**
 * @openapi
 * /api/v1/utilities:
 *   post:
 *     summary: Create a new utility
 *     tags: [Utilities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               utility_name:
 *                 type: string
 *               utility_description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 utility_id:
 *                   type: integer
 *                   description: ID of the utility
 *                   example: 1
 *                 utility_name:
 *                   type: string
 *                   description: Name of the utility
 *                   example: Utility A
 *                 utility_description:
 *                   type: string
 *                   description: Description of the utility
 *                   example: This is a description of Utility A
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
UtilityRouter.post("/", UtilityController.createNewUtility);

/**
 * @openapi
 * /api/v1/utilities/{id}:
 *   put:
 *     summary: Update an existing utility by its ID
 *     tags: [Utilities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the utility to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               utility_name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 utility_id:
 *                   type: integer
 *                   description: ID of the utility
 *                   example: 1
 *                 utility_name:
 *                   type: string
 *                   description: Name of the utility
 *                   example: Utility A
 *                 utility_description:
 *                   type: string
 *                   description: Description of the utility
 *                   example: Updated description of Utility A
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Utility not found
 */
UtilityRouter.put("/:id", UtilityController.updateUtility);
