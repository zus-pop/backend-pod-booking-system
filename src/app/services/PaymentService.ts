import moment from "moment";
import { pool } from "../config/pool.ts";
import PaymentRepo from "../repositories/PaymentRepository.ts";
import { Pagination, Payment, PaymentQueries } from "../types/type.ts";
import { refundBooking, refundStatus } from "../utils/zalo.ts";
import NotificationService from "./NotificationService.ts";
import { ResultSetHeader } from "mysql2";
import { trackRefund } from "../utils/cron-job.ts";

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

const getDailyRevenue = async () => {
    const connection = await pool.getConnection();
    try {
        const dailyRevenue = await PaymentRepo.getDailyRevenue(connection);
        return dailyRevenue;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const getMonthlyRevenue = async () => {
    const connection = await pool.getConnection();
    try {
        const monthlyRevenue = await PaymentRepo.getMonthlyRevenue(connection);
        return monthlyRevenue;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const getTotalRevenue = async () => {
    const connection = await pool.getConnection();
    try {
        const totalRevenue = await PaymentRepo.getTotalRevenue(connection);
        return totalRevenue;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const refund = async (
    payment_id: number,
    user_id: number,
    refund_amount?: number
) => {
    const connection = await pool.getConnection();
    try {
        const payment = await PaymentRepo.findById(payment_id, connection);
        if (!payment) {
            return null;
        }
        if (payment.payment_status !== "Paid") {
            return null;
        }

        const refundRes = await refundBooking(payment, refund_amount);
        trackRefund(payment_id, refundRes?.m_refund_id!, user_id, connection);
        // const refundStat = await refundStatus(refundRes?.m_refund_id!);
        // let message: string;
        // if (refundStat?.return_code === 1) {
        //     await PaymentRepo.updateById(
        //         {
        //             payment_id,
        //             payment_status: "Refunded",
        //             refunded_date: moment()
        //                 .utcOffset(+7)
        //                 .format("YYYY-MM-DD HH:mm:ss"),
        //         },
        //         connection
        //     );
        //     message = `Your payment with ID: ${payment_id} has been refunded successfully!`;
        //     NotificationService.createNewMessage({
        //         user_id: user_id,
        //         message,
        //         created_at: moment()
        //             .utcOffset(+7)
        //             .format("YYYY-MM-DD HH:mm:ss"),
        //     });
        // } else if (refundStat?.return_code === 2) {
        //     message = `Your payment with ID: ${payment_id} has been failed to refund!`;
        //     NotificationService.createNewMessage({
        //         user_id: user_id,
        //         message,
        //         created_at: moment()
        //             .utcOffset(+7)
        //             .format("YYYY-MM-DD HH:mm:ss"),
        //     });
        // } else {
        //   message = `Your payment with ID: ${payment_id} has is pending to refund!`;
        // }
        // return { message };
        return refundRes;
    } catch (err) {
        console.error(err);
        return null;
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
    getDailyRevenue,
    getMonthlyRevenue,
    getTotalRevenue,
    refund,
};
