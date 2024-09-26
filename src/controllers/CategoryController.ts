import { Request, Response } from "express";
import CategoryService from "../services/CategoryService.ts";

const findAll = async (_: Request, res: Response) => {
  const category = await CategoryService.findAll();
  if (!category) {
    return res.status(404).json({ message: "No Category found" });
  }
  return res.status(200).json(category);
};

const findById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await CategoryService.findCategoryById(+id);
  if (!category) {
    return res.status(404).json({ message: "No Category found" });
  }
  return res.status(200).json(category);
};

export default {
  findAll,
  findById,
};
