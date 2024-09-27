import moment from "moment";
import BookingRepo from "../repositories/BookingRepository.ts";
import { Booking, BookingProduct, Slot } from "../types/type.ts";
import BookingProductService from "./BookingProductService.ts";
import PaymentService from "./PaymentService.ts";
import SlotService from "./SlotService.ts";
import { getTotalCost } from "../utils/util.ts";
import ProductService from "./ProductService.ts";

const FORMAT_TYPE = "YYYY-MM-DD HH:mm:ss";

const findAllBooking = async () => {
    try {
        const bookings = await BookingRepo.findAll();
        return bookings;
    } catch (err) {
        return null;
    }
};

const findBookingById = async (id: number) => {
    try {
        const booking = await BookingRepo.findById(id);
        return booking;
    } catch (err) {
        return null;
    }
};

const findBookingByTransactionId = async (transaction_id: number) => {
    try {
        const booking = await BookingRepo.findByTransactionId(transaction_id);
        return booking;
    } catch (err) {
        return null;
    }
};

const createABooking = async (
    booking: Booking,
    bookingProducts: BookingProduct[],
    user_id: number
) => {
    try {
        await BookingRepo.beginTransaction();
        booking = {
            ...booking,
            user_id,
            booking_date: moment().format(FORMAT_TYPE),
            booking_status: "Pending",
        };
        const bookingResult = await BookingRepo.create(booking);
        bookingProducts = bookingProducts.map((bookingProduct) => ({
            ...bookingProduct,
            booking_id: bookingResult.insertId,
        }));
        await BookingProductService.createBookingProductList(bookingProducts);
        for (const bookingProduct of bookingProducts) {
            const product = await ProductService.findProductById(
                bookingProduct.product_id!
            );
            const newStock = product?.stock! - bookingProduct.quantity!;
            await ProductService.updateProduct({
                // This need to beed change in the repo
                product_id: bookingProduct.product_id,
                stock: newStock,
            });
        }
        const slot = await SlotService.findSlotById(booking.slot_id!);
        const total_cost = await getTotalCost(bookingProducts, slot!);
        const { return_code, order_url, sub_return_message, app_trans_id } =
            await PaymentService.createOnlinePaymentRequest(bookingProducts);
        if (return_code === 1) {
            const paymentResult = await PaymentService.createPayment({
                booking_id: bookingResult.insertId,
                transaction_id: app_trans_id,
                total_cost,
                payment_date: moment().format(FORMAT_TYPE),
                payment_status: "Unpaid",
            });
            // Update soon
            await BookingRepo.commit();
        } else throw new Error(sub_return_message);
    } catch (err) {
        console.log(err);
        await BookingRepo.rollback();
        return null;
    }
    return 1;
};

const updateABooking = async (booking: Booking) => {
    try {
        const result = await BookingRepo.update(booking);
        return result;
    } catch (err) {
        return null;
    }
};

export default {
    findAllBooking,
    findBookingById,
    findBookingByTransactionId,
    createABooking,
    updateABooking,
};
