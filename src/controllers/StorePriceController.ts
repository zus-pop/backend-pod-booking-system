import { Request, Response } from "express";
import StorePriceService from "../services/StorePriceService.ts";

const findAllStorePrice = async (_: Request, res: Response) => {
    const storePrices = await StorePriceService.findAllStorePrice();
    if (!storePrices || !storePrices.length) {
        return res.status(404).json({ message: "No store prices found" });
    }
    return res.status(200).json(storePrices);
};

const findAllStorePriceByPodType = async (req: Request, res: Response) => {
    const { type_id } = req.params;
    const storePrices = await StorePriceService.findAllStorePriceByPodType(
        +type_id
    );
    if (!storePrices || !storePrices.length) {
        return res.status(404).json({ message: "No store prices found" });
    }
    return res.status(200).json(storePrices);
};

export default {
    findAllStorePrice,
    findAllStorePriceByPodType,
};
