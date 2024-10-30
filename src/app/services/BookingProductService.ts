import { pool } from "../config/pool.ts";
import BookingProductRepository from "../repositories/BookingProductRepository.ts";
import BookingRepository from "../repositories/BookingRepository.ts";
import CategoryRepository from "../repositories/CategoryRepository.ts";
import ProductRepository from "../repositories/ProductRepository.ts";
import StoreRepository from "../repositories/StoreRepository.ts";
import { BookingProduct } from "../types/type.ts";
import { createOnlinePaymentRequest } from "../utils/zalo.ts";

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
        return await Promise.all(
            bookingProducts.map(async (bookingProduct) => {
                const product = await ProductRepository.findById(
                    bookingProduct.product_id!,
                    connection,
                    {
                        category: true,
                        store: true,
                    }
                );
                const category = await CategoryRepository.findById(
                    product.category?.category_id!,
                    connection
                );
                const store = await StoreRepository.findById(
                    product.store?.store_id!,
                    connection
                );
                return {
                    product_id: product.product_id,
                    product_name: product.product_name,
                    price: product.price,
                    unit_price: bookingProduct.unit_price,
                    quantity: bookingProduct.quantity,
                    stock: product.stock,
                    category,
                    store,
                };
            })
        );
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const createProductPayment = async (bookingProduct: BookingProduct[]) => {
    const result = await createOnlinePaymentRequest({
        user_id: 888,
        amount: bookingProduct.reduce(
            (acc, cur) => acc + cur.unit_price! * cur.quantity!,
            0
        ),
        expire_duration_seconds: 500,
        item: bookingProduct,
        callback_url: "callback-product",
        redirect_url: "",
    });
    return {
        payment_url: result.order_url,
        message: result.sub_return_message,
    };
};

const addProductForBooking = async (bookingProduct: BookingProduct[]) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const result = await BookingProductRepository.create(
            bookingProduct,
            connection
        );
        await connection.commit();
        return result.affectedRows;
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
    addProductForBooking,
    createProductPayment,
};
