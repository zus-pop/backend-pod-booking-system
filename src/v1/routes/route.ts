import { Express } from "express";
import { PODRouter } from "./PODRoute.ts";

export const router = (app: Express) => {
    app.use('/api/v1/pods', PODRouter)
};
