import SlotRepo from "../repositories/SlotRepository.ts";

const findAllSlot = () => {
    return SlotRepo.findAll();
};

const findSlotById = (id: number) => {
    return SlotRepo.findById(id);
};

export default {
    findAllSlot,
    findSlotById,
};
