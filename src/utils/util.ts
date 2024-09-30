import moment from "moment";
import "dotenv/config";
import { pool } from "../config/pool.ts";
import {
    BookingProduct,
    BookingSlot,
    Payment,
    Slot,
    SlotOption,
} from "../types/type.ts";
import { ResultSetHeader } from "mysql2/promise";
import { PoolConnection } from "mysql2/promise";
import cron from "node-cron";

// const conn = await pool.getConnection();
const formatType = "YYYY-MM-DD HH:mm:ss";

export const generateSlots = async (
    connection: PoolConnection,
    options: SlotOption
) => {
    const startDatetime = moment(options.startDate).set({
        hour: options.startHour,
        minute: 0,
        second: 0,
    });

    const endDatetime = moment(options.endDate).set({
        hour: options.endHour,
        minute: 0,
        second: 0,
    });

    try {
        while (startDatetime.isBefore(endDatetime)) {
            const slot = {
                pod_id: options.podId,
                start_time: startDatetime.format(formatType),
                end_time: startDatetime
                    .add(options.durationMinutes, "minutes")
                    .format(formatType),
                unit_price: options.unitPrice,
                is_available: true,
            };
            const sql = "INSERT INTO ?? SET ?";
            const values = ["Slot", slot];
            console.log(connection.format(sql, values));
            await connection.query<ResultSetHeader>(sql, values);

            if (options.gap) {
                startDatetime.add(options.gap, "minutes");
            }

            if (startDatetime.hour() >= options.endHour) {
                startDatetime.add(1, "day").set({
                    hour: options.startHour,
                    minute: 0,
                    second: 0,
                });
            }
        }
    } catch (err) {
        console.error("Error in generating slot: ", err);
    } finally {
        connection.release();
    }
};

export const getTotalCost = async (bookingSlots: BookingSlot[]) => {
    let totalCost = 0;
    totalCost = bookingSlots.reduce((acc, curr) => acc + curr.price!, 0);
    return totalCost;
};

// await generateSlots(conn, {
//     startDate: "2024-09-22",
//     endDate: "2024-09-22",
//     startHour: 7,
//     endHour: 22,
//     durationMinutes: 60,
//     podId: 1,
//     unitPrice: 85000,
// });

export const bookingTracker = (
    booking_id: number,
    connection: PoolConnection
) => {
    cron.schedule("* * * * * *", async () => {});
    const threshHold = 5;
    const current = moment().format(formatType);

    const create_at = "2024-09-28 14:30:00";
    console.log(moment(current).diff(moment(create_at), "minutes"));
};
