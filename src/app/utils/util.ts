import moment from "moment";
import { BookingSlot } from "../types/type.ts";

// const conn = await pool.getConnection();
// const FORMAT_TYPE = "YYYY-MM-DD HH:mm:ss";

// const generateSlots = async (
//     connection: PoolConnection,
//     options: SlotOption
// ) => {
//     const startDatetime = moment(options.startDate).set({
//         hour: options.startHour,
//         minute: 0,
//         second: 0,
//     });

//     const endDatetime = moment(options.endDate).set({
//         hour: options.endHour,
//         minute: 0,
//         second: 0,
//     });

//     try {
//         while (startDatetime.isBefore(endDatetime)) {
//             const slot = {
//                 pod_id: options.podId,
//                 start_time: startDatetime.format(FORMAT_TYPE),
//                 end_time: startDatetime
//                     .add(options.durationMinutes, "minutes")
//                     .format(FORMAT_TYPE),
//                 unit_price: options.unitPrice,
//                 is_available: true,
//             };
//             const sql = "INSERT INTO ?? SET ?";
//             const values = ["Slot", slot];
//             console.log(connection.format(sql, values));
//             await connection.query<ResultSetHeader>(sql, values);

//             if (options.gap) {
//                 startDatetime.add(options.gap, "minutes");
//             }

//             if (startDatetime.hour() >= options.endHour) {
//                 startDatetime.add(1, "day").set({
//                     hour: options.startHour,
//                     minute: 0,
//                     second: 0,
//                 });
//             }
//         }
//     } catch (err) {
//         console.error("Error in generating slot: ", err);
//     } finally {
//         connection.release();
//     }
// };

export const getTotalCost = async (bookingSlots: BookingSlot[]) => {
    let totalCost = 0;
    totalCost = bookingSlots.reduce((acc, curr) => acc + curr.unit_price!, 0);
    return totalCost;
};

export const formatDate = (date: string | Date) => {
    return moment(date).format("YYYY-MM-DD");
};

export const formatTime = (date: string | Date) => {
    return moment(date).format("HH:mm:ss");
};

export const formatDateTime = (date: string | Date) => {
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
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
