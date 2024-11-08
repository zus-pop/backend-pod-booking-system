import "dotenv/config";
import moment from "moment";
import cron from "node-cron";
import BookingService from "../services/BookingService.ts";
import BookingSlotService from "../services/BookingSlotService.ts";
import NotificationService from "../services/NotificationService.ts";
import PaymentService from "../services/PaymentService.ts";
import SlotService from "../services/SlotService.ts";
import { getPaymentStatus, refundStatus } from "./zalo.ts";
import { Payment } from "../types/type.ts";
import { PoolConnection } from "mysql2/promise";
import PaymentRepository from "../repositories/PaymentRepository.ts";

if (process.env.NODE_ENV !== "test") {
    cron.schedule("*/10 * * * *", async () => {
        console.log(
            `--- Running scheduled task to update expired slot status at ${moment()
                .utcOffset(+7)
                .format("YYYY-MM-DD HH:mm:ss")} ---`
        );
        await SlotService.updateExpiredSlot();
    });
} else {
    console.log("Running in test mode! Could not start this job");
}

export const trackBooking = (
    user_id: number,
    booking_id: number,
    paymentJob?: cron.ScheduledTask,
    transaction_id?: string
) => {
    let isExtend = false;
    const job = cron.schedule("*/30 * * * * *", async () => {
        const FORMAT_TYPE = "YYYY-MM-DD HH:mm:ss";
        const baseTime = 5;
        const bufferTime = 0.5;
        const threshHold = isExtend ? baseTime + bufferTime : baseTime;
        const current = moment().format(FORMAT_TYPE);
        const booking = await BookingService.findBookingById(booking_id);
        const bookingSlots = await BookingSlotService.findAllSlotByBookingId(
            booking?.booking_id!
        );
        console.log(
            `booking ${booking?.booking_id}: ${booking?.booking_status}`
        );
        const isConfirmed = booking?.booking_status === "Confirmed";
        const isCanceled = booking?.booking_status === "Canceled";
        // const isComplete = booking?.booking_status === "Complete";
        if (isConfirmed) {
            setTimeout(() => {
                console.log(
                    `--- Booking ${booking.booking_id} is confirmed -> stop the job ---`
                );
                NotificationService.createNewMessage({
                    user_id,
                    message: `Your booking with ID: ${booking.booking_id} has been confirmed!`,
                    created_at: moment().utcOffset(+7).format(FORMAT_TYPE),
                });
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
                `--- Booking ${booking.booking_id} is canceled -> stop the job ---`
            );
            NotificationService.createNewMessage({
                user_id,
                message: `Your booking with ID: ${booking.booking_id} has been canceled!`,
                created_at: moment().utcOffset(+7).format(FORMAT_TYPE),
            });
            if (transaction_id) {
                await PaymentService.updatePayment({
                    transaction_id,
                    payment_status: "Failed",
                });
            }
            setTimeout(() => {
                if (paymentJob) {
                    paymentJob.stop();
                }
                job.stop();
            }, 0);
        } else {
            const create_at = moment(booking?.booking_date).format(FORMAT_TYPE);
            const timeDiff = moment(current).diff(moment(create_at), "minutes");
            if (timeDiff >= threshHold) {
                // do something when expired
                if (!isExtend) {
                    // extend the job
                    console.log(
                        `--- Threshold reached. Extending time by ${bufferTime} minutes. ---`
                    );
                    isExtend = true;
                } else {
                    await SlotService.updateMultipleSlot(
                        true,
                        bookingSlots!.map((bookingSlot) => bookingSlot.slot_id!)
                    );
                    await BookingService.updateABooking({
                        booking_id,
                        booking_status: "Canceled",
                    });
                    console.log(
                        `Booking ${
                            booking!.booking_id
                        } is expired -> stop the job`
                    );
                    NotificationService.createNewMessage({
                        user_id,
                        message: `Your booking with ID: ${
                            booking!.booking_id
                        } has been expired!`,
                        created_at: moment().utcOffset(+7).format(FORMAT_TYPE),
                    });
                    setTimeout(() => {
                        job.stop();
                    }, 0);
                }
            }
        }
    });
    return job;
};

export const trackPayment = (user_id: number, payment_id: number) => {
    const job = cron.schedule("*/45 * * * * *", async () => {
        const FORMAT_TYPE = "YYYY-MM-DD HH:mm:ss";
        const payment = await PaymentService.findPaymentById(payment_id);
        if (payment) {
            const { return_code, zp_trans_id } = await getPaymentStatus(
                payment.transaction_id!
            );
            if (return_code === 1) {
                // payment is successful
                console.log(
                    `--- Payment ${payment_id} is successful -> stop the job ---`
                );
                await PaymentService.updatePayment({
                    transaction_id: payment.transaction_id,
                    payment_status: "Paid",
                    zp_trans_id: zp_trans_id.toString(),
                });
                await BookingService.updateABooking({
                    booking_id: payment.booking_id,
                    booking_status: "Confirmed",
                });
                NotificationService.createNewMessage({
                    user_id,
                    message: `Your booking with ID: ${payment.booking_id} has been paid successfully!`,
                    created_at: moment().utcOffset(+7).format(FORMAT_TYPE),
                });
                setTimeout(() => {
                    job.stop();
                }, 0);
            } else if (return_code === 2) {
                // payment is failed
                console.log(
                    `--- Payment ${payment_id} is failed -> stop the job ---`
                );
                await PaymentService.updatePayment({
                    transaction_id: payment.transaction_id,
                    payment_status: "Failed",
                });
                await BookingService.updateABooking({
                    booking_id: payment.booking_id,
                    booking_status: "Canceled",
                });
                NotificationService.createNewMessage({
                    user_id,
                    message: `Your booking with ID: ${payment.booking_id} has been paid failed!`,
                    created_at: moment().utcOffset(+7).format(FORMAT_TYPE),
                });
                setTimeout(() => {
                    job.stop();
                }, 0);
            } else {
                // payment is pending
                console.log(`--- Payment ${payment_id} is processing ---`);
            }
        }
    });
    return job;
};

export const trackRefund = async (
    payment_id: number,
    m_refund_id: string,
    user_id: number,
    connection: PoolConnection
) => {
    const job = cron.schedule(`*/3 * * * * *`, async () => {
        const refundStat = await refundStatus(m_refund_id!);
        let message: string;
        if (refundStat?.return_code === 1) {
            console.log(
                `The payment with ID: ${payment_id} is refunded -> stop the job`
            );
            const bookingSlots =
                await BookingSlotService.findAllSlotByPaymentId(payment_id);
            await SlotService.updateMultipleSlot(
                true,
                bookingSlots!.map((bookingSlot) => bookingSlot.slot_id!)
            );
            await PaymentRepository.updateById(
                {
                    payment_id,
                    payment_status: "Refunded",
                    refunded_date: moment()
                        .utcOffset(+7)
                        .format("YYYY-MM-DD HH:mm:ss"),
                },
                connection
            );
            message = `Your payment with ID: ${payment_id} has been refunded successfully!`;
            NotificationService.createNewMessage({
                user_id: user_id,
                message,
                created_at: moment()
                    .utcOffset(+7)
                    .format("YYYY-MM-DD HH:mm:ss"),
            });
            setTimeout(() => {
                job.stop();
            }, 0);
        } else if (refundStat?.return_code === 2) {
            console.log(
                `The payment with ID: ${payment_id} is failed to refund -> stop the job`
            );
            message = `Your payment with ID: ${payment_id} has been failed to refund!`;
            NotificationService.createNewMessage({
                user_id,
                message,
                created_at: moment()
                    .utcOffset(+7)
                    .format("YYYY-MM-DD HH:mm:ss"),
            });
            setTimeout(() => {
                job.stop();
            }, 0);
        } else {
            console.log(`The payment with ID: ${payment_id} is pending`);
        }
    });
};
