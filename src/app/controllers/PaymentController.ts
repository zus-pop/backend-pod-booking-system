import { Request, Response } from "express";
import PaymentService from "../services/PaymentService.ts";
import { PaymentStatus } from "../types/type.ts";
import { callbackPaymentProduct, callbackPaymentSlot } from "../utils/zalo.ts";

const find = async (req: Request, res: Response) => {
    const { payment_date, payment_status, page, limit } = req.query;
    const result = await PaymentService.find(
        {
            payment_date: payment_date as string,
            payment_status: payment_status as keyof typeof PaymentStatus,
        },
        {
            page: page ? +page : 1,
            limit: limit ? +limit : 10,
        }
    );
    if (!result || !result.payments || !result.payments.length) {
        return res.status(404).json({ message: "No payments found" });
    }
    res.status(200).json(result);
};

const findById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const payment = await PaymentService.findPaymentById(+id);
    if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
    }
    return res.status(200).json(payment);
};

const callbackSlot = async (req: Request, res: Response) => {
    const { data: dataStr, mac: reqMac } = req.body;
    const result = await callbackPaymentSlot(dataStr, reqMac);
    res.json(result);
};

const callbackProduct = async (req: Request, res: Response) => {
    const { data: dataStr, mac: reqMac } = req.body;
    const result = await callbackPaymentProduct(dataStr, reqMac);
    res.json(result);
};

const getDailyRevenue = async (req: Request, res: Response) => {
    try {
        const dailyRevenue = await PaymentService.getDailyRevenue();
        if (!dailyRevenue || !dailyRevenue.length) {
            return res.status(404).json({ message: "No revenue data found" });
        }
        return res.status(200).json(dailyRevenue);
    } catch (error) {
        console.error("Error fetching daily revenue:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getMonthlyRevenue = async (req: Request, res: Response) => {
    try {
        const monthlyRevenue = await PaymentService.getMonthlyRevenue();
        if (!monthlyRevenue || !monthlyRevenue.length) {
            return res.status(404).json({ message: "No revenue data found" });
        }
        return res.status(200).json(monthlyRevenue);
    } catch (error) {
        console.error("Error fetching monthly revenue:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getTotalRevenue = async (req: Request, res: Response) => {
    try {
        const totalRevenue = await PaymentService.getTotalRevenue();
        if (!totalRevenue) {
            return res.status(404).json({ message: "No revenue data found" });
        }
        return res.status(200).json(totalRevenue);
    } catch (error) {
        console.error("Error fetching total revenue:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const refund = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { bookingSlots } = req.body;
    const result = await PaymentService.refund(+id, bookingSlots);
    if (!result) {
        return res.status(404).json({ message: "Payment not found" });
    }
    return res.status(200).json(result);
};

export default {
    find,
    findById,
    callbackSlot,
    callbackProduct,
    getDailyRevenue,
    getMonthlyRevenue,
    getTotalRevenue,
    refund,
};
