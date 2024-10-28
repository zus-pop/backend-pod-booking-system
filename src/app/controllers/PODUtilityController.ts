import { Request, Response } from "express";
import PODUtilityService from "../services/PODUtilityService.ts";
const findAll = async (_: Request, res: Response) => {
  const podUtilities = await PODUtilityService.findAll();
  if (!podUtilities || !podUtilities.length) {
    return res.status(404).json({ message: "No POD Utilities found" });
  }
  return res.status(200).json(podUtilities);
};
const findById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const podUtility = await PODUtilityService.findById(+id);
  if (!podUtility) {
    return res.status(404).json({ message: "POD Utility not found" });
  }
  return res.status(200).json(podUtility);
};
export default {
  findAll,
  findById,
};
