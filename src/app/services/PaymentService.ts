import { pool } from "../config/pool.ts";
import PaymentRepo from "../repositories/PaymentRepository.ts";
import { Payment } from "../types/type.ts";

const findAllPayment = async () => {
    const connection = await pool.getConnection();
    try {
        const payments = await PaymentRepo.findAll(connection);
        return payments;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const findPaymentById = async (id: number) => {
    const connection = await pool.getConnection();
    try {
        const payment = await PaymentRepo.findById(id, connection);
        return payment;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const findByTransactionId = async (transaction_id: number) => {
    const connection = await pool.getConnection();
    try {
        const payment = await PaymentRepo.findByTransactionId(
            transaction_id,
            connection
        );
        return payment;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};

const createPayment = async (payment: Payment) => {
    const connection = await pool.getConnection();
    try {
        const newPayment = await PaymentRepo.create(payment, connection);
        return newPayment;
    } catch (err) {
        throw err;
    } finally {
        connection.release();
    }
};

const updatePayment = async (payment: Payment) => {
    const connection = await pool.getConnection();
    try {
        const updatedPayment = await PaymentRepo.update(payment, connection);
        return updatedPayment;
    } catch (err) {
        throw err;
    } finally {
        connection.release();
    }
};

export default {
    findAllPayment,
    findPaymentById,
    findByTransactionId,
    createPayment,
    updatePayment,
};
