import CategoryReposỉtory from "../repositories/CategoryRepository.ts";

const findAll = () => {
    return CategoryReposỉtory.findAll();
};

const findCategoryById = (id: number) => {
    return CategoryReposỉtory.findById(id);
};

export default {
    findAll,
    findCategoryById,
};
