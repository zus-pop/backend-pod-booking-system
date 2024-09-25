import { Request, Response, NextFunction } from "express";

export const validateEmptyObject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body } = req;
    if (!body || !Object.keys(body).length) {
        return res.status(400).json({ message: "Body is required" });
    }
    next();
};
