import CategoryRepository from "../repositories/CategoryRepository.ts";

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

export default {
    findAll,
    findCategoryById,
};
