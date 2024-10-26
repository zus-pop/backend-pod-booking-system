import { Request, Response } from "express";
import PODService from "../services/PODService.ts";
import PODUtilityService from "../services/PODUtilityService.ts";
import { POD, PODQueries, SortCriteria } from "../types/type.ts";
import { letImageCookToCloud } from "../utils/google-cloud-storage.ts";

const find = async (req: Request, res: Response) => {
  const { name, type_id, orderBy, direction, limit, page } = req.query;
  const result = await PODService.find(
    {
      pod_name: name as string,
      type_id: +type_id!,
    },
    {
      orderBy: orderBy ? (orderBy as string) : "pod_id",
      direction: direction
        ? (direction as keyof SortCriteria["direction"])
        : "ASC",
    },
    {
      limit: limit ? +limit : 4,
      page: page ? +page : 1,
    }
  );
  if (!result || !result.pods || !result.pods.length) {
    return res.status(404).json({ message: "No PODs found" });
  }
  return res.status(200).json(result);
};

const findById = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("Received ID: ", id);
  if (isNaN(+id)) {
    return res.status(400).json({ message: "Invalid POD ID" });
  }
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

const findByStoreId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { page, limit } = req.query;
  const pods = await PODService.findByStoreId(+id, {
    page: page ? +page : 1,
    limit: limit ? +limit : 3,
  });
  if (!pods || !pods.length) {
    return res.status(404).json({ message: "No POD found" });
  }
  return res.status(200).json(pods);
};

const createNewPod = async (req: Request, res: Response) => {
  const { pod_name, description, type_id, store_id } = req.body;
  const utilities = JSON.parse(req.body.utilities) as number[];

  const newPod: POD = {
    pod_name,
    description,
    type_id,
    store_id,
  };
  const imageFile = req.file;

  if (imageFile) {
    try {
      const publicUrl = await letImageCookToCloud(imageFile, "pods");
      newPod.image = publicUrl;
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Error uploading image to cloud storage" });
    }
  }
  const insertId = await PODService.createNewPOD(newPod, utilities);
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
  const { id } = req.params;
  const pod: POD = {
    ...(req.body as POD),
    pod_id: +id, // Lấy ID từ URL
  };
  const imageFile = req.file;
  if (imageFile) {
    try {
      const publicUrl = await letImageCookToCloud(imageFile, "pods");
      pod.image = publicUrl;
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Error uploading image to cloud storage" });
    }
  }

  const updated = await PODService.updatePOD(pod);
  if (updated) {
    return res.status(200).json({ message: "POD updated successfully" });
  } else {
    return res.status(404).json({ message: "POD not found or update failed" });
  }
};

const sortPODByRating = async (req: Request, res: Response) => {
  const { name, type_id, column, order } = req.query;

  const filters: PODQueries = {
    pod_name: name as string,
    type_id: type_id ? +type_id : undefined,
  };

  const comparator: SortCriteria = {
    orderBy: (column as string) || "avg_rating",
    direction: (order as keyof SortCriteria["direction"]) || "DESC",
  };

  try {
    const sortedPODs = await PODService.sortPODByRating(filters, comparator);

    if (!sortedPODs || !sortedPODs.length) {
      return res.status(404).json({ message: "No PODs found" });
    }

    return res.status(200).json(sortedPODs);
  } catch (error) {
    console.error("Error sorting POD by rating:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  find,
  findById,
  findUtilitiesByPodId,
  findByStoreId,
  createNewPod,
  deleteOnePod,
  updatePOD,
  sortPODByRating,
};
