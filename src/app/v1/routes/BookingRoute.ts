import BookingController from "../../controllers/BookingController.ts";
import { Router } from "express";
import { validateEmptyObject } from "../../middlewares/emptyObject.ts";
import { authenticateToken } from "../../middlewares/authenticateToken.ts";
import { checkAllAvailableSlot } from "../../middlewares/checkAllAvailableSlot.ts";
import BookingProductController from "../../controllers/BookingProductController.ts";
import BookingSlotController from "../../controllers/BookingSlotController.ts";

export const BookingRouter = Router();

//GET: api/v1/bookings/count-by-pod-type
/**
 * @openapi
 * /api/v1/bookings/count-by-pod-type:
 *   get:
 *     summary: Get the count of bookings for each POD type
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: Successfully retrieved the count of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type_name:
 *                     type: string
 *                     description: The name of the POD type
 *                   booking_count:
 *                     type: number
 *                     description: The count of bookings for the POD type
 *       404:
 *         description: No bookings found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No bookings found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
BookingRouter.get(
    "/count-by-pod-type",
    BookingController.getBookingsCountByPODType
);

//GET: api/v1/bookings-count-by-pod
/**
 * @openapi
 * /api/v1/bookings/bookings-count-by-pod:
 *   get:
 *     summary: Get the count of bookings for each pod
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: Successfully retrieved the count of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pod_id:
 *                     type: number
 *                     description: The ID of the pod
 *                   pod_name:
 *                     type: string
 *                     description: The name of the pod
 *                   type_id:
 *                     type: integer
 *                     description: The id of the pod type
 *                   description:
 *                     type: string
 *                     description: The description of the pod
 *                   image:
 *                     type: string
 *                     description: The image url of the pod
 *                   is_available:
 *                     type: boolean
 *                     description: The available status of the pod
 *                   store_id:
 *                     type: integer
 *                     description: The id of the store of the pod
 *                   booking_count:
 *                     type: number
 *                     description: The count of completed bookings for the pod
 *       404:
 *         description: No bookings found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No bookings found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
BookingRouter.get(
    "/bookings-count-by-pod",
    BookingController.getBookingsCountByPod
);

// GET: api/v1/bookings
/**
 * @openapi
 * tags:
 *   name: Bookings
 *   description: The Payments managing API
 * /api/v1/bookings:
 *   get:
 *     summary: Get list of Bookings
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: booking_status
 *         schema:
 *           type: string
 *           enum: [Pending, Confirmed, Canceled, Complete, Ongoing]
 *         description: Status of the booking
 *       - in: query
 *         name: booking_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date of the booking
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The size for each page of the Booking list
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The current page of the Booking list
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                  bookings:
 *                      type: array
 *                      items:
 *                          type: object
 *                          properties:
 *                              booking_id:
 *                                  type: integer
 *                                  description: id of booking
 *                                  example: 1
 *                              pod_id:
 *                                  type: integer
 *                                  description: id of pod
 *                                  example: 3
 *                              user:
 *                                  type: object
 *                                  properties:
 *                                      user_id:
 *                                          type: integer
 *                                          description: id of user
 *                                          example: 4
 *                                      user_name:
 *                                          type: string
 *                                          description: name of user
 *                                          example: haha
 *                                      email:
 *                                          type: string
 *                                          format: email
 *                                          description: email of user
 *                                          example: foo@gmail.com
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
 *                      description: total row of the booking list
 *                      example: 8
 *       404:
 *         description: No bookings found
 *
 */
BookingRouter.get("/", BookingController.find);

// GET: api/v1/bookings/:id
/**
 * @openapi
 * /api/v1/bookings/{id}:
 *     get:
 *      summary: Get a single booking by its id
 *      tags: [Bookings]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: number
 *            required: true
 *            description: The Booking id
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              booking_id:
 *                                  type: integer
 *                                  description: id of booking
 *                                  example: 1
 *                              booking_date:
 *                                  type: string
 *                                  format: date-time
 *                                  description: date-time of booking
 *                                  example: 2024-05-28T12:30:08Z
 *                              booking_status:
 *                                  type: string
 *                                  description: status of booking
 *                                  enum: [Pending, Confirmed, Canceled, Complete, Ongoing]
 *                                  example: Pending
 *                              user:
 *                                  type: object
 *                                  properties:
 *                                      user_id:
 *                                          type: integer
 *                                          description: id of customer
 *                                          example: 1
 *                                      user_name:
 *                                          type: string
 *                                          description: name of customer
 *                                          example: gordon ramsay
 *                                      email:
 *                                          type: string
 *                                          format: email
 *                                          description: email of customer
 *                                          example: holy@gmail.com
 *                              rating:
 *                                  type: integer
 *                                  format: double
 *                                  description: rating of booking
 *                                  example: 5.0
 *                              comment:
 *                                  type: string
 *                                  description: feedback of booking
 *                                  example: đỉnh nóc, kịch trần, bay phấp phới
 *                              pod:
 *                                  type: object
 *                                  properties:
 *                                      pod_id:
 *                                          type: integer
 *                                          description: id of POD
 *                                          example: 1
 *                                      pod_name:
 *                                          type: string
 *                                          description: name of POD
 *                                          example: Meeting A
 *                                      type_id:
 *                                          type: integer
 *                                          description: id of pod type
 *                                          example: 2
 *                                      description:
 *                                          type: string
 *                                          description: description of POD
 *                                          example: heheehhe
 *                                      image:
 *                                          type: string
 *                                          description: image URL of POD
 *                                          example: https://googleapis/...
 *                                      is_available:
 *                                          type: boolean
 *                                          description: available status of POD
 *                                          example: true
 *                              slots:
 *                                  type: arrays
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          slot_id:
 *                                              type: integer
 *                                              description: id of POD
 *                                              example: 1
 *                                          pod_id:
 *                                              type: integer
 *                                              description: id of POD
 *                                              example: 1
 *                                          start_time:
 *                                              type: string
 *                                              format: date-time
 *                                              description: start time of slot
 *                                              example: 2024-10-01T08:00:00.000Z
 *                                          end_time:
 *                                              type: string
 *                                              format: date-time
 *                                              description: end time of slot
 *                                              example: 22024-10-01T12:00:00.000Z
 *                                          description:
 *                                              type: string
 *                                              description: description of POD
 *                                              example: heheehhe
 *                                          unit_price:
 *                                              type: integer
 *                                              double: double
 *                                              description: price of slot
 *                                              example: 80000
 *                                          is_available:
 *                                              type: boolean
 *                                              description: available status of slot
 *                                              example: false
 *                              products:
 *                                  type: arrays
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          product_id:
 *                                              type: integer
 *                                              description: id of Product
 *                                              example: 1
 *                                          product_name:
 *                                              type: string
 *                                              description: name of Product
 *                                              example: Expresso
 *                                          price:
 *                                              type: integer
 *                                              format: double
 *                                              description: price of Product
 *                                              example: 30000
 *                                          stock:
 *                                              type: integer
 *                                              description: remaining amount of slot
 *                                              example: 100
 *          404:
 *              description: Booking found
 *
 */
BookingRouter.get("/:id", BookingController.findById);

// GET: api/v1/bookings/:id/products
/**
 * @openapi
 * /api/v1/bookings/{id}/products:
 *  get:
 *    summary: Get list of booking products by booking id
 *    tags: [Bookings]
 *    parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: number
 *            required: true
 *            description: The Booking id
 *    responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: arrays
 *                          items:
 *                              type: object
 *                              properties:
 *                                  product_id:
 *                                      type: integer
 *                                      description: id of product
 *                                      example: 3
 *                                  product_name:
 *                                      type: string
 *                                      description: name of product
 *                                      example: Expresso
 *                                  price:
 *                                      type: integer
 *                                      format: double
 *                                      description: price price of product
 *                                      example: 30000
 *                                  unit_price:
 *                                      type: integer
 *                                      format: double
 *                                      description: unit price of product
 *                                      example: 30000
 *                                  quantity:
 *                                      type: integer
 *                                      description: quantity of product
 *                                      example: 2
 *                                  stock:
 *                                      type: integer
 *                                      description: remaining amount of product
 *                                      example: 100
 *          404:
 *              description: No booking products found
 */
BookingRouter.get("/:id/products", BookingProductController.findByBookingId);

/**
 * @openapi
 * /api/v1/bookings/{id}/products:
 *  post:
 *      summary: Add product for booking
 *      tags: [Bookings]
 *      security:
 *          - Authorization: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          type: object
 *                          properties:
 *                              booking_id:
 *                                  type: integer
 *                                  description: id of selected booking
 *                                  example: 1
 *                              product_id:
 *                                  type: integer
 *                                  description: id of selected product
 *                                  example: 1
 *                              slot_id:
 *                                  type: integer
 *                                  description: id of selected slot
 *                                  example: 1
 *                              unit_price:
 *                                  type: integer
 *                                  format: double
 *                                  description: unit price of selected product
 *                                  example: 50000
 *                              quantity:
 *                                  type: integer
 *                                  description: quanity of selected product
 *                                  example: 2
 *      responses:
 *           200:
 *              description: Added products
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              payment_url:
 *                                  type: string
 *                                  description: payment link for from online payment API
 *                                  example: https://example.com/pay
 *                              message:
 *                                  type: string
 *                                  description: message about the response status
 *                                  example: Booking created successfully
 *           400:
 *               description: Add products failed
 *               content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                               message:
 *                                   type: string
 *                                   description: message about the response status failed
 *                                   example: Add product failed
 */
BookingRouter.post(
    "/:id/products",
    authenticateToken,
    validateEmptyObject,
    BookingProductController.createProductPayment
);

// GET: api/v1/bookings/:id/slots
/**
 * @openapi
 * /api/v1/bookings/{id}/slots:
 *     get:
 *      summary: Get a list of booking slots by booking id
 *      tags: [Bookings]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: number
 *            required: true
 *            description: The booking id
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  slot_id:
 *                                      type: integer
 *                                      description: id of slot
 *                                      example: 1
 *                                  pod_id:
 *                                      type: integer
 *                                      description: id of POD
 *                                      example: 1
 *                                  start_time:
 *                                      type: string
 *                                      format: date-time
 *                                      description: start time of slot
 *                                      example: 2024-10-01T08:00:00.000Z
 *                                  end_time:
 *                                      type: string
 *                                      format: date-time
 *                                      description: end time of slot
 *                                      example: 2024-10-01T12:00:00.000Z
 *                                  unit_price:
 *                                      type: integer
 *                                      format: double
 *                                      description: unit price of slot
 *                                      example: 100000
 *                                  is_available:
 *                                      type: boolean
 *                                      description: available status of slot
 *                                      example: false
 *                                  price:
 *                                      type: integer
 *                                      description: price of slot
 *                                      example: 100000
 *          404:
 *              description: No POD found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: response error message
 *                                  example: Not found any slot!
 *
 */
BookingRouter.get("/:id/slots", BookingSlotController.findAllSlotByBookingId);

// GET: api/v1/bookings/:booking_id/slots/:slot_id/products
/**
 * @openapi
 * /api/v1/bookings/{booking_id}/slots/{slot_id}/products:
 *  get:
 *    summary: Get list of booking products by booking id and slot id
 *    tags: [Bookings]
 *    parameters:
 *          - in: path
 *            name: booking_id
 *            schema:
 *              type: number
 *            required: true
 *            description: The Booking id
 *          - in: path
 *            name: slot_id
 *            schema:
 *              type: number
 *            required: true
 *            description: The Slot id
 *    responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: arrays
 *                          items:
 *                              type: object
 *                              properties:
 *                                  product_id:
 *                                      type: integer
 *                                      description: id of product
 *                                      example: 3
 *                                  product_name:
 *                                      type: string
 *                                      description: name of product
 *                                      example: Expresso
 *                                  price:
 *                                      type: integer
 *                                      format: double
 *                                      description: price price of product
 *                                      example: 30000
 *                                  unit_price:
 *                                      type: integer
 *                                      format: double
 *                                      description: unit price of product
 *                                      example: 30000
 *                                  quantity:
 *                                      type: integer
 *                                      description: quantity of product
 *                                      example: 2
 *                                  stock:
 *                                      type: integer
 *                                      description: remaining amount of product
 *                                      example: 100
 *          404:
 *              description: No booking products found
 */
BookingRouter.get(
    "/:booking_id/slots/:slot_id/products",
    BookingProductController.findByBookingIdAndSlotId
);

// PUT: api/v1/bookings/:booking_id/slots/:slot_id
/**
 * @openapi
 * /api/v1/bookings/{booking_id}/slots/{slot_id}:
 *  put:
 *      summary: Update slot checkin status
 *      tags: [Bookings]
 *      parameters:
 *          - in: path
 *            name: booking_id
 *            schema:
 *              type: number
 *            required: true
 *            description: The booking id
 *          - in: path
 *            name: slot_id
 *            schema:
 *              type: number
 *            required: true
 *            description: The id of slot
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          is_checked_in:
 *                              type: boolean
 *                              required: true
 *      responses:
 *          200:
 *              description: Update successfully!
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              result:
 *                                  type: object
 *                                  description: result meta data
 *                              message:
 *                                  type: string
 *                                  description: update message response
 *                                  example: Update successfully
 *          404:
 *              description: Update Failed
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: update message response
 *                                  example: Not found any slot!
 */
BookingRouter.put(
    "/:booking_id/slots/:slot_id",
    BookingSlotController.updateCheckin
);

// POST: api/v1/bookings
/**
 * @openapi
 * /api/v1/bookings:
 *  post:
 *      summary: Create a new booking
 *      security:
 *          - Authorization: []
 *      tags: [Bookings]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          booking:
 *                              type: object
 *                              properties:
 *                                  pod_id:
 *                                      type: integer
 *                                      description: id of selected POD
 *                                      example: 1
 *                          bookingSlots:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      slot_id:
 *                                          type: integer
 *                                          description: id of POD's selected slot
 *                                          example: 1
 *                                      price:
 *                                          type: integer
 *                                          format: double
 *                                          description: the price for the selected slot
 *                                          example: 80000
 *      responses:
 *           200:
 *              description: Create a booking
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              payment_url:
 *                                  type: string
 *                                  description: payment link for from online payment API
 *                                  example: https://example.com/pay
 *                              message:
 *                                  type: string
 *                                  description: message about the response status
 *                                  example: Booking created successfully
 *           400:
 *               description: Create a booking failed
 *               content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                               message:
 *                                   type: string
 *                                   description: message about the response status failed
 *                                   example: Booking failed
 */
BookingRouter.post(
    "/",
    authenticateToken,
    validateEmptyObject,
    checkAllAvailableSlot,
    BookingController.create
);

// PUT: api/v1/bookings
/**
 * @openapi
 * /api/v1/bookings/{id}:
 *  put:
 *      summary: Update Booking status
 *      tags: [Bookings]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: number
 *            required: true
 *            description: The booking id
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          booking_status:
 *                              type: string
 *                              required: true
 *                              enum: [Pending, Confirmed, Canceled, Complete, Ongoing]
 *      responses:
 *          200:
 *              description: Update successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              result:
 *                                  type: object
 *                                  description: result meta data
 *                              message:
 *                                  type: string
 *                                  description: update message response
 *                                  example: Update successfully
 *          404:
 *              description: Update Failed
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: update message response
 *                                  example: Booking not found
 */
BookingRouter.put("/:id", validateEmptyObject, BookingController.update);
