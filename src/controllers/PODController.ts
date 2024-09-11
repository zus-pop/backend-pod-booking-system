import { Request, Response } from "express";
import PODService from "../services/PODService.ts";

const findAll = async (req: Request, res: Response) => {
    res.json([
        {
            pod_id: 1,
            pod_name: 'POD single'
        },
        {
            pod_id: 2,
            pod_name: 'POD pair'
        },
    ]);
}

const findById = async (req: Request, res: Response) => {
    const { id } = req.params;
    res.json({ message: id });
}

export default {
    findAll,
    findById,
}