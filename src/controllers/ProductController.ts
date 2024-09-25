import { Request, Response } from "express";
import ProductService from "../services/ProductService.ts";

const findAll = async (_: Request, res: Response) => {
  const product = await ProductService.findAllProduct();
  if (!product) {
    return res.status(404).json({ message: "No POD found" });
  }
  return res.status(200).json(product);
};

export default {
  findAll,
};
