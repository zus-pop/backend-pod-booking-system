import moment from "moment";
import { pool } from "../config/pool.ts";
import SlotRepo from "../repositories/SlotRepository.ts";
import { Slot, SlotOption } from "../types/type.ts";
import { ResultSetHeader } from "mysql2/promise";
import { formatDate, formatDateTime } from "../utils/util.ts";

const FORMAT_TYPE = "YYYY-MM-DD HH:mm:ss";

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
    } finally {
        connection.release();
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
    } finally {
        connection.release();
    }
};

const findSlotByDateAndPodId = async (pod_id: number, date: Date | string) => {
    const connection = await pool.getConnection();
    try {
        const slots = await SlotRepo.findSlotByDateAndPodId(
            pod_id,
            date,
            connection
        );
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
                        `Slot from ( ${moment
                            .utc(notAvailableSlot.start_time)
                            .format("YYYY-MM-DD HH:mm:ss")} ) to ( ${moment
                            .utc(notAvailableSlot.end_time)
                            .format(
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

                const message = `Found overlapping slot with id: ${
                    overlappingSlot.slot_id
                }: (${formatDateTime(
                    overlappingSlot.start_time!
                )} -> ${formatDateTime(
                    overlappingSlot.end_time!
                )}) that overlapped with new slot (${formatDateTime(
                    slot.start_time
                )} - ${formatDateTime(
                    slot.end_time
                )}). Overlap type: ${overlapType}`;
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
        throw err;
    } finally {
        connection.release();
    }
    return slots;
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
    findSlotByDateAndPodId,
    generateSlots,
    checkAllAvailableSlot,
    updateSlot,
    updateMultipleSlot,
};
