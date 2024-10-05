import BookingSlotService from "../services/BookingSlotService.ts";
import { Request, Response } from "express";

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

export default {
    findAllSlot,
    findAllSlotByBookingId,
};
