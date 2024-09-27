import PaymentController from "../../controllers/PaymentController.ts";
import { Router } from "express";

export const PaymentRouter = Router();

// GET: api/v1/payments
PaymentRouter.get("/", PaymentController.findAll);

// GET: api/v1/payments/:id
PaymentRouter.get("/:id", PaymentController.findById);
