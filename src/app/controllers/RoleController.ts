import { Request, Response } from "express";
import RoleService from "../services/RoleService.ts";

const findAll = async (req: Request, res: Response) => {
    const roles = await RoleService.findAllRole();
    if (!roles || !roles.length) {
        return res.status(404).json({ message: "No roles found" });
    }
    return res.status(200).json(roles);
};

const findById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const role = await RoleService.findRoleById(+id);
    if (!role) {
        return res.status(404).json({ message: "Role not found" });
    }
    return res.status(200).json(role);
};

export default {
    findAll,
    findById,
};
