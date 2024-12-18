import { Router } from "express";
import UserController from "../../controllers/UserController.ts";
import { authenticateToken } from "../../middlewares/authenticateToken.ts";
import BookingController from "../../controllers/BookingController.ts";
import NotificationController from "../../controllers/NotificationController.ts";

export const UserRouter = Router();

// POST: api/v1/auth/login
/**
 * @openapi
 * tags:
 *  name: Users
 *  description: The users managing API
 * /api/v1/auth/login:
 *  post:
 *      summary: Login
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              format: email
 *                              description: email of user
 *                              example: jane@gmail.com
 *                          password:
 *                              type: string
 *                              format: password
 *                              description: password of user
 *                              example: jane123
 *      responses:
 *          200:
 *              description: Login successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              token:
 *                                  type: string
 *                                  description: Json Web Token response
 *                                  example: eyJhbGciOiJIUzI1NiIsInR5c.iOiJIUzI1NiIsInR5c.iJIUzI1NiIsIn
 *                              message:
 *                                  type: string
 *                                  description: response message
 *                                  example: Login successfully!
 *          404:
 *              description: User not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: User not found!
 *          403:
 *              description: Invalid Password
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Password is not correct!
 */
UserRouter.post("/login", UserController.login);

// POST: api/v1/auth/register
/**
 * @openapi
 * /api/v1/auth/register:
 *  post:
 *      summary: Register
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          user_name:
 *                              type: string
 *                              description: name of user
 *                              example: Marry Jane
 *                          email:
 *                              type: string
 *                              format: email
 *                              description: email of user
 *                              example: jane@gmail.com
 *                          password:
 *                              type: string
 *                              format: password
 *                              description: password of user
 *                              example: jane123
 *                          phone_number:
 *                              type: string
 *                              description: phone number of user
 *                              example: 0123456789
 *      responses:
 *          201:
 *              description: Register successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: response message
 *                                  example: Created user successfully!
 *          400:
 *              description: User existed
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Email already exists!
 *          500:
 *              description: Internal Server Error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Failed to create user!
 *
 */
UserRouter.post("/register", UserController.register);

// GET: api/v1/auth/users
/**
 * @openapi
 * /api/v1/auth/users:
 *  get:
 *      summary: Get list of Users
 *      tags: [Users]
 *      parameters:
 *        - in: query
 *          name: search
 *          schema:
 *              type: string
 *          description: The username/email of user
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *          description: The size for each page of the User's booking list
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *          description: The current page of the User's booking list
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              users:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          user_id:
 *                                              type: integer
 *                                              description: id of user
 *                                              example: 1
 *                                          phone_number:
 *                                              type: string
 *                                              description: phone number of user
 *                                              example: 1
 *                                          email:
 *                                              type: string
 *                                              format: email
 *                                              example: jane@gmail.com
 *                                          user_name:
 *                                              type: string
 *                                              description: name of user
 *                                              example: marry jane
 *                                          role:
 *                                              type: object
 *                                              properties:
 *                                                  role_id:
 *                                                      type: integer
 *                                                      description: id of role
 *                                                      example: 2
 *                                                  role_name:
 *                                                      type: string
 *                                                      description: name of role
 *                                                      example: Customer
 *                              total:
 *                                  type: integer
 *                                  description: total number of rows from the query result
 *                                  example: 8
 *          404:
 *              description: No users found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: No users found
 */
UserRouter.get("/users", UserController.find);

// GET: api/v1/auth/profile
/**
 * @openapi
 * /api/v1/auth/profile:
 *  get:
 *      summary: Get user datas from token
 *      security:
 *          - Authorization: []
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              user_id:
 *                                  type: integer
 *                                  description: id of user
 *                                  example: 1
 *                              phone_number:
 *                                  type: string
 *                                  description: phone number of user
 *                                  example: 1
 *                              email:
 *                                  type: string
 *                                  format: email
 *                                  example: jane@gmail.com
 *                              user_name:
 *                                  type: string
 *                                  description: name of user
 *                                  example: marry jane
 *                              role:
 *                                  type: object
 *                                  properties:
 *                                      role_id:
 *                                          type: integer
 *                                          description: id of role
 *                                          example: 2
 *                                      role_name:
 *                                          type: string
 *                                          description: name of role
 *                                          example: Customer
 *          401:
 *              description: Unauthorized
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message response
 *                                  example: Access denied. No token provided.
 *          403:
 *              description: Forbidden
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  description: error name
 *                              message:
 *                                  type: string
 *                                  description: message response
 */
UserRouter.get("/profile", authenticateToken, UserController.getUser);

// GET: api/v1/auth/bookings
/**
 * @openapi
 * /api/v1/auth/bookings:
 *  get:
 *      summary: Get bookings from user_id in token
 *      security:
 *          - Authorization: []
 *      tags: [Users]
 *      parameters:
 *          - in: query
 *            name: booking_status
 *            schema:
 *              type: string
 *              enum: [Pending, Confirmed, Canceled, Complete, Ongoing]
 *            description: Status of the booking
 *          - in: query
 *            name: booking_date
 *            schema:
 *              type: string
 *              format: date
 *            description: Date of the booking
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 *            description: The size for each page of the User's booking list
 *          - in: query
 *            name: page
 *            schema:
 *              type: integer
 *            description: The current page of the User's booking list
 *      responses:
 *        200:
 *          description: Success.
 *          content:
 *            application/json:
 *              schema:
 *               type: object
 *               properties:
 *                  bookings:
 *                      type: array
 *                      items:
 *                          type: object
 *                          properties:
 *                              booking_id:
 *                                  type: integer
 *                                  description: id of booking
 *                                  example: 1
 *                              user:
 *                                  type: object
 *                                  properties:
 *                                      user_id:
 *                                          type: integer
 *                                          description: id of user
 *                                          example: 2
 *                                      user_name:
 *                                          type: string
 *                                          description: name of user
 *                                          example: popcorn-americano
 *                                      email:
 *                                          type: string
 *                                          format: email
 *                                          description: email of user
 *                                          example: americano@gmail.com
 *                              rating:
 *                                  type: integer
 *                                  format: double
 *                                  description: rating of booking
 *                                  example: 5.0
 *                              comment:
 *                                  type: string
 *                                  description: feedback of booking
 *                                  example: đỉnh nóc, kịch trần, bay phấp phới
 *                              booking_date:
 *                                  type: string
 *                                  format: date-time
 *                                  description: date-time of booking
 *                                  example: 2024-05-28T12:30:08Z
 *                              booking_status:
 *                                  type: string
 *                                  description: status of booking
 *                                  enum: [Pending, Confirmed, Canceled, Completed, Ongoing]
 *                                  example: Pending
 *                  total:
 *                      type: integer
 *                      description: total number of rows from the query result
 *                      example: 8
 *          404:
 *              description: Booking found
 *          401:
 *              description: Unauthorized
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message response
 *                                  example: Access denied. No token provided.
 *          403:
 *              description: Forbidden
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  description: error name
 *                              message:
 *                                  type: string
 *                                  description: message response
 *
 */
UserRouter.get("/bookings", authenticateToken, BookingController.findByUserId);

// GET: api/v1/auth/notifications
/**
 * @openapi
 * /api/v1/auth/notifications:
 *  get:
 *      summary: Get notifications from user_id in token
 *      security:
 *          - Authorization: []
 *      tags: [Users]
 *      parameters:
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 *            description: The size for each page of the User's booking list
 *          - in: query
 *            name: page
 *            schema:
 *              type: integer
 *            description: The current page of the User's booking list
 *      responses:
 *        200:
 *          description: Success.
 *          content:
 *            application/json:
 *              schema:
 *               type: object
 *               properties:
 *                  notifications:
 *                      type: array
 *                      items:
 *                          type: object
 *                          properties:
 *                              notification_id:
 *                                  type: integer
 *                                  description: id of notification
 *                                  example: 1
 *                              user_id:
 *                                  type: integer
 *                                  description: id of user
 *                                  example: 2
 *                              message:
 *                                  type: string
 *                                  description: content of notification
 *                                  example: Your booking is confirmed!
 *                              comment:
 *                                  type: string
 *                                  description: feedback of booking
 *                                  example: đỉnh nóc, kịch trần, bay phấp phới
 *                              is_read:
 *                                  type: boolean
 *                                  description: status of notification
 *                                  example: false
 *                              created_at:
 *                                  type: string
 *                                  format: date-time
 *                                  description: created time of notification
 *                                  example: 2024-10-20T12:38:08Z
 *                  total:
 *                      type: integer
 *                      description: total number of rows from the query result
 *                      example: 8
 *          404:
 *              description: Notifications not found
 *          401:
 *              description: Unauthorized
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message response
 *                                  example: Access denied. No token provided.
 *          403:
 *              description: Forbidden
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  description: error name
 *                              message:
 *                                  type: string
 *                                  description: message response
 *
 */
UserRouter.get(
    "/notifications",
    authenticateToken,
    NotificationController.findByUserId
);

// PUT: api/v1/auth/notifications/:id/read
/**
 * @openapi
 * /api/v1/auth/notifications/{id}/read:
 *  put:
 *      summary: Mark the notification as read
 *      security:
 *          - Authorization: []
 *      tags: [Users]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            description: The id of notification
 *      responses:
 *          201:
 *              description: Success.
 *              content:
 *              application/json:
 *                  schema:
 *                  type: object
 *                  properties:
 *                      message:
 *                          type: string
 *                          description: success message response
 *          404:
 *              description: Notifications not found
 *          401:
 *              description: Unauthorized
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message response
 *                                  example: Access denied. No token provided.
 *          403:
 *              description: Forbidden
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  description: error name
 *                              message:
 *                                  type: string
 *                                  description: message response
 *
 */
UserRouter.put(
    "/notifications/:id/read",
    authenticateToken,
    NotificationController.markAsRead
);

// PUT: api/v1/auth/users/:id
/**
 * @openapi
 * /api/v1/auth/users/{id}:
 *  put:
 *      summary: Update
 *      security:
 *          - Authorization: []
 *      tags: [Users]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: number
 *            required: true
 *            description: The User id
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          user_name:
 *                              type: string
 *                              description: name of user
 *                              example: Marry Jane
 *                          phone_number:
 *                              type: string
 *                              description: phone number of user
 *                              example: 0123456789
 *                          role_id:
 *                              type: integer
 *                              description: role id of user
 *                              example: 3
 *      responses:
 *          201:
 *              description: Update successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: response message
 *                                  example: Update user successfully!
 *          400:
 *              description: Update failed
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *          401:
 *              description: Unauthorized
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: message response
 *                                  example: Access denied. No token provided.
 *          403:
 *              description: Forbidden
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  description: error name
 *                              message:
 *                                  type: string
 *                                  description: message response
 */
UserRouter.put("/users/:id", authenticateToken, UserController.update);

// POST: api/v1/auth/forgot-password
// POST: api/v1/auth/reset-password
