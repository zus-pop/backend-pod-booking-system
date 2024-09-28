import { pool } from "../config/pool.ts";
import PaymentRepo from "../repositories/PaymentRepository.ts";
import { Payment } from "../types/type.ts";

const connection = await pool.getConnection();

const findAllPayment = async () => {
    try {
        const payments = await PaymentRepo.findAll(connection);
        return payments;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const findPaymentById = async (id: number) => {
    try {
        const payment = await PaymentRepo.findById(id, connection);
        return payment;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const createPayment = async (payment: Payment) => {
    try {
        const newPayment = await PaymentRepo.create(payment, connection);
        return newPayment;
    } catch (err) {
        throw err;
    }
};

const updatePayment = async (payment: Payment) => {
    try {
        const updatedPayment = await PaymentRepo.update(payment, connection);
        return updatedPayment;
    } catch (err) {
        throw err;
    }
};

export default {
    findAllPayment,
    findPaymentById,
    createPayment,
    updatePayment,
};
