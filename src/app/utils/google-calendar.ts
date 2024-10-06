import { calendar_v3, google } from "googleapis";
import { Request, Response } from "express";
import BookingService from "../services/BookingService.ts";
import moment from "moment";
import crypto, { createHash } from "crypto";

function generateEventIdFromData(
    eventDetails: calendar_v3.Schema$Event
): string {
    // Combine the event data to generate a unique string
    const dataToHash = `${eventDetails.summary}-${eventDetails.start}-${eventDetails.end}-${eventDetails.description}`;

    // Create a SHA-256 hash of the event data
    const hash = createHash("sha256").update(dataToHash).digest("hex");

    // Use the first 20 characters of the hash as the event ID and encode to base32
    return base32Encode(hash.slice(0, 20)); // Base32 encode the hash to meet Google Calendar's ID requirements
}

// Convert a hash to base32 encoding to comply with Google Calendar's ID requirements
function base32Encode(hash: string): string {
    const base32Chars = "0123456789abcdefghijklmnopqrstuv"; // Base32 allowed characters
    const buffer: Buffer = Buffer.from(hash, "hex"); // Convert hash to a buffer
    let encoded = "";

    let bits = 0;
    let value = 0;

    for (let i = 0; i < buffer.length; i++) {
        value = (value << 8) | buffer[i]; // Combine buffer values into 'value'
        bits += 8;
        while (bits >= 5) {
            encoded += base32Chars[(value >>> (bits - 5)) & 31]; // Encode in chunks of 5 bits
            bits -= 5;
        }
    }

    if (bits > 0) {
        encoded += base32Chars[(value << (5 - bits)) & 31]; // Handle remaining bits
    }

    return encoded;
}

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

export const getCalendar = async (summary: string, description: string) => {
    try {
        const response = await calendar.calendarList.list({
            auth: oauth2Client,
        });

        const calendars = response.data.items;

        const existedCalendar = calendars?.find(
            (cal) => cal.summary === summary
        );

        if (existedCalendar) {
            console.log("Calendar already exists");
            return existedCalendar.id;
        }

        const newCalendar: calendar_v3.Schema$Calendar = {
            summary,
            description,
            timeZone: "Asia/Ho_Chi_Minh",
        };

        const newCalendarResponse = await calendar.calendars.insert({
            auth: oauth2Client,
            requestBody: newCalendar,
        });

        console.log(
            `New calendar is created: ${newCalendarResponse.data.summary}`
        );

        return newCalendarResponse.data.id;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const deleteBeforeSyncAgain = async (userCalendarId: string) => {
    const response = await calendar.events.list({
        calendarId: userCalendarId as string,
    });

    const events = response.data.items;
    if (events && events.length) {
        for (const event of events) {
            try {
                await calendar.events.delete({
                    auth: oauth2Client,
                    calendarId: userCalendarId as string,
                    eventId: event.id as string,
                });
            } catch (err) {
                console.error(err);
                return;
            }
        }
        console.log("Delete Successfully");
    }
};

export const calendarRedirect = async (req: Request, res: Response) => {
    const { tokens } = await oauth2Client.getToken(req.query.code as string);
    oauth2Client.setCredentials(tokens);
    res.send("Authentication successful! Please return to the website");
};

export const syncCalendar = async (req: Request, res: Response) => {
    const { payload } = req;
    const userCalendarId = await getCalendar(
        "POD Booking",
        "This is a personal calendar for user events."
    );
    await deleteBeforeSyncAgain(userCalendarId as string);

    const bookings = await BookingService.findByUserId(payload.user_id);
    if (!bookings || !bookings.length) {
        return res.status(404).send("No bookings found");
    }
    const confirmedBookings = bookings.filter(
        (booking) => booking.booking_status === "Confirmed"
    );
    for (const booking of confirmedBookings) {
        if (!booking.slots || !booking.slots.length) {
            continue;
        }
        for (const slot of booking.slots) {
            const event: calendar_v3.Schema$Event = {
                summary: `Event for - ${booking.pod?.pod_name}`,
                description: `Event from booking of ${booking.pod?.pod_name}`,
                start: {
                    dateTime: moment
                        .utc(slot.start_time)
                        .format("YYYY-MM-DDTHH:mm:ss"),
                    timeZone: "Asia/Ho_Chi_Minh",
                },
                end: {
                    dateTime: moment
                        .utc(slot.end_time)
                        .format("YYYY-MM-DDTHH:mm:ss"),
                    timeZone: "Asia/Ho_Chi_Minh",
                },
            };
            try {
                await calendar.events.insert({
                    calendarId: userCalendarId as string,
                    auth: oauth2Client,
                    requestBody: event,
                });
            } catch (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Failed to sync calendar",
                });
            }
        }
    }
    return res.status(200).json({ message: "Events synced" });
};
