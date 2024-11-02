import { Request, Response } from "express";
import BookingSlotService from "../services/BookingSlotService.ts";

const findAllSlot = async (_: Request, res: Response) => {
    const slots = await BookingSlotService.findAllSlot();
    if (!slots || !slots.length) {
        return res.status(404).json({ message: "Not found any slot!" });
    }
    return res.status(200).json(slots);
};

const findAllSlotByBookingId = async (req: Request, res: Response) => {
    const { id } = req.params;
    const slots = await BookingSlotService.findAllSlotByBookingId(+id);
    if (!slots || !slots.length) {
        return res.status(404).json({ message: "Not found any slot!" });
    }
    return res.status(200).json(slots);
};

const findAllSlotByBookingIdAndPaymentId = async (
    req: Request,
    res: Response
) => {
    const { booking_id, payment_id } = req.params;
    const slots = await BookingSlotService.findAllSlotByBookingIdAndPaymentId(
        +booking_id,
        +payment_id
    );
    if (!slots || !slots.length) {
        return res.status(404).json({ message: "Not found any slot!" });
    }
    return res.status(200).json(slots);
};

const updateCheckin = async (req: Request, res: Response) => {
    const { slot_id, booking_id } = req.params;
    const { is_checked_in } = req.body;
    const result = await BookingSlotService.updateCheckin(
        +slot_id,
        +booking_id,
        is_checked_in
    );
    if (!result?.affectedRows) {
        return res.status(404).json({ message: "Not found any slot!" });
    }
    return res.status(201).json({ message: "Update successfully!" });
};

export default {
    findAllSlot,
    findAllSlotByBookingId,
    findAllSlotByBookingIdAndPaymentId,
    updateCheckin,
};
