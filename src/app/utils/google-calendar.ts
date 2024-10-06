import { calendar_v3, google } from "googleapis";
import { Request, Response } from "express";
import BookingService from "../services/BookingService.ts";

const scopes = ["https://www.googleapis.com/auth/calendar"];
const oauth2Client = new google.auth.OAuth2(
    process.env.CALENDAR_CLIENT_ID as string,
    process.env.CALENDAR_CLIENT_SECRET as string,
    process.env.CALENDAR_REDIRECT_URL as string
);

export const calendar = google.calendar({
    version: "v3",
    auth: oauth2Client,
});

export const authenticateCalendar = (_: Request, res: Response) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
    });
    res.redirect(url);
};

export const calendarRedirect = async (req: Request, res: Response) => {
    const { tokens } = await oauth2Client.getToken(req.query.code as string);
    oauth2Client.setCredentials(tokens);
    res.send("Authentication successful! Please return to the website");
};

export const syncCalendar = async (req: Request, res: Response) => {
    const { payload } = req;
    const bookings = await BookingService.findByUserId(payload.user_id);
    const event: calendar_v3.Schema$Event = {
        summary: "Event from API",
        description: "Event from API",
        start: {
            dateTime: "2024-11-01T00:00:00.000",
            timeZone: "Asia/Ho_Chi_Minh",
        },
        end: {
            dateTime: "2024-11-01T01:00:00.000",
            timeZone: "Asia/Ho_Chi_Minh",
        },
    };
    try {
        const result = await calendar.events.insert({
            calendarId: "primary",
            auth: oauth2Client,
            requestBody: event,
        });
        res.status(200).json({ message: "Event created", result });
    } catch (err) {
        console.error(err);
        console.log("here");
        res.status(500).json({ message: "Failed to sync calendar!" });
    }
};
