import { Request, Response } from "express";
import PODService from "../services/PODService.ts";
import PODUtilityService from "../services/PODUtilityService.ts";

const findAll = async (_: Request, res: Response) => {
  const pod = await PODService.findAllPOD();
  if (!pod) {
    return res.status(404).json({ message: "No POD found" });
  }
  return res.status(200).json(pod);
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
    return res.status(404).json({ message: "No utilities found for this POD" });
  }
  return res.status(200).json(utilities);
};

export default {
  findAll,
  findById,
  findUtilitiesByPodId,
};
