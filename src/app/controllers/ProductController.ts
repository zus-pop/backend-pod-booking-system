import { Request, Response } from "express";
import ProductService from "../services/ProductService.ts";
import { Product } from "../types/type.ts";
import { letImageCookToCloud } from "../utils/google-cloud-storage.ts";

const find = async (req: Request, res: Response) => {
  const { product_name, category_id, page, limit } = req.query;
  const result = await ProductService.find(
    {
      product_name: product_name ? (product_name as string) : undefined,
      category_id: category_id ? +category_id : undefined,
    },
    {
      page: page ? +page : 1,
      limit: limit ? +limit : 10,
    }
  );
  if (!result || !result.products || !result.products.length) {
    return res.status(404).json({ message: "No products found" });
  }

  return res.status(200).json(result);
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
  const { product_name, description, category_id, price, store_id, stock } =
    req.body;

  const newProduct: Product = {
    product_name,
    description,
    category_id,
    price,
    store_id,
    stock,
  };

  const imageFile = req.file;

  if (imageFile) {
    try {
      const publicUrl = await letImageCookToCloud(imageFile, "products");
      newProduct.image = publicUrl;
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Error uploading image to cloud storage" });
    }
  }

  const insertId = await ProductService.createNewProduct(newProduct);
  if (!insertId) {
    return res.status(400).json({ message: "Failed to create new Product" });
  }

  return res.status(201).json({
    message: "Product created successfully",
    product_id: insertId,
  });
};

const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product: Product = {
    ...(req.body as Product),
    product_id: +id, // Lấy ID từ URL
  };

  const imageFile = req.file;
  if (imageFile) {
    try {
      const publicUrl = await letImageCookToCloud(imageFile, "products");
      product.image = publicUrl;
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Error uploading image to cloud storage" });
    }
  }

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

const getTotalRevenueByProduct = async (req: Request, res: Response) => {
  try {
    const totalRevenue = await ProductService.getTotalRevenueByProduct();
    if (!totalRevenue || !totalRevenue.length) {
      return res.status(404).json({ message: "No revenue data found" });
    }
    return res.status(200).json(totalRevenue);
  } catch (error) {
    console.error("Error fetching total revenue by product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  find,
  findById,
  createNewProduct,
  updateProduct,
  deleteProduct,
  getTotalRevenueByProduct,
};
