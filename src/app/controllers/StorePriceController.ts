import { Request, Response } from "express";
import StorePriceService from "../services/StorePriceService.ts";
import { StorePrice } from "../types/type.ts";

const find = async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const result = await StorePriceService.find(
        {},
        {
            page: page ? +page : 1,
            limit: limit ? +limit : 10,
        }
    );
    if (!result || !result.storePrices || !result.storePrices.length) {
        return res.status(404).json({ message: "No store prices found" });
    }
    return res.status(200).json(result);
};

const findByStoreIdAndTypeId = async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const { store_id, type_id } = req.params;
    const result = await StorePriceService.find(
        {
            store_id: store_id ? +store_id : undefined,
            type_id: type_id ? +type_id : undefined,
        },
        {
            page: page ? +page : 1,
            limit: limit ? +limit : 10,
        }
    );
    if (!result || !result.storePrices || !result.storePrices.length) {
        return res.status(404).json({ message: "No store prices found" });
    }
    return res.status(200).json(result);
};

const createNewStorePrice = async (req: Request, res: Response) => {
    const storePrice: StorePrice = req.body;
    const result = await StorePriceService.create(storePrice);
    if (!result) {
        return res
            .status(400)
            .json({ message: "Failed to create store price" });
    }
    return res.status(201).json({ message: "Create successfully" });
};

const updateStorePrice = async (req: Request, res: Response) => {
    const { id } = req.params;
    const storePrice: StorePrice = req.body;
    const result = await StorePriceService.update(storePrice, +id);
    if (!result) {
        return res
            .status(400)
            .json({ message: "Failed to update store price" });
    }
    return res.status(201).json({ message: "Update successfully" });
};

const removeStorePrice = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await StorePriceService.remove(+id);
    if (!result) {
        return res.status(404).json({ message: "Store price not found" });
    }
    return res.status(201).json({ message: "Delete successfully" });
};

export default {
    find,
    findByStoreIdAndTypeId,
    createNewStorePrice,
    updateStorePrice,
    removeStorePrice,
};
