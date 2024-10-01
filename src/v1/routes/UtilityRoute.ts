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
