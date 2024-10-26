import moment from "moment";
import { BookingSlot } from "../types/type.ts";

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
