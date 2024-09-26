import ProductRepository from "../databases/ProductRepository.ts";

const findAllProduct = () => {
  return ProductRepository.findAll();
};

const findProductById = (id: number) => {
  return ProductRepository.findById(id);
};

export default {
  findAllProduct,
  findProductById,
};
