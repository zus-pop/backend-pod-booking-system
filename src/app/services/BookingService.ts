import moment from "moment";
import BookingRepo from "../repositories/BookingRepository.ts";
import { Booking, BookingSlot } from "../types/type.ts";
import { getTotalCost } from "../utils/util.ts";
import { pool } from "../config/pool.ts";
import { createOnlinePaymentRequest } from "../utils/zalo.ts";
import PaymentRepo from "../repositories/PaymentRepository.ts";
import SlotRepo from "../repositories/SlotRepository.ts";
import BookingSlotRepo from "../repositories/BookingSlotRepository.ts";

const FORMAT_TYPE = "YYYY-MM-DD HH:mm:ss";

const findAllBooking = async () => {
    const connection = await pool.getConnection();
    try {
        const bookings = await BookingRepo.findAll(connection);
        return bookings;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};

const findBookingById = async (id: number) => {
    const connection = await pool.getConnection();
    try {
        const booking = await BookingRepo.findById(id, connection);
        return booking;
    } catch (err) {
        return null;
    } finally {
        connection.release();
    }
};

const createABooking = async (
    booking: Booking,
    bookingSlots: BookingSlot[],
    user_id: number
) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        booking = {
            ...booking,
            user_id,
            booking_date: moment().format(FORMAT_TYPE),
            booking_status: "Pending",
        };
        const bookingResult = await BookingRepo.create(booking, connection);
        bookingSlots = bookingSlots.map((bookingSlot) => ({
            ...bookingSlot,
            booking_id: bookingResult.insertId,
        }));
        await BookingSlotRepo.createMany(bookingSlots, connection);
        await SlotRepo.updateStatusMultipleSlot(
            false,
            bookingSlots.map((bookingSlot) => bookingSlot.slot_id!),
            connection
        );
        const total_cost = await getTotalCost(bookingSlots);
        const { return_code, order_url, sub_return_message, app_trans_id } =
            await createOnlinePaymentRequest(bookingSlots, total_cost);
        if (return_code === 1) {
            await PaymentRepo.create(
                {
                    booking_id: bookingResult.insertId,
                    transaction_id: app_trans_id,
                    total_cost,
                    payment_date: moment().format(FORMAT_TYPE),
                    payment_status: "Unpaid",
                },
                connection
            );
            await connection.commit();
            return {
                order_url,
                message: sub_return_message,
            };
        } else throw new Error(sub_return_message);
    } catch (err) {
        console.log(err);
        await connection.rollback();
        return null;
    } finally {
        connection.release();
    }
};

const updateABooking = async (booking: Booking) => {
    const connection = await pool.getConnection();
    try {
        const result = await BookingRepo.update(booking, connection);
        return result;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};

export default {
    findAllBooking,
    findBookingById,
    createABooking,
    updateABooking,
};
