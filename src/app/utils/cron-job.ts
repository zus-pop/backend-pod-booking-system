import moment from "moment";
import "dotenv/config";
import cron from "node-cron";
import BookingService from "../services/BookingService.ts";
import SlotService from "../services/SlotService.ts";
import BookingSlotService from "../services/BookingSlotService.ts";

export const trackBooking = (booking_id: number) => {
    const job = cron.schedule("* * * * * *", async () => {
        const FORMAT_TYPE = "YYYY-MM-DD HH:mm:ss";
        const threshHold = 5;
        const current = moment().format(FORMAT_TYPE);
        const booking = await BookingService.findBookingById(booking_id);
        const bookingSlots = await BookingSlotService.findAllSlotByBookingId(
            booking?.booking_id!
        );
        console.log(
            `booking ${booking?.booking_id}: ${booking?.booking_status}`
        );
        // const isConfirmed = booking?.booking_status === "Confirmed";
        const isCanceled = booking?.booking_status === "Canceled";
        const isComplete = booking?.booking_status === "Complete";
        if (isComplete) {
            setTimeout(() => {
                console.log(
                    `Booking ${booking.booking_id} is confirmed -> stop the job`
                );
                job.stop();
            }, 0);
        } else if (isCanceled) {
            // release slot available again
            await SlotService.updateMultipleSlot(
                true,
                bookingSlots!.map((bookingSlot) => bookingSlot.slot_id!)
            );
            await BookingService.updateABooking({ booking_status: "Canceled" });
            console.log(
                `Booking ${booking.booking_id} is canceled -> stop the job`
            );
            setTimeout(() => {
                job.stop();
            }, 0);
        } else {
            const create_at = moment(booking?.booking_date).format(FORMAT_TYPE);

            if (
                moment(current).diff(moment(create_at), "minutes") >= threshHold
            ) {
                // do something when expired
                await SlotService.updateMultipleSlot(
                    true,
                    bookingSlots!.map((bookingSlot) => bookingSlot.slot_id!)
                );
                console.log(
                    `Booking ${booking!.booking_id} is expired -> stop the job`
                );
                setTimeout(() => {
                    job.stop();
                }, 0);
            }
        }
    });
};
