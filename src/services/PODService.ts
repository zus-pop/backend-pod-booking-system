import PODRepo from "../databases/PODRepository.ts";

const findAllPOD = () => {
    return PODRepo.findAll();
};

const findPODById = (id: number) => {
    return PODRepo.findById(id);
};

export default {
    findAllPOD,
    findPODById,
};
