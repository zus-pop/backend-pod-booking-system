import { Request, Response } from "express";
import StoreService from "../services/StoreService.ts";
import { letImageCookToCloud } from "../utils/google-cloud-storage.ts";
import { Store } from "../types/type.ts";

const find = async (req: Request, res: Response) => {
    const { store_name, address, limit, page } = req.query;
    const result = await StoreService.find(
        {
            store_name: store_name as string,
            address: address as string,
        },
        {
            limit: limit ? +limit : 3,
            page: page ? +page : 1,
        }
    );
    if (!result || !result.stores || !result.stores.length) {
        return res.status(404).json({ message: "No stores found" });
    }
    return res.status(200).json(result);
};

const findById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const store = await StoreService.findStoreById(+id);
    if (!store) {
        return res.status(404).json({ message: "Store not found" });
    }
    return res.status(200).json(store);
};

const createNewStore = async (req: Request, res: Response) => {
    const { store_name, address, hotline } = req.body;

    const newStore: Store = {
        store_name,
        address,
        hotline,
    };

    const imageFile = req.file;

    if (imageFile) {
        try {
            const publicUrl = await letImageCookToCloud(imageFile, "stores");
            newStore.image = publicUrl;
        } catch (err) {
            console.log(err);
            return res
                .status(500)
                .json({ message: "Error uploading image to cloud storage" });
        }
    }

    const insertId = await StoreService.createNewStore(newStore);
    if (!insertId) {
        return res.status(400).json({ message: "Failed to create new Store" });
    }
    return res
        .status(201)
        .json({ message: "Store created successfully", store_id: insertId });
};

const updateStore = async (req: Request, res: Response) => {
    const { id } = req.params;
    const store: Store = {
        ...(req.body as Store),
        store_id: +id, // Lấy ID từ URL
    };

    const imageFile = req.file;
    if (imageFile) {
        try {
            const publicUrl = await letImageCookToCloud(imageFile, "stores");
            store.image = publicUrl;
        } catch (err) {
            console.log(err);
            return res
                .status(500)
                .json({ message: "Error uploading image to cloud storage" });
        }
    }

    const updated = await StoreService.updateStore(store);
    if (updated) {
        return res.status(200).json({ message: "Store updated successfully" });
    } else {
        return res
            .status(404)
            .json({ message: "Store not found or update failed" });
    }
};

const deleteStore = async (req: Request, res: Response) => {
    const { id } = req.params;
    const isdeleted = await StoreService.deleteStoreById(+id);
    if (isdeleted) {
        return res.status(200).json({ message: "Store deleted successfully" });
    } else {
        return res
            .status(404)
            .json({ message: "Store not found or delete failed" });
    }
};

export default {
    find,
    findById,
    createNewStore,
    updateStore,
    deleteStore,
};
