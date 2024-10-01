import { pool } from "../config/pool.ts";
import ProductRepository from "../repositories/ProductRepository.ts";
import { Product } from "../types/type.ts";

const findAllProduct = async () => {
    const connection = await pool.getConnection();
    try {
        const products = await ProductRepository.findAll(connection);
        return products;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};

const findProductById = async (id: number) => {
    const connection = await pool.getConnection();
    try {
        const product = await ProductRepository.findById(id, connection);
        return product;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};

const createNewProduct = async (productData: Product) => {
    const connection = await pool.getConnection();
    try {
        const newProductId = await ProductRepository.createNewProduct(
            productData,
            connection
        );
        const newProduct = await ProductRepository.findById(
            newProductId,
            connection
        );
        return newProduct;
    } catch (err) {
        console.error("Error creating new product:", err);
        throw new Error("Unable to create new product");
    } finally {
        connection.release();
    }
};

const updateProduct = async (product: Product) => {
    const connection = await pool.getConnection();
    try {
        const updated = await ProductRepository.updateProduct(
            product,
            connection
        );
        return updated;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

export default {
    findAllProduct,
    findProductById,
    createNewProduct,
    updateProduct,
};
