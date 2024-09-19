import "dotenv/config";
import moment from "moment";
import { SlotOption } from "../types/type.ts";
import { pool } from "../database/db.ts";
import { ResultSetHeader } from "mysql2";

const connection = await pool.getConnection();
export const generateSlots = async (options: SlotOption) => {
    const formatType = "YYYY-MM-DD HH:mm:ss";
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

await generateSlots({
    startDate: "2024-09-22",
    endDate: "2024-09-22",
    startHour: 7,
    endHour: 22,
    durationMinutes: 60,
    podId: 1,
    unitPrice: 85000,
});
