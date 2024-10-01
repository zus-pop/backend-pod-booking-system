import { pool } from "../config/pool.ts";
import CategoryRepository from "../repositories/CategoryRepository.ts";
import { Category } from "../types/type.ts";

const findAll = async () => {
    const connection = await pool.getConnection();
    try {
        const categories = await CategoryRepository.findAll(connection);
        return categories;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const findCategoryById = async (id: number) => {
    const connection = await pool.getConnection();
    try {
        const category = await CategoryRepository.findById(id, connection);
        return category;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};

const createNewCategory = async (category: Category) => {
    const connection = await pool.getConnection();
    try {
        const categoryId = await CategoryRepository.createNewCategory(
            category,
            connection
        );
        return categoryId;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const updateCategory = async (category: Category) => {
    const connection = await pool.getConnection();
    try {
        const affectedRows = await CategoryRepository.updateCategory(
            category,
            connection
        );
        return affectedRows > 0;
    } catch (err) {
        console.error(err);
        return false;
    } finally {
        connection.release();
    }
};

export default {
    findAll,
    findCategoryById,
    createNewCategory,
    updateCategory,
};
