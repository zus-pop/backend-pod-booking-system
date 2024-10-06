import { Router } from "express";
import { authenticateToken } from "../../middlewares/authenticateToken.ts";
import {
    authenticateCalendar,
    calendarRedirect,
    syncCalendar,
} from "../../utils/google-calendar.ts";

export const GoogleCalendarRouter = Router();

// GET: api/v1/google-calendar
/**
 * @openapi
 * tags:
 *  name: Google Calendar
 *  description: Sync customer's booking schedule into google calendar API
 * /api/v1/google-calendar:
 *  get:
 *    summary: Google Calendar OAuth2 Authentication
 *    description: Redirects the user to Google OAuth2 for authentication and to get a token. This is the first step before syncing the user's calendar with Google Calendar.
 *    tags: [Google Calendar]
 *    security:
 *      - Authorization: []
 *    responses:
 *      200:
 *          description: Redirect URL to Google OAuth2 login page
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          redirect_url:
 *                              type: string
 *                              description: Redirect URL to Google OAuth2 login page
 *      401:
 *          description: Unauthorized
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              description: message response
 *                              example: No token provided
 *      403:
 *          description: Forbidden
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              description: error name
 *                          message:
 *                              type: string
 *                              description: message response
 */
GoogleCalendarRouter.get("/", authenticateCalendar);

// GET: api/v1/google-calendar/redirect
// Google Calendar API
GoogleCalendarRouter.get("/redirect", calendarRedirect);

// POST: api/v1/google-calendar/sync
/**
 * @openapi
 * /api/v1/google-calendar/sync:
 *  post:
 *    summary: Sync User's Bookings to Google Calendar
 *    tags: [Google Calendar]
 *    description: Syncs confirmed bookings to the user's personal Google Calendar by creating calendar events.
 *    security:
 *      - Authorization: []
 *    responses:
 *      200:
 *        description: Successfully synced calendar events
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "Events synced"
 *      404:
 *        description: No confirmed bookings found for the user
 *      500:
 *        description: Failed to sync calendar
 */
GoogleCalendarRouter.post("/sync", authenticateToken, syncCalendar);
