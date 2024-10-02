import { Router } from "express";
import RoleController from "../../controllers/RoleController.ts";

export const RoleRouter = Router();

// GET: api/v1/roles
/**
 * @openapi
 * tags:
 *  name: Roles
 *  description: The Roles managing API
 * /api/v1/roles:
 *   get:
 *      summary: Get list of roles
 *      tags: [Roles]
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
 *                                  role_id:
 *                                      type: integer
 *                                      description: id of role
 *                                      example: 1
 *                                  role_name:
 *                                      type: string
 *                                      description: name of role
 *                                      example: Admin
 *          404:
 *              description: no roles found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: messeage response
 *                                  example: No roles found
*/
RoleRouter.get("/", RoleController.findAll);

// GET: api/v1/roles/:id
/**
 * @openapi
 * /api/v1/roles/{id}:
 *     get:
 *      summary: Get a single role by its id
 *      tags: [Roles]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: number
 *            required: true
 *            description: The Role id
 *      responses:
 *          200:
 *              description: Get Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              role_id:
 *                                  type: integer
 *                                  description: id of role
 *                                  example: 3
 *                              role_name:
 *                                  type: string
 *                                  description: name of role
 *                                  example: Staff
 *          404:
 *              description: no roles found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: messeage response
 *                                  example: No roles found
 */
RoleRouter.get("/:id", RoleController.findById);
