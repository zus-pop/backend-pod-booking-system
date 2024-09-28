import moment from "moment";
import "dotenv/config";
import cron from "node-cron";
import BookingService from "../services/BookingService.ts";

export const trackBooking = (booking_id: number) => {
    const job = cron.schedule("* * * * * *", async () => {
        const FORMAT_TYPE = "YYYY-MM-DD HH:mm:ss";
        const threshHold = 5;
        const current = moment().format(FORMAT_TYPE);
        const booking = await BookingService.findBookingById(booking_id);
        console.log(
            `booking ${booking?.booking_id}: ${booking?.booking_status}`
        );
        const isPending = booking?.booking_status === "Pending";
        const isConfirmed = booking?.booking_status === "Confirmed";
        const isCanceled = booking?.booking_status === "Canceled";
        const isComplete = booking?.booking_status === "Completed";
        if (isConfirmed || isComplete) {
            setTimeout(() => {
                console.log(
                    `Booking ${booking.booking_id} is confirmed or complete -> stop the job`
                );
                job.stop();
            }, 0);
        } else if (isCanceled) {
            console.log(
                `Booking ${booking.booking_id} is canceled -> stop the job`
            );
            // release slot available again
            setTimeout(() => {
                job.stop();
            }, 0);
        } else {
            const create_at = moment(booking?.booking_date).format(FORMAT_TYPE);

            if (
                moment(current).diff(moment(create_at), "minutes") >= threshHold
            ) {
                // do something when expired
            }
        }
    });
};
trackBooking(1);
trackBooking(2);
trackBooking(3);
trackBooking(4);
