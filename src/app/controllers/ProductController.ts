import { Request, Response } from "express";
import ProductService from "../services/ProductService.ts";
import { Product } from "../types/type.ts";

const find = async (req: Request, res: Response) => {
  const { name, category_id } = req.query;
  let products: Product[] | null;

  if (name) {
    products = await ProductService.findProductByName(name as string);
    if (!products || !products.length) {
      return res.status(404).json({ message: "No products found" });
    }
  } else if (category_id) {
    products = await ProductService.findProductByCategory(+category_id);
    if (!products || !products.length) {
      return res.status(404).json({ message: "No products found" });
    }
  } else {
    products = await ProductService.findAllProducts();
    if (!products || !products.length) {
      return res.status(404).json({ message: "No products found" });
    }
  }

  return res.status(200).json(products);
};

const findById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await ProductService.findProductById(+id);
  if (!product) {
    return res.status(404).json({ message: "No POD found" });
  }
  return res.status(200).json(product);
};

const createNewProduct = async (req: Request, res: Response) => {
  try {
    const {
      product_name,
      category_id,
      image,
      description,
      price,
      store_id,
      stock,
    } = req.body;
    if (
      !product_name ||
      !category_id ||
      price === undefined ||
      !store_id ||
      stock === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProduct: any = {
      product_name,
      category_id,
      image,
      description,
      price,
      store_id,
      stock,
    };

    const createdProduct = await ProductService.createNewProduct(newProduct);

    return res.status(201).json(createdProduct);
  } catch (err) {
    console.error("Error in ProductController create:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  const product: any = {
    product_id: +req.params.id,
    product_name: req.body.product_name,
    category_id: req.body.category_id,
    image: req.body.image,
    description: req.body.description,
    price: req.body.price,
    store_id: req.body.store_id,
    stock: req.body.stock,
  };

  const updated = await ProductService.updateProduct(product);
  if (updated) {
    return res.status(200).json({ message: "Product updated successfully" });
  } else {
    return res
      .status(404)
      .json({ message: "Product not found or update failed" });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const isDeleted = await ProductService.deleteProductById(+id);

  if (isDeleted) {
    return res.status(200).json({ message: "Product deleted successfully" });
  } else {
    return res
      .status(404)
      .json({ message: "Product not found or deletion failed" });
  }
};

export default {
  find,
  findById,
  createNewProduct,
  updateProduct,
  deleteProduct,
};
