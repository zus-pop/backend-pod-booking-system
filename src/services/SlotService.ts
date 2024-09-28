import { pool } from "../config/pool.ts";
import SlotRepo from "../repositories/SlotRepository.ts";
import { Slot } from "../types/type.ts";

const connection = await pool.getConnection();

const findAllSlot = async () => {
    try {
        const slots = await SlotRepo.findAll(connection);
        return slots;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};

const findSlotById = async (id: number) => {
    try {
        const slot = await SlotRepo.findById(id, connection);
        return slot;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};

const updateSlot = async (slot: Slot) => {
    try {
        const result = await SlotRepo.update(slot, connection);
        return result;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};

export default {
    findAllSlot,
    findSlotById,
    updateSlot,
};
