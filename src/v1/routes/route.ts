import { Express } from "express";
import { PODRouter } from "./PODRoute.ts";
import { UserRouter } from "./UserRoute.ts";
import { SlotRouter } from "./SlotRoute.ts";
import { ProductRouter } from "./ProductRoute.ts";
import { CategoryRouter } from "./CategoryRoute.ts";

export const router = (app: Express) => {
  app.use("/api/v1/auth", UserRouter);
  app.use("/api/v1/pods", PODRouter);
    app.use("/api/v1/slots", SlotRouter);
  app.use("/api/v1/products", ProductRouter);
  app.use("/api/v1/categories", CategoryRouter);
};
