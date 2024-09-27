import PODTypeRepo from "../repositories/PODTypeRepository.ts";

const findAllPODType = async () => {
    try {
        const podTypes = await PODTypeRepo.findAll();
        return podTypes;
    } catch (err) {
        console.error(err);
    }
};

const findPODTypeById = async (id: number) => {
    try {
        const podType = await PODTypeRepo.findById(id);
        return podType;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export default {
    findAllPODType,
    findPODTypeById,
};
