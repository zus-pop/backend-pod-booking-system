import ProductRepository from "../repositories/ProductRepository.ts";
import { Product } from "../types/type.ts";

const findAllProduct = async () => {
  try {
    const products = await ProductRepository.findAll();
    return products;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const findProductById = async (id: number) => {
  try {
    const product = await ProductRepository.findById(id);
    return product;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const createNewProduct = async (productData: Product) => {
  try {
    const newProductId = await ProductRepository.createNewProduct(productData);
    const newProduct = await ProductRepository.findById(newProductId);
    return newProduct;
  } catch (err) {
    console.error("Error creating new product:", err);
    throw new Error("Unable to create new product");
  }
};

const updateProduct = async (product: Product) => {
  try {
    const updated = await ProductRepository.updateProduct(product);
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
