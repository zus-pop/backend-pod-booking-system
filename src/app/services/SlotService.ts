import { pool } from "../config/pool.ts";
import SlotRepo from "../repositories/SlotRepository.ts";
import { Slot } from "../types/type.ts";

const findAllSlot = async () => {
    const connection = await pool.getConnection();
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
    const connection = await pool.getConnection();
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

const findSlotByRangeOfId = async (slot_ids: number[]) => {
    const connection = await pool.getConnection();
    try {
        const slots = await SlotRepo.findByMultipleId(slot_ids, connection);
        return slots;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};

const updateSlot = async (slot: Slot) => {
    const connection = await pool.getConnection();
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

const updateMultipleSlot = async (
    is_available: boolean,
    slot_ids: number[]
) => {
    const connection = await pool.getConnection();
    try {
        const result = await SlotRepo.updateStatusMultipleSlot(
            is_available,
            slot_ids,
            connection
        );
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
    findSlotByRangeOfId,
    updateSlot,
    updateMultipleSlot,
};
