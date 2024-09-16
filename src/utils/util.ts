import moment from "moment";
import { SlotOption } from "../types/type.ts";
import { pool } from "../database/db.ts";

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
        console.log(`From: ${slot.start_time} To: ${slot.end_time}`);
        const sql = "INSERT INTO ?? SET ?";
        const values = ["slot", slot];
        console.log(pool.format(sql, values));

        if (options.gap) {
            startDatetime.add(options.gap, "minutes");
        }

        if (startDatetime.hour() >= options.endHour) {
            startDatetime.add(1, "day").set({
                hour: options.startHour,
                minute: 0,
                second: 0,
            });
            console.log("=====================================");
        }
    }
};

await generateSlots({
    startDate: "2022-01-01",
    endDate: "2022-01-01",
    startHour: 7,
    endHour: 12,
    durationMinutes: 60,
    podId: 30,
    unitPrice: 329000,
});
