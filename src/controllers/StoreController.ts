import { Request, Response } from "express";
import StoreService from "../services/StoreService.ts";

const findAll = async (_: Request, res: Response) => {
    const stores = await StoreService.findAllStore();
    if (!stores || !stores.length) {
        return res.status(404).json({ message: "No stores found" });
    }
    return res.status(200).json(stores);
};

const findById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const store = await StoreService.findStoreById(+id);
    if (!store) {
        return res.status(404).json({ message: "Store not found" });
    }
    return res.status(200).json(store);
};

export default {
    findAll,
    findById,
};
