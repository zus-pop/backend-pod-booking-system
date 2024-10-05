import { google } from "googleapis";

export const scopes = ["https://www.googleapis.com/auth/calendar"];
export const oauth2Client = new google.auth.OAuth2(
    process.env.CALENDAR_CLIENT_ID as string,
    process.env.CALENDAR_CLIENT_SECRET as string,
    process.env.CALENDAR_REDIRECT_URL as string
);

export const calendar = google.calendar({
    version: "v3",
    auth: oauth2Client,
});
