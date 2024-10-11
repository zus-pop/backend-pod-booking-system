import { pool } from "../config/pool.ts";
import BookingProductRepository from "../repositories/BookingProductRepository.ts";
import CategoryRepository from "../repositories/CategoryRepository.ts";
import ProductRepository from "../repositories/ProductRepository.ts";
import StoreRepository from "../repositories/StoreRepository.ts";

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
                    connection
                );
                const category = await CategoryRepository.findById(
                    product.category_id!,
                    connection
                );
                const store = await StoreRepository.findById(
                    product.store_id!,
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

// const createBookingProductList = async (
//     bookingProducts: BookingProduct[],
// ) => {
//     try {
//         const result = await BookingProductRepository.create(bookingProducts);
//         return result;
//     } catch (err) {
//         throw err;
//     }
// };

export default {
    findAllBookingProducts,
    findByBookingId,
    // createBookingProductList,
};
