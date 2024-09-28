import PaymentService from "../services/PaymentService.ts";
import { Request, Response } from "express";
import { callbackPayment } from "../utils/zalo.ts";

const findAll = async (req: Request, res: Response) => {
    const payments = await PaymentService.findAllPayment();
    if (!payments || !payments.length) {
        return res.status(404).json({ message: "No payments found" });
    }
    res.status(200).json(payments);
};

const findById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const payment = await PaymentService.findPaymentById(+id);
    if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
    }
    return res.status(200).json(payment);
};

const callback = async (req: Request, res: Response) => {
    const { data: dataStr, mac: reqMac } = req.body;
    const result = await callbackPayment(dataStr, reqMac);
    res.json(result);
};

export default {
    findAll,
    findById,
    callback,
};
