import { Router } from "express";
import { authenticateToken } from "../../middlewares/authenticateToken.ts";
import {
    authenticateCalendar,
    calendarRedirect,
    syncCalendar,
} from "../../utils/google-calendar.ts";

export const GoogleCalendarRouter = Router();

// GET: api/v1/google-calendar
// Google Calendar API
GoogleCalendarRouter.get("/", authenticateToken, authenticateCalendar);

// GET: api/v1/google-calendar/redirect
// Google Calendar API
GoogleCalendarRouter.get("/redirect", calendarRedirect);

// POST: api/v1/google-calendar/sync
GoogleCalendarRouter.post("/sync", authenticateToken, syncCalendar);
