import { pool } from "../config/pool.ts";
import ProductRepository from "../repositories/ProductRepository.ts";
import { Pagination, Product, ProductQueries } from "../types/type.ts";

const find = async (filters: ProductQueries, pagination?: Pagination) => {
  const connection = await pool.getConnection();
  try {
    const products = await ProductRepository.find(
      filters,
      connection,
      pagination
    );
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

const createNewProduct = async (newProduct: Product) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const insertId = await ProductRepository.createNewProduct(
      newProduct,
      connection
    );
    await connection.commit();
    return insertId;
  } catch (err) {
    console.log(err);
    await connection.rollback();
    return null;
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

const getTotalRevenueByProduct = async () => {
  const connection = await pool.getConnection();
  try {
    const totalRevenue = await ProductRepository.getTotalRevenueByProduct(
      connection
    );
    return totalRevenue;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    connection.release();
  }
};

export default {
  find,
  findProductById,
  findProductByName,
  findProductByCategory,
  createNewProduct,
  updateProduct,
  deleteProductById,
  getTotalRevenueByProduct,
};
