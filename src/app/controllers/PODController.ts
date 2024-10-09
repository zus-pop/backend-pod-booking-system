import { Request, Response } from "express";
import PODService from "../services/PODService.ts";
import PODUtilityService from "../services/PODUtilityService.ts";
import { POD } from "../types/type.ts";

const find = async (req: Request, res: Response) => {
    const { name, pod_type } = req.query;
    let pods: POD[] | null;
    if (name) {
        pods = await PODService.findPODByName(name as string);
        if (!pods || !pods.length) {
            return res.status(404).json({ message: "No POD found" });
        }
    } else if (pod_type) {
        pods = await PODService.findPODByType(+pod_type);
    } else {
        pods = await PODService.findAllPOD();
        if (!pods || !pods.length) {
            return res.status(404).json({ message: "No POD found" });
        }
    }
    return res.status(200).json(pods);
};

const findById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const pod = await PODService.findPODById(+id);
    if (!pod) {
        return res.status(404).json({ message: "No POD found" });
    }
    return res.status(200).json(pod);
};

const findUtilitiesByPodId = async (req: Request, res: Response) => {
    const { id } = req.params;
    const utilities = await PODUtilityService.findByPodId(+id);
    if (!utilities || !utilities.length) {
        return res
            .status(404)
            .json({ message: "No utilities found for this POD" });
    }
    return res.status(200).json(utilities);
};

const createNewPod = async (req: Request, res: Response) => {
    const newPod = req.body;
    const insertId = await PODService.createNewPOD(newPod);
    if (!insertId) {
        return res.status(400).json({ message: "Failed to create new POD" });
    }
    return res
        .status(201)
        .json({ message: "POD created successfully", pod_id: insertId });
};

const deleteOnePod = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PODService.deletePODById(+id);

    if (!result) {
        return res.status(404).json({ message: "POD not found" });
    }

    return res.status(200).json({ message: "POD deleted successfully" });
};

const updatePOD = async (req: Request, res: Response) => {
    const pod: any = {
        pod_id: +req.params.id, // Lấy ID từ URL
        pod_name: req.body.pod_name, // Các trường của POD được lấy từ body
        type_id: req.body.type_id,
        description: req.body.description,
        image: req.body.image,
        is_available: req.body.is_available,
        store_id: req.body.store_id,
    };

    const updated = await PODService.updatePOD(pod);
    if (updated) {
        return res.status(200).json({ message: "POD updated successfully" });
    } else {
        return res
            .status(404)
            .json({ message: "POD not found or update failed" });
    }
};

export default {
    find,
    findById,
    findUtilitiesByPodId,
    createNewPod,
    deleteOnePod,
    updatePOD,
};
