import SlotRepo from "../repositories/SlotRepository.ts";

const findAllSlot = async () => {
    try {
        const slots = await SlotRepo.findAll();
        return slots;
    } catch (err) {
        console.log(err);
        return null;
    }
};

const findSlotById = async (id: number) => {
    try {
        const slot = await SlotRepo.findById(id);
        return slot;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export default {
    findAllSlot,
    findSlotById,
};
