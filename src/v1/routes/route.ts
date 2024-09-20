import { Express } from "express";
import { PODRouter } from "./PODRoute.ts";
import { UserRouter } from "./UserRoute.ts";

export const router = (app: Express) => {
    app.use("/api/v1/auth", UserRouter);
    app.use("/api/v1/pods", PODRouter);
};
