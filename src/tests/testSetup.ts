import { pool } from "../app/config/pool";
import { Booking } from "../app/types/type";

export const setupTestDB = async () => {
    // Add any initial setup if needed
};

export const cleanupTestDB = async () => {
    await pool.end();
};

export const getTestData = {
    users: {
        validUser: {
            email: "jane@gmail.com",
            password: "jane123",
        },
        invalidUser: {
            email: "nonexistent@example.com",
            password: "invalid",
        },
    },
    pods: {
        validPod: {
            pod_name: "meeting",
        },
        // busyPod: {
        //     pod_id: 2,
        //     pod_name: "busy-pod",
        // },
    },
    slots: {
        invalidSlotIds: [1, 2, 3, 4, 5],
        validDate: "2024-10-01",
        validPodId: 3,
    },
    bookings: {
        booking_status: "Pending" as Booking["booking_status"],
    },
};
