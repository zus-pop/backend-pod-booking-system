import { Request, Response } from "express";
import PODService from "../services/PODService.ts";

const findAll = async (req: Request, res: Response) => {
    const pod = await PODService.findAll();
    if (!pod) {
        return res.status(404).json({ message: "No POD found" });
    }
    return res.status(200).json(pod);
};

const findById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const pod = await PODService.findById(+id);
    if (!pod) {
        return res.status(404).json({ message: "No POD found" });
    }
    return res.status(200).json(pod);
};

export default {
    findAll,
    findById,
};
