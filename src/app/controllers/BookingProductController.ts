import BookingProductService from "../services/BookingProductService.ts";
import { Request, Response } from "express";

const findAll = async (_: Request, res: Response) => {
    const bookingProducts =
        await BookingProductService.findAllBookingProducts();
    if (!bookingProducts || !bookingProducts.length) {
        return res.status(404).json({ message: "No booking products found" });
    }
    return res.status(200).json(bookingProducts);
};

const findByBookingId = async (req: Request, res: Response) => {
    const { id } = req.params;
    const bookingProducts = await BookingProductService.findByBookingId(+id);
    if (!bookingProducts || !bookingProducts.length) {
        return res.status(404).json({ message: "No booking products found" });
    }
    return res.status(200).json(bookingProducts);
};

export default {
    findAll,
    findByBookingId,
};
