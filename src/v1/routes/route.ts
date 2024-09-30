import { Express } from "express";
import { PODRouter } from "./PODRoute.ts";
import { UserRouter } from "./UserRoute.ts";
import { SlotRouter } from "./SlotRoute.ts";
import { ProductRouter } from "./ProductRoute.ts";
import { CategoryRouter } from "./CategoryRoute.ts";
import { StoreRouter } from "./StoreRoute.ts";
import { PODTypeRouter } from "./PODTypeRoute.ts";
import { BookingRouter } from "./BookingRoute.ts";
import { BookingProductRouter } from "./BookingProductRoute.ts";
import { BookingSlotRouter } from "./BookingSlotRoute.ts";
import { PaymentRouter } from "./PaymentRoute.ts";
import { authenticateToken } from "../../middlewares/authenticateToken.ts";

export const router = (app: Express) => {
    app.use("/api/v1/auth", UserRouter);
    app.use("/api/v1/pods", PODRouter);
    app.use("/api/v1/slots", SlotRouter);
    app.use("/api/v1/products", ProductRouter);
    app.use("/api/v1/categories", CategoryRouter);
    app.use("/api/v1/stores", StoreRouter);
    app.use("/api/v1/pod-types", PODTypeRouter);
    app.use("/api/v1/bookings", BookingRouter);
    app.use("/api/v1/booking-products", BookingProductRouter);
    app.use("/api/v1/payments", PaymentRouter);
    app.use("/api/v1/booking-slots", BookingSlotRouter);

};
