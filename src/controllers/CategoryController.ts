import { Request, Response } from "express";
import CategoryService from "../services/CategoryService.ts";
import { Category } from "../types/type.ts";

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

const createNewCategory = async (req: Request, res: Response) => {
  const category: Category = {
    category_id: 0,
    category_name: req.body.category_name,
  };

  const categoryId = await CategoryService.createNewCategory(category);
  if (categoryId) {
    return res.status(201).json({
      message: "Category created successfully",
      category_id: categoryId,
    });
  } else {
    return res.status(500).json({ message: "Failed to create category" });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  const category_id = parseInt(req.params.id);
  const category_name = req.body.category_name;

  if (!category_name) {
    return res.status(400).json({ message: "category_name is required" });
  }

  const category: Category = {
    category_id,
    category_name,
  };

  const success = await CategoryService.updateCategory(category);
  if (success) {
    return res.status(200).json({ message: "Category updated successfully" });
  } else {
    return res
      .status(404)
      .json({ message: "Category not found or update failed" });
  }
};

export default {
  findAll,
  findById,
  createNewCategory,
  updateCategory,
};
