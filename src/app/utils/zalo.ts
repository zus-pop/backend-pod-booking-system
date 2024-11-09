import crypto from "crypto";
import moment from "moment";
import qs from "qs";
import { pool } from "../config/pool.ts";
import BookingProductRepository from "../repositories/BookingProductRepository.ts";
import BookingRepo from "../repositories/BookingRepository.ts";
import PaymentRepo from "../repositories/PaymentRepository.ts";
import ProductRepository from "../repositories/ProductRepository.ts";
import NotificationService from "../services/NotificationService.ts";
import {
    BookingProduct,
    BookingSlot,
    OnlinePaymentResponse,
    Payment,
} from "../types/type.ts";

const config = {
    APP_ID: process.env.APP_ID as string,
    KEY1: process.env.KEY1 as string,
    KEY2: process.env.KEY2 as string,
    CREATE_PAYMENT: `${process.env.ZALO_BASE_URL}/create` as string,
    QUERY_STATUS: `${process.env.ZALO_BASE_URL}/query` as string,
    REFUND_URL: `${process.env.ZALO_BASE_URL}/refund` as string,
    QUERY_REFUND_URL: `${process.env.ZALO_BASE_URL}/query_refund` as string,
};

interface PaymentOptions {
    item: BookingProduct[] | BookingSlot[];
    amount: number;
    user_id: number;
    callback_url: string;
    redirect_url: string;
    expire_duration_seconds: number;
}

export const createOnlinePaymentRequest = async (options: PaymentOptions) => {
    const embed_data = {
        redirecturl: options.redirect_url,
    };
    const items = options.item;
    const transID = Math.floor(Math.random() * 1000000);
    const order: Record<string, any> = {
        app_id: config.APP_ID,
        app_trans_id: `${moment().utcOffset(+7).format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
        app_user: `user_id: ${options.user_id}`,
        app_time: Date.now(), // miliseconds
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: options.amount,
        expire_duration_seconds: options.expire_duration_seconds,
        callback_url: `${process.env.ZALO_CALLBACK_URL}/${options.callback_url}`,
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

export const callbackPaymentSlot = async (dataStr: any, reqMac: any) => {
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
                    zp_trans_id: dataJson["zp_trans_id"],
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

export const callbackPaymentProduct = async (dataStr: any, reqMac: any) => {
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
            const bookingProducts = JSON.parse(
                dataJson.item
            ) as BookingProduct[];

            await connection.beginTransaction();
            const paymentResult = await PaymentRepo.create(
                {
                    transaction_id: dataJson["app_trans_id"],
                    booking_id: bookingProducts[0].booking_id,
                    total_cost: dataJson.amount,
                    payment_date: moment()
                        .utcOffset(+7)
                        .format("YYYY-MM-DD HH:mm:ss"),
                    payment_status: "Paid",
                    payment_for: "Product",
                    zp_trans_id: dataJson["zp_trans_id"],
                },
                connection
            );

            const productResult = await BookingProductRepository.create(
                bookingProducts.map((bookingProduct) => ({
                    ...bookingProduct,
                    payment_id: paymentResult.insertId,
                })),
                connection
            );

            if (productResult.affectedRows) {
                for (const bookingProduct of bookingProducts) {
                    const product = await ProductRepository.findById(
                        bookingProduct.product_id!,
                        connection
                    );
                    const newStock = product.stock! - bookingProduct.quantity!;
                    await ProductRepository.updateProduct(
                        {
                            product_id: product.product_id,
                            stock: newStock,
                        },
                        connection
                    );
                }
            }

            const notiResult = await NotificationService.createNewMessage({
                user_id: +dataJson.app_user.split(" ")[1],
                message:
                    "The customer's product order has been paid successfully",
                created_at: moment()
                    .utcOffset(+7)
                    .format("YYYY-MM-DD HH:mm:ss"),
            });
            console.log(`Noti has been send: ${notiResult}`);
            await connection.commit();
            result.return_code = 1;
            result.return_message = "success";
        }
    } catch (ex: any) {
        console.log(ex);
        await connection.rollback();
        result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
        result.return_message = ex.message;
    } finally {
        connection.release();
        // thông báo kết quả cho ZaloPay server
        return result;
    }
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

export const refundBooking = async (
    payment: Payment,
    refund_amount?: number
) => {
    const timestamp = Date.now();
    const uid = `${timestamp}${Math.floor(111 + Math.random() * 999)}`; // unique id

    let params: Record<string, any> = {
        app_id: config.APP_ID,
        m_refund_id: `${moment().utcOffset(+7).format("YYMMDD")}_${config.APP_ID}_${uid}`,
        timestamp, // miliseconds
        zp_trans_id: payment.zp_trans_id,
        amount: refund_amount || payment.total_cost,
        description: "Poddy Refund Demo",
    };
    // app_id|zp_trans_id|amount|description|timestamp
    let data = `${params.app_id}|${params.zp_trans_id}|${params.amount}|${params.description}|${params.timestamp}`;
    params.mac = crypto
        .createHmac("sha256", config.KEY1)
        .update(data)
        .digest("hex");
    console.log(params);
    console.log(new URLSearchParams(params).toString());
    try {
        const response = await fetch(config.REFUND_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(params).toString(),
        });
        const result = await response.json();
        return {
            ...result,
            m_refund_id: params.m_refund_id,
        } as {
            return_code: 1 | 2 | 3;
            return_message: string;
            sub_return_code: number;
            sub_return_message: string;
            refund_id: string;
            m_refund_id: string;
        };
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const refundStatus = async (m_refund_id: string) => {
    const timestamp = Date.now();
    let params: Record<string, any> = {
        app_id: config.APP_ID,
        timestamp,
        m_refund_id,
    };
    let data = `${params.app_id}|${params.m_refund_id}|${params.timestamp}`;
    params.mac = crypto
        .createHmac("sha256", config.KEY1)
        .update(data)
        .digest("hex");

    try {
        const response = await fetch(config.QUERY_REFUND_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(params).toString(),
        });
        const data = await response.json();
        return data as {
            return_code: 1 | 2 | 3 | -3 | -10 | -13 | -24 | -25 | -26;
            return_message: string;
            sub_return_code: number;
            sub_return_message: string;
        };
    } catch (err) {
        console.log(err);
        return null;
    }
};
