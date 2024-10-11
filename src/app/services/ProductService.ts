import { pool } from "../config/pool.ts";
import ProductRepository from "../repositories/ProductRepository.ts";
import { Product } from "../types/type.ts";

const findAllProducts = async () => {
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

const findProductByName = async (name: string) => {
  const connection = await pool.getConnection();
  try {
    const products = await ProductRepository.findByName(name, connection);
    return products;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    connection.release();
  }
};

const findProductByCategory = async (category_id: number) => {
  const connection = await pool.getConnection();
  try {
    const products = await ProductRepository.findByCategory(
      category_id,
      connection
    );
    return products;
  } catch (err) {
    console.error(err);
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
    const updated = await ProductRepository.updateProduct(product, connection);
    return updated;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    connection.release();
  }
};

const deleteProductById = async (id: number) => {
  const connection = await pool.getConnection();
  try {
    const isDeleted = await ProductRepository.deleteById(id, connection);
    return isDeleted;
  } catch (err) {
    console.error(err);
    return false;
  } finally {
    connection.release();
  }
};

export default {
  findAllProducts,
  findProductById,
  findProductByName,
  findProductByCategory,
  createNewProduct,
  updateProduct,
  deleteProductById,
};
