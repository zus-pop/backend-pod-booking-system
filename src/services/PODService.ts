import PODRepo from "../repositories/PODRepository.ts";

const findAllPOD = async () => {
    try {
        const PODs = await PODRepo.findAll();
        return PODs;
    } catch (err) {
        console.log(err);
        return null;;
    }
};

const findPODById = async (id: number) => {
    try {
        const POD = await PODRepo.findById(id);
        return POD;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export default {
    findAllPOD,
    findPODById,
};
