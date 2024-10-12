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

const createNewUtility = async (req: Request, res: Response) => {
  try {
    const { utility_name, description } = req.body;
    if (!utility_name || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newUtility: any = {
      utility_name,
      description,
    };

    const createdUtility = await UtilityService.createNewUtility(newUtility);
    return res.status(201).json(createdUtility);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateUtility = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { utility_name, description } = req.body;

  if (!utility_name || !description) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const updatedData = { utility_name, description };
  const updatedUtility = await UtilityService.updateUtilityById(
    +id,
    updatedData
  );

  if (!updatedUtility) {
    return res
      .status(404)
      .json({ message: "Utility not found or update failed" });
  }

  return res.status(200).json(updatedUtility);
};

export default {
  findAll,
  findById,
  createNewUtility,
  updateUtility,
};
