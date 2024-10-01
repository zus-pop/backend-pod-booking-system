import { Request, Response } from "express";
import UtilityService from "../services/UtilityService.ts";

const findAll = async (_: Request, res: Response) => {
  const utilities = await UtilityService.findAll();
  if (!utilities) {
    return res.status(404).json({ message: "No Utility found" });
  }
  return res.status(200).json(utilities);
};

const findById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const utility = await UtilityService.findUtilityById(+id);
  if (!utility) {
    return res.status(404).json({ message: "No Utility found" });
  }
  return res.status(200).json(utility);
};

export default {
  findAll,
  findById,
};
