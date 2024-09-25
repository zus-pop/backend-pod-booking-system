import ProductRepository from "../databases/ProductRepository.ts";

const findAllProduct = () => {
  return ProductRepository.findAll();
};

export default {
  findAllProduct,
};
