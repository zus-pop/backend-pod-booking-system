import PaymentRepo from "../repositories/PaymentRepository.ts";
import { Payment } from "../types/type.ts";

const findAllPayment = async () => {
    try {
        const payments = await PaymentRepo.findAll();
        return payments;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const findPaymentById = async (id: number) => {
    try {
        const payment = await PaymentRepo.findById(id);
        return payment;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const createPayment = async (payment: Payment) => {
    try {
        const newPayment = await PaymentRepo.create(payment);
        return newPayment;
    } catch (err) {
        throw err;
    }
};

export default {
    findAllPayment,
    findPaymentById,
    createPayment,
};
