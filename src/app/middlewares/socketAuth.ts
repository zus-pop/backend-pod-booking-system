import { Socket } from "socket.io";
import UserService from "../services/UserService.ts";

export const socketAuth = (socket: Socket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth.token as string;
    if (!token) {
        return next(new Error("No token provided"));
    }

    try {
        const payload = UserService.verifyToken(token);
        socket.data.payload = payload;
        next();
    } catch (err: any) {
        return next(new Error(err.message));
    }
};
