import { Request, Response } from "express";
import ProductService from "../services/ProductService.ts";

const findAll = async (_: Request, res: Response) => {
  const product = await ProductService.findAllProduct();
  if (!product) {
    return res.status(404).json({ message: "No POD found" });
  }
  return res.status(200).json(product);
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

export default {
  findAll,
  findById,
  createNewProduct,
  updateProduct,
};
