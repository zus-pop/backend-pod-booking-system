import StoreRepo from "../repositories/StoreRepository.ts";

const findAllStore = async () => {
    try {
        const stores = await StoreRepo.findAll();
        return stores;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const findStoreById = (id: number) => {
    try {
        const store = StoreRepo.findById(id);
        return store;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export default {
    findAllStore,
    findStoreById,
};
