import { pool } from "../config/pool.ts";
import BookingSlotRepo from "../repositories/BookingSlotRepository.ts";

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
        return bookingSlots;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};


const updateCheckin = async (
    id: number,
    booking_id: number,
    is_checked_in: boolean
) => {
    const connection = await pool.getConnection();
    try {
        const result = await BookingSlotRepo.updateCheckin(
            id,
            booking_id,
            is_checked_in,
            connection
        );
        return result;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

export default {
    findAllSlot,
    findAllSlotByBookingId,
    updateCheckin,
};
