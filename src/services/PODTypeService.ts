import PODRepo from "../repositories/PODRepository.ts";

const findAllPODType = () => {
    return PODRepo.findAll();
};

const findPODTypeById = (id: number) => {
    return PODRepo.findById(id);
};

export default {
    findAllPODType,
    findPODTypeById,
};
