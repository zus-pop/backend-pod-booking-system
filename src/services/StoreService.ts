import StoreRepo from "../repositories/StoreRepository.ts";

const findAllStore = () => {
    return StoreRepo.findAll();
};

const findStoreById = (id: number) => {
    return StoreRepo.findById(id);
};

export default {
    findAllStore,
    findStoreById,
};
