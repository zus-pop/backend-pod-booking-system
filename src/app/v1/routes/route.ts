import { Express } from "express";
import { PODRouter } from "./PODRoute.ts";
import { UserRouter } from "./UserRoute.ts";
import { SlotRouter } from "./SlotRoute.ts";
import { ProductRouter } from "./ProductRoute.ts";
import { CategoryRouter } from "./CategoryRoute.ts";
import { StoreRouter } from "./StoreRoute.ts";
import { PODTypeRouter } from "./PODTypeRoute.ts";
import { BookingRouter } from "./BookingRoute.ts";
import { PaymentRouter } from "./PaymentRoute.ts";
import { StorePriceRouter } from "./StorePriceRoute.ts";
import { UtilityRouter } from "./UtilityRoute.ts";
import { RoleRouter } from "./RoleRoute.ts";

export const router = (app: Express) => {
    app.use("/api/v1/auth", UserRouter);
    app.use("/api/v1/roles", RoleRouter);
    app.use("/api/v1/pods", PODRouter);
    app.use("/api/v1/pod-types", PODTypeRouter);
    app.use("/api/v1/slots", SlotRouter);
    app.use("/api/v1/products", ProductRouter);
    app.use("/api/v1/categories", CategoryRouter);
    app.use("/api/v1/stores", StoreRouter);
    app.use("/api/v1/store-prices", StorePriceRouter);
    app.use("/api/v1/bookings", BookingRouter);
    app.use("/api/v1/payments", PaymentRouter);
    app.use("/api/v1/utilities", UtilityRouter);
};
