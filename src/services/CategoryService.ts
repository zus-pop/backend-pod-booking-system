import CategoryRepository from "../repositories/CategoryRepository.ts";
import { Category } from "../types/type.ts";

const findAll = async () => {
  try {
    const categories = await CategoryRepository.findAll();
    return categories;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const findCategoryById = async (id: number) => {
  try {
    const category = await CategoryRepository.findById(id);
    return category;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const createNewCategory = async (category: Category) => {
  try {
    const categoryId = await CategoryRepository.createNewCategory(category);
    return categoryId;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const updateCategory = async (category: Category) => {
  try {
    const affectedRows = await CategoryRepository.updateCategory(category);
    return affectedRows > 0;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export default {
  findAll,
  findCategoryById,
  createNewCategory,
  updateCategory,
};
