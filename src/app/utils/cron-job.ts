import moment from "moment";
import "dotenv/config";
import cron from "node-cron";
import BookingService from "../services/BookingService.ts";
import SlotService from "../services/SlotService.ts";
import BookingSlotService from "../services/BookingSlotService.ts";
import PaymentService from "../services/PaymentService.ts";
import { getPaymentStatus } from "./zalo.ts";

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
                await BookingService.updateABooking({
                    booking_id,
                    booking_status: "Canceled",
                });
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

export const trackPayment = (payment_id: number) => {
    const job = cron.schedule("* * * * * *", async () => {
        const payment = await PaymentService.findPaymentById(payment_id);
        if (payment) {
            const { return_code } = await getPaymentStatus(
                payment.transaction_id!
            );
            if (return_code === 1) {
                // payment is successful
                console.log(
                    `Payment ${payment_id} is successful -> stop the job`
                );
                await PaymentService.updatePayment({
                    transaction_id: payment.transaction_id,
                    payment_status: "Paid",
                });
                await BookingService.updateABooking({
                    booking_id: payment.booking_id,
                    booking_status: "Confirmed",
                });
                setTimeout(() => {
                    job.stop();
                }, 0);
            } else if (return_code === 2) {
                // payment is failed
                console.log(`Payment ${payment_id} is failed -> stop the job`);
                await PaymentService.updatePayment({
                    transaction_id: payment.transaction_id,
                    payment_status: "Failed",
                });
                await BookingService.updateABooking({
                    booking_id: payment.booking_id,
                    booking_status: "Canceled",
                });
                setTimeout(() => {
                    job.stop();
                }, 0);
            } else {
                // payment is pending
                console.log(`Payment ${payment_id} is processing`);
            }
        }
    });
};
