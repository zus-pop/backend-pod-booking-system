import moment from "moment";
import { BookingProduct, OnlinePaymentResponse } from "../types/type.ts";
import crypto from "crypto";
import PaymentService from "../services/PaymentService.ts";
import BookingService from "../services/BookingService.ts";
import qs from "qs";
import { pool } from "../config/pool.ts";
import PaymentRepo from "../repositories/PaymentRepository.ts";
import BookingRepo from "../repositories/BookingRepository.ts";

const config = {
    APP_ID: process.env.APP_ID as string,
    KEY1: process.env.KEY1 as string,
    KEY2: process.env.KEY2 as string,
    CREATE_PAYMENT: process.env.CREATE_PAYMENT as string,
    QUERY_STATUS: process.env.QUERY_STATUS as string,
};

export const createOnlinePaymentRequest = async (
    bookingProducts: BookingProduct[],
    amount: number
) => {
    const embed_data = {
        redirecturl: "https://google.com",
    };
    const items = bookingProducts;
    const transID = Math.floor(Math.random() * 1000000);
    const order: Record<string, any> = {
        app_id: config.APP_ID,
        app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
        app_user: "user123",
        app_time: Date.now(), // miliseconds
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount,
        expire_duration_seconds: 300,
        callback_url:
            "https://dbac-116-110-41-26.ngrok-free.app/api/v1/payments/callback",
        description: `POD Booking - Payment for the order #${transID}`,
        bank_code: "",
    };
    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data = `${config.APP_ID}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = crypto
        .createHmac("sha256", config.KEY1)
        .update(data)
        .digest("hex");

    try {
        const params = new URLSearchParams(order);
        const response = await fetch(`${config.CREATE_PAYMENT}?${params}`, {
            method: "POST",
        });
        const result = await response.json();
        return {
            ...result,
            app_trans_id: order.app_trans_id,
        } as OnlinePaymentResponse;
    } catch (err) {
        throw err;
    }
};

export const callbackPayment = async (dataStr: any, reqMac: any) => {
    const result: Record<string, any> = {};
    const connection = await pool.getConnection();
    try {
        let mac = crypto
            .createHmac("sha256", config.KEY2)
            .update(dataStr)
            .digest("hex");
        console.log("mac =", mac);
        // kiểm tra callback hợp lệ (đến từ ZaloPay server)
        if (reqMac !== mac) {
            // callback không hợp lệ
            result.return_code = -1;
            result.return_message = "mac not equal";
        } else {
            // thanh toán thành công
            // merchant cập nhật trạng thái cho đơn hàng
            let dataJson = JSON.parse(dataStr);
            console.log(dataJson);
            console.log(
                "update order's status = success where app_trans_id =",
                dataJson["app_trans_id"]
            );
            PaymentRepo.updateByTransactionId(
                {
                    transaction_id: dataJson["app_trans_id"],
                    payment_status: "Paid",
                },
                connection
            );
            const payment = await PaymentRepo.findByTransactionId(
                dataJson["app_trans_id"],
                connection
            );
            await BookingRepo.update(
                {
                    booking_id: payment?.booking_id,
                    booking_status: "Confirmed",
                },
                connection
            );

            result.return_code = 1;
            result.return_message = "success";
        }
    } catch (ex: any) {
        result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
        result.return_message = ex.message;
    } finally {
        connection.release();
    }
    // thông báo kết quả cho ZaloPay server
    return result;
};

export const getPaymentStatus = async (app_trans_id: string) => {
    const postData: Record<string, any> = {
        app_id: config.APP_ID,
        app_trans_id, // Input your app_trans_id
    };
    let data = `${postData.app_id}|${postData.app_trans_id}|${config.KEY1}`; // appid|app_trans_id|key1

    postData.mac = crypto
        .createHmac("sha256", config.KEY1)
        .update(data)
        .digest("hex");

    const response = await fetch(config.QUERY_STATUS, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify(postData),
    });
    const query = await response.json();
    return query as {
        return_code: 1 | 2 | 3;
        return_message: string;
        sub_return_code: number;
        is_processing: boolean;
        amount: number;
        discount_amount: number;
        zp_trans_id: number;
    };
};
