import moment from "moment";
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

const findByPodId = async (pod_id: number) => {
    const connection = await pool.getConnection();
    try {
        const slots = await SlotRepo.findByPodId(pod_id, connection);
        return slots;
    } catch (err) {
        console.log(err);
        return null;
    }
};

const findAvailableSlotByDate = async (date: Date | string) => {
    const connection = await pool.getConnection();
    try {
        const slots = await SlotRepo.findAvailableSlotByDate(date, connection);
        return slots;
    } catch (err) {
        console.log(err);
        return null;
    }
};

const findAvailableSlotByDateAndPodId = async (
    pod_id: number,
    date: Date | string
) => {
    const connection = await pool.getConnection();
    try {
        const slots = await SlotRepo.findAvailableSlotByDateAndPodId(
            pod_id,
            date,
            connection
        );
        return slots;
    } catch (err) {
        console.log(err);
        return null;
    }
};

const checkAllAvailableSlot = async (slot_ids: number[]) => {
    const connection = await pool.getConnection();
    try {
        const slots = await SlotRepo.findByMultipleId(slot_ids, connection);
        const notAvailableSlots = slots.filter((slot) => !slot.is_available);
        if (notAvailableSlots.length === 0) {
            return {
                status: true,
                message: "All slots are available",
            };
        }
        return {
            status: false,
            message: notAvailableSlots
                .map(
                    (notAvailableSlot) =>
                        `Slot from ( ${moment
                            .utc(notAvailableSlot.start_time)
                            .format("YYYY-MM-DD HH:mm:ss")} ) to ( ${moment
                            .utc(notAvailableSlot.end_time)
                            .format("YYYY-MM-DD HH:mm:ss")} ) is taken by other customer`
                )
                .join("\r\n"),
        };
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
    // findByPodId,
    // findAvailableSlotByDate,
    findAvailableSlotByDateAndPodId,
    checkAllAvailableSlot,
    updateSlot,
    updateMultipleSlot,
};
