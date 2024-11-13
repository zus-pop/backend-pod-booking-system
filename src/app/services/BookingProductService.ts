import moment from "moment";
import { pool } from "../config/pool.ts";
import BookingProductRepository from "../repositories/BookingProductRepository.ts";
import { BookingProduct } from "../types/type.ts";
import { createOnlinePaymentRequest } from "../utils/zalo.ts";
import PaymentRepository from "../repositories/PaymentRepository.ts";
import ProductRepository from "../repositories/ProductRepository.ts";

const findAllBookingProducts = async () => {
    const connection = await pool.getConnection();
    try {
        const bookingProducts = await BookingProductRepository.findAll(
            connection
        );
        return bookingProducts;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const findByBookingId = async (booking_id: number) => {
    const connection = await pool.getConnection();
    try {
        const bookingProducts = await BookingProductRepository.findByBookingId(
            booking_id,
            connection
        );
        return bookingProducts;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const findByBookingIdAndSlotId = async (
    booking_id: number,
    slot_id: number
) => {
    const connection = await pool.getConnection();
    try {
        const bookingProducts =
            await BookingProductRepository.findByBookingIdAndSlotId(
                booking_id,
                slot_id,
                connection
            );
        return bookingProducts;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const findAllSlotByBookingIdAndPaymentId = async (
    booking_id: number,
    payment_id: number
) => {
    const connection = await pool.getConnection();
    try {
        const bookingProducts =
            await BookingProductRepository.findAllSlotByBookingIdAndPaymentId(
                booking_id,
                payment_id,
                connection
            );
        return bookingProducts;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const createProductPayment = async (
    bookingProduct: BookingProduct[],
    user_id: number
) => {
    const amount = bookingProduct.reduce(
        (acc, cur) => acc + cur.unit_price! * cur.quantity!,
        0
    );
    const { return_code, sub_return_message, order_url } =
        await createOnlinePaymentRequest({
            user_id,
            amount,
            expire_duration_seconds: 600,
            item: bookingProduct,
            callback_url: "callback-product",
            redirect_url: "",
        });
    if (return_code !== 1) throw new Error(sub_return_message);
    return {
        payment_url: order_url,
        message: sub_return_message,
    };
};

const addProductForBooking = async (bookingProducts: BookingProduct[]) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const paymentResult = await PaymentRepository.create(
            {
                transaction_id: `${moment().format("YYMMDD")}_${Math.floor(
                    Math.random() * 1000000
                )}`,
                booking_id: bookingProducts[0].booking_id,
                total_cost: bookingProducts.reduce(
                    (acc, cur) => acc + cur.unit_price! * cur.quantity!,
                    0
                ),
                payment_date: moment()
                    .utcOffset(+7)
                    .format("YYYY-MM-DD HH:mm:ss"),
                payment_status: "Paid",
                payment_for: "Product",
            },
            connection
        );

        const productResult = await BookingProductRepository.create(
            bookingProducts.map((bookingProduct) => ({
                ...bookingProduct,
                payment_id: paymentResult.insertId,
            })),
            connection
        );

        if (productResult.affectedRows) {
            for (const bookingProduct of bookingProducts) {
                const product = await ProductRepository.findById(
                    bookingProduct.product_id!,
                    connection
                );
                const newStock = product.stock! - bookingProduct.quantity!;
                await ProductRepository.updateProduct(
                    {
                        product_id: product.product_id,
                        stock: newStock,
                    },
                    connection
                );
            }
        }

        await connection.commit();
        return { message: "Booking Product Added Successfully" };
    } catch (err) {
        console.log(err);
        await connection.rollback();
        return null;
    } finally {
        connection.release();
    }
};

export default {
    findAllBookingProducts,
    findByBookingId,
    findByBookingIdAndSlotId,
    findAllSlotByBookingIdAndPaymentId,
    addProductForBooking,
    createProductPayment,
};
