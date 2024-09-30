import moment from "moment";
import BookingRepo from "../repositories/BookingRepository.ts";
import { Booking, BookingProduct, BookingSlot } from "../types/type.ts";
import SlotService from "./SlotService.ts";
import { getTotalCost } from "../utils/util.ts";
import { pool } from "../config/pool.ts";
import { createOnlinePaymentRequest } from "../utils/zalo.ts";
import PaymentRepository from "../repositories/PaymentRepository.ts";

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

const findBookingByTransactionId = async (transaction_id: number) => {
    const connection = await pool.getConnection();
    try {
        const booking = await BookingRepo.findByTransactionId(
            transaction_id,
            connection
        );
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
        // bookingProducts = bookingProducts.map((bookingProduct) => ({
        //     ...bookingProduct,
        //     booking_id: bookingResult.insertId,
        // }));
        // await BookingProductRepository.create(bookingProducts, connection);
        // for (const bookingProduct of bookingProducts) {
        //     const product = await ProductService.findProductById(
        //         bookingProduct.product_id!
        //     );
        //     const newStock = product?.stock! - bookingProduct.quantity!;
        //     await ProductService.updateProduct({
        //         // This need to beed change in the repo
        //         product_id: bookingProduct.product_id,
        //         stock: newStock,
        //     });
        // }
        bookingSlots = bookingSlots.map((bookingSlot) => ({
            ...bookingSlot,
            booking_id: bookingResult.insertId,
        }));
        const total_cost = await getTotalCost(bookingSlots);
        const { return_code, order_url, sub_return_message, app_trans_id } =
            await createOnlinePaymentRequest(bookingSlots);
        if (return_code === 1) {
            const paymentResult = await PaymentRepository.create(
                {
                    booking_id: bookingResult.insertId,
                    transaction_id: app_trans_id,
                    total_cost,
                    payment_date: moment().format(FORMAT_TYPE),
                    payment_status: "Unpaid",
                },
                connection
            );
            // Update soon
            await connection.commit();
        } else throw new Error(sub_return_message);
    } catch (err) {
        console.log(err);
        await connection.rollback();
        return null;
    } finally {
        connection.release();
    }
    return 1;
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
    findBookingByTransactionId,
    createABooking,
    updateABooking,
};
