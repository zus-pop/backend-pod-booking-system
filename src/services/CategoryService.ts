import CategoryRepo from "../databases/CategoryRepository.ts";

const findAllCategory = () => {
  return CategoryRepo.findAll();
};

const findCategoryById = (id: number) => {
  return CategoryRepo.findById(id);
};

export default {
  findAllCategory,
  findCategoryById,
};
