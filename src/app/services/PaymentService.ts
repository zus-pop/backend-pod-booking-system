import { pool } from "../config/pool.ts";
import PaymentRepo from "../repositories/PaymentRepository.ts";
import { Pagination, Payment, PaymentQueries } from "../types/type.ts";

const find = async (filters: PaymentQueries, pagination: Pagination) => {
    const connection = await pool.getConnection();
    try {
        const payments = await PaymentRepo.find(
            filters,
            connection,
            pagination
        );
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
        const updatedPayment = await PaymentRepo.updateByTransactionId(
            payment,
            connection
        );
        return updatedPayment;
    } catch (err) {
        throw err;
    } finally {
        connection.release();
    }
};

export default {
    find,
    findPaymentById,
    findByTransactionId,
    createPayment,
    updatePayment,
};
