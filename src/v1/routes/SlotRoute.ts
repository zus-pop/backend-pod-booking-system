import SlotController from "../../controllers/SlotController.ts";
import { Router } from "express";

export const SlotRouter = Router();

// GET: api/v1/slots
SlotRouter.get("/", SlotController.findAll);

// GET: api/v1/slots/:id
SlotRouter.get("/:id", SlotController.findById);
