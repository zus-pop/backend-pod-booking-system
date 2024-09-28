import { pool } from "../config/pool.ts";
import SlotRepo from "../repositories/SlotRepository.ts";

const connection = await pool.getConnection();

const findAllSlot = async () => {
    try {
        const slots = await SlotRepo.findAll(connection);
        return slots;
    } catch (err) {
        console.log(err);
        return null;
    }
};

const findSlotById = async (id: number) => {
    try {
        const slot = await SlotRepo.findById(id, connection);
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
