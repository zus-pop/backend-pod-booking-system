import { calendar_v3, google } from "googleapis";
import { Request, Response } from "express";
import BookingService from "../services/BookingService.ts";
import moment from "moment";

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
    res.status(200).json({ redirect_url: url });
    // res.send(`
    //     <div id="foo">Click here</div>
    //     <script>
    //     document.getElementById('foo').addEventListener('click', function(){
    //     console.log("foo")
    //         window.open("${redirect_url}")
    // })
    //     </script>`);
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
    res.send(`
        <html>
        <body>
          <h1>Authentication successful! Please return to the website</h1>
          <p>You have successfully authenticated with Google Calendar.</p>
          <p>This window will close automatically in 5 seconds...</p>
          <script>
            setTimeout(function() {
              window.close();
            }, 5000); // Close the window after 5 seconds
          </script>
        </body>
      </html>
        `);
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
