import ProductRepository from "../repositories/ProductRepository.ts";

const findAllProduct = async () => {
    try {
        const products = await ProductRepository.findAll();
        return products;
    } catch (err) {
        console.log(err);
        return null;
    }
};

const findProductById = async (id: number) => {
    try {
        const product = await ProductRepository.findById(id);
        return product;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export default {
    findAllProduct,
    findProductById,
};
