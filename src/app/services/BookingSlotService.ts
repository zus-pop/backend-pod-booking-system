import BookingSlotRepo from "../repositories/BookingSlotRepository.ts";
import { pool } from "../config/pool.ts";
import SlotRepository from "../repositories/SlotRepository.ts";

const findAllSlot = async () => {
    const connection = await pool.getConnection();
    try {
        const slots = await BookingSlotRepo.findAllSlot(connection);
        return slots;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const findAllSlotByBookingId = async (booking_id: number) => {
    const connection = await pool.getConnection();
    try {
        const bookingSlots = await BookingSlotRepo.findAllSlotByBookingId(
            booking_id,
            connection
        );
        return await Promise.all(
            bookingSlots.map(async (bookingSlot) => {
                const slot = await SlotRepository.findById(
                    bookingSlot.slot_id!,
                    connection
                );
                return {
                    slot_id: slot.slot_id,
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                    is_available: slot.is_available,
                    unit_price: slot.unit_price,
                    price: bookingSlot.price,
                };
            })
        );
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};

export default {
    findAllSlot,
    findAllSlotByBookingId,
};
