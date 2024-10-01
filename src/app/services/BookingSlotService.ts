import BookingSlotRepo from "../repositories/BookingSlotRepository.ts";
import { pool } from "../config/pool.ts";

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
        const slots = await BookingSlotRepo.findAllSlotByBookingId(
            booking_id,
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

export default {
    findAllSlot,
    findAllSlotByBookingId,
};
