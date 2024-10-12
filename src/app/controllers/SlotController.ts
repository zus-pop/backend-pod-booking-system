import SlotService from "../services/SlotService.ts";
import { Request, Response } from "express";

const findAll = async (_: Request, res: Response) => {
    const slots = await SlotService.findAllSlot();
    if (!slots || !slots.length) {
        return res.status(404).json({ message: "No slots found" });
    }
    return res.status(200).json(slots);
};

const findById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const slot = await SlotService.findSlotById(+id);
    if (!slot) {
        return res.status(404).json({ message: "Slot not found" });
    }
    return res.status(200).json(slot);
};

const generateSlots = async (req: Request, res: Response) => {
    const {
        startDate,
        endDate,
        startHour,
        endHour,
        durationMinutes,
        pod_id,
        unit_price,
    } = req.body;
    const slots = await SlotService.generateSlots({
        startDate,
        endDate,
        startHour,
        endHour,
        durationMinutes,
        podId: pod_id,
        unitPrice: unit_price,
    });
    if (!slots || !slots.length) {
        return res.status(404).json({ message: "No slots generated" });
    }
    return res.status(200).json(slots);
};

export default {
    findAll,
    findById,
    generateSlots,
};
