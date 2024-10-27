import { Server } from "socket.io";

let ioInstance: Server;

export const initialize = (io: Server) => {
    ioInstance = io;

    ioInstance.on("connection", (socket) => {
        const user_id = socket.data.payload.user_id as number;
        const roomName = user_id.toString();
        // In order to support user in using multiple devices at the same time
        socket.join(user_id.toString());
        console.log(
            `User ${user_id} connected and join room: ${roomName} on socket ID: ${socket.id}`
        );

  
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
    const roomName = user_id.toString();
    console.log(`Sending notification to room: ${roomName}`);
    ioInstance.to(roomName).emit("notification", message);
};
