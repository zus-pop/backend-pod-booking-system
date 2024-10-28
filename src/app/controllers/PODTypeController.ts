import { Request, Response } from "express";
import PODTypeService from "../services/PODTypeService.ts";

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

const findPodsByTypeId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const pods = await PODTypeService.findPodsByTypeId(+id);
  if (!pods || !pods.length) {
    return res.status(404).json({ message: "No PODs found for this POD type" });
  }
  return res.status(200).json(pods);
};

export default {
  findAll,
  findById,
  findPodsByTypeId,
};
