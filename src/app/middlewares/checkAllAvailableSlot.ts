import { NextFunction, Request, Response } from "express";
import SlotService from "../services/SlotService.ts";
import { BookingSlot } from "../types/type.ts";

export const checkAllAvailableSlot = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { bookingSlots }: { bookingSlots: BookingSlot[] } = req.body;
    const result = await SlotService.checkAllAvailableSlot(
        bookingSlots.map((bookingSlot) => bookingSlot.slot_id!)
    );
    if (result?.status) {
        return next();
    }
    return res.status(400).json(result);
};
