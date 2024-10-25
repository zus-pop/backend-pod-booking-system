import moment from "moment";
import { pool } from "../config/pool.ts";
import SlotRepo from "../repositories/SlotRepository.ts";
import { Slot, SlotOption, SlotQueries } from "../types/type.ts";
import SlotRepository from "../repositories/SlotRepository.ts";

const FORMAT_TYPE = "YYYY-MM-DD HH:mm:ss";

const find = async (filters: SlotQueries) => {
    const connection = await pool.getConnection();
    try {
        const slots = await SlotRepo.find(filters, connection);
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
                        `Slot from ( ${moment(
                            notAvailableSlot.start_time
                        ).format("YYYY-MM-DD HH:mm:ss")} ) to ( ${moment(
                            notAvailableSlot.end_time
                        ).format(
                            "YYYY-MM-DD HH:mm:ss"
                        )} ) is taken by other customer`
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

const generateSlots = async (options: SlotOption) => {
    const connection = await pool.getConnection();
    const startDatetime = moment(options.startDate).set({
        hour: options.startHour,
        minute: 0,
        second: 0,
    });

    const endDatetime = moment(options.endDate).set({
        hour: options.endHour,
        minute: 0,
        second: 0,
    });
    let slots: number[] = [];
    try {
        await connection.beginTransaction();
        while (startDatetime.isBefore(endDatetime)) {
            const slot = {
                pod_id: options.podId,
                start_time: startDatetime.format(FORMAT_TYPE),
                end_time: startDatetime
                    .add(options.durationMinutes, "minutes")
                    .format(FORMAT_TYPE),
                price: options.price,
                is_available: true,
            };

            const overlappingSlots = await SlotRepo.checkOverlappingSlots(
                slot.pod_id,
                slot.start_time,
                slot.end_time,
                connection
            );

            if (overlappingSlots.length) {
                const overlappingSlot = overlappingSlots[0];
                let overlapType: string;
                if (
                    moment(slot.start_time).isSameOrBefore(
                        overlappingSlot.start_time
                    ) &&
                    moment(slot.end_time).isSameOrAfter(
                        overlappingSlot.end_time
                    )
                ) {
                    overlapType = `New slot completely encompasses the existing slot`;
                } else if (
                    moment(overlappingSlot.start_time).isSameOrBefore(
                        slot.start_time
                    ) &&
                    moment(overlappingSlot.end_time).isSameOrAfter(
                        slot.end_time
                    )
                ) {
                    overlapType = `Existing slot completely encompasses the new slot`;
                } else if (
                    moment(slot.start_time).isBetween(
                        overlappingSlot.start_time,
                        overlappingSlot.end_time,
                        null,
                        "[)"
                    )
                ) {
                    overlapType = `New slot starts inside the existing slot`;
                } else {
                    overlapType = `New slot ends inside the existing slot`;
                }

                const message =
                    `Overlap detected:<br>` +
                    `Conflicts with an existing slot (ID: ${overlappingSlot.slot_id}) from ${overlappingSlot.start_time} to ${overlappingSlot.end_time}.<br>` +
                    `New slot details: from ${slot.start_time} to ${slot.end_time}.<br>` +
                    `Overlap type: ${overlapType}. Please choose another time range.<br>`;
                throw new Error(message);
            }

            const result = await SlotRepo.create(slot, connection);
            slots.push(result.insertId);

            if (options.gap) {
                startDatetime.add(options.gap, "minutes");
            }

            if (startDatetime.hour() >= options.endHour) {
                startDatetime.add(1, "day").set({
                    hour: options.startHour,
                    minute: 0,
                    second: 0,
                });
            }
        }
        await connection.commit();
    } catch (err) {
        await connection.rollback();
        console.log(err);
        throw err;
    } finally {
        connection.release();
    }
    return slots;
};

const update = async (slot: Slot, id: number) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const result = await SlotRepo.update(slot, id, connection);
        await connection.commit();
        return result;
    } catch (err) {
        await connection.rollback();
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
        await connection.beginTransaction();
        const result = await SlotRepo.updateStatusMultipleSlot(
            is_available,
            slot_ids,
            connection
        );
        await connection.commit();
        return result;
    } catch (err) {
        await connection.rollback();
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};

const remove = async (id: number) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const result = await SlotRepository.remove(id, connection);
        await connection.commit();
        return result.affectedRows;
    } catch (err) {
        await connection.rollback();
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};

export default {
    find,
    findSlotById,
    findSlotByRangeOfId,
    generateSlots,
    checkAllAvailableSlot,
    update,
    updateMultipleSlot,
    remove,
};
