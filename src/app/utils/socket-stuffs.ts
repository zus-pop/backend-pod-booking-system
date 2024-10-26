import { Socket } from "dgram";
import { Server } from "socket.io";

let ioInstance: Server;

export const initialize = (io: Server) => {
    ioInstance = io;

    io.on("connection", (socket) => {
        const user_id = socket.data.payload.user_id;

        // Add specific socket to the user_id room
        // In order to support user in using multiple devices at the same time
        socket.join(user_id);
        console.log(`User ${user_id} connected on socket ID: ${socket.id}`);

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log(
                `User ${user_id} disconnected on socket ID: ${socket.id}`
            );
        });
    });
};

export const sendNotification = (user_id: number, message: string) => {
    // Send notification to the user
    ioInstance.to(user_id.toString()).emit("notification", message);
};
