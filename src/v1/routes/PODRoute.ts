import { Router } from 'express'
import PODController from '../../controllers/PODController.ts';

export const PODRouter = Router()

PODRouter.get("/", PODController.findAll);
PODRouter.get("/:id", PODController.findById);