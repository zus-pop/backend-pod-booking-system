import { Request, Response } from "express";
import StorePriceService from "../services/StorePriceService.ts";

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

export default {
    find,
    findByStoreIdAndTypeId,
};
