import PODTypeService from "../services/PODTypeService.ts";
import { Request, Response } from "express";

const findAll = async (_: Request, res: Response) => {
    const podTypes = await PODTypeService.findAllPODType();
    if (!podTypes || !podTypes.length) {
        return res.status(404).json({ message: "No POD Types found" });
    }
    return res.status(200).json(podTypes);
};

const findById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const podType = await PODTypeService.findPODTypeById(+id);
    if (!podType) {
        return res.status(404).json({ message: "POD Type not found" });
    }
    return res.status(200).json(podType);
};

export default {
    findAll,
    findById,
};
