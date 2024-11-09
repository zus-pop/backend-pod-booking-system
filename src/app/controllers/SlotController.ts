import { Request, Response } from "express";
import SlotService from "../services/SlotService.ts";
import { Slot } from "../types/type.ts";

const find = async (req: Request, res: Response) => {
    const { pod_id, date, start_time, end_time, is_available } = req.query;

    const slots = await SlotService.find({
        pod_id: pod_id ? +pod_id : undefined,
        date: date as string,
        start_time: start_time as string,
        end_time: end_time as string,
        is_available: is_available ? is_available === "true" : undefined,
    });
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
        price,
        gap,
    } = req.body;
    try {
        const slots = await SlotService.generateSlots({
            startDate,
            endDate,
            startHour,
            endHour,
            durationMinutes,
            podId: pod_id,
            price: price,
            gap,
        });
        res.status(201).json({
            message: `${slots.length} slots are added successfully!`,
        });
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

const updateSlot = async (req: Request, res: Response) => {
    const { id } = req.params;
    const slot: Slot = req.body;
    const result = await SlotService.update(slot, +id);
    if (!result) {
        return res.status(400).json({ message: "Failed to update slot" });
    }
    return res.status(200).json({ message: "Slot updated successfully" });
};

const removeSlot = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SlotService.remove(+id);
    if (!result) {
        return res.status(400).json({ message: "Delete failed" });
    }
    return res.status(201).json({ message: "Delete successfully" });
};

const getDailyRevenueBySlot = async (req: Request, res: Response) => {
    try {
        const dailyRevenue = await SlotService.getDailyRevenueBySlot();
        if (!dailyRevenue || !dailyRevenue.length) {
            return res.status(404).json({ message: "No revenue data found" });
        }
        return res.status(200).json(dailyRevenue);
    } catch (error) {
        console.error("Error fetching daily revenue by slot:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getMonthlyRevenueBySlot = async (req: Request, res: Response) => {
    try {
        const monthlyRevenue = await SlotService.getMonthlyRevenueBySlot();
        if (!monthlyRevenue || !monthlyRevenue.length) {
            return res.status(404).json({ message: "No revenue data found" });
        }
        return res.status(200).json(monthlyRevenue);
    } catch (error) {
        console.error("Error fetching monthly revenue by slot:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getTotalSlotRevenue = async (req: Request, res: Response) => {
    try {
        const totalSlotRevenue = await SlotService.getTotalSlotRevenue();
        if (!totalSlotRevenue) {
            return res.status(404).json({ message: "No revenue data found" });
        }
        return res.status(200).json(totalSlotRevenue);
    } catch (error) {
        console.error("Error fetching total slot revenue:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getTotalSlotsRefunded = async (req: Request, res: Response) => {
    try {
        const totalSlotsRefunded = await SlotService.getTotalSlotsRefunded();
        if (!totalSlotsRefunded) {
            return res.status(404).json({ message: "No refunded slots found" });
        }
        return res.status(200).json(totalSlotsRefunded);
    } catch (error) {
        console.error("Error fetching total refunded slots:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getTotalRefundedAmount = async (req: Request, res: Response) => {
    try {
        const totalRefunded = await SlotService.getTotalRefundedAmount();
        if (!totalRefunded) {
            return res
                .status(404)
                .json({ message: "No refunded amount found" });
        }
        return res.status(200).json(totalRefunded);
    } catch (error) {
        console.error("Error fetching total refunded amount:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getDailyRefundedAmountBySlot = async (req: Request, res: Response) => {
    try {
        const dailyRefundedAmount =
            await SlotService.getDailyRefundedAmountBySlot();
        if (!dailyRefundedAmount) {
            return res
                .status(404)
                .json({ message: "No refunded amount found" });
        }
        return res.status(200).json(dailyRefundedAmount);
    } catch (error) {
        console.error("Error fetching daily refunded amount:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default {
    find,
    findById,
    generateSlots,
    updateSlot,
    removeSlot,
    getDailyRevenueBySlot,
    getMonthlyRevenueBySlot,
    getTotalSlotRevenue,
    getTotalSlotsRefunded,
    getTotalRefundedAmount,
    getDailyRefundedAmountBySlot,
};
