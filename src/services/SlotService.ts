import SlotRepo from "../databases/SlotRepository.ts";

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
