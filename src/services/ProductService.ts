import { pool } from "../config/pool.ts";
import ProductRepository from "../repositories/ProductRepository.ts";
import { Product } from "../types/type.ts";

const connection = await pool.getConnection();
const findAllProduct = async () => {
  try {
    const products = await ProductRepository.findAll(connection);
    return products;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const findProductById = async (id: number) => {
  try {
    const product = await ProductRepository.findById(id, connection);
    return product;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const createNewProduct = async (productData: Product) => {
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
  }
};

const updateProduct = async (product: Product) => {
  try {
    const updated = await ProductRepository.updateProduct(product, connection);
    return updated;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export default {
  findAllProduct,
  findProductById,
  createNewProduct,
  updateProduct,
};
