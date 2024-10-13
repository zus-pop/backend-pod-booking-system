import moment from "moment";
import { pool } from "../config/pool.ts";
import SlotRepo from "../repositories/SlotRepository.ts";
import { Slot, SlotOption } from "../types/type.ts";
import { ResultSetHeader } from "mysql2/promise";

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

const findSlotByDateAndPodId = async (
    pod_id: number,
    date: Date | string
) => {
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
                unit_price: options.unitPrice,
                is_available: true,
            };
            const sql = "INSERT INTO ?? SET ?";
            const values = ["Slot", slot];
            console.log(connection.format(sql, values));
            const [result] = await connection.query<ResultSetHeader>(
                sql,
                values
            );
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
        console.error("Error in generating slot: ", err);
        await connection.rollback();
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
