import { Request, Response } from "express";
import BookingProductService from "../services/BookingProductService.ts";
import { BookingProduct } from "../types/type.ts";

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

const findByBookingIdAndSlotId = async (req: Request, res: Response) => {
    const { booking_id, slot_id } = req.params;
    const bookingProducts =
        await BookingProductService.findByBookingIdAndSlotId(
            +booking_id,
            +slot_id
        );
    if (!bookingProducts || !bookingProducts.length) {
        return res.status(404).json({ message: "No booking products found" });
    }
    return res.status(200).json(bookingProducts);
};

const findAllSlotByBookingIdAndPaymentId = async (
    req: Request,
    res: Response
) => {
    const { booking_id, payment_id } = req.params;
    const bookingProducts =
        await BookingProductService.findAllSlotByBookingIdAndPaymentId(
            +booking_id,
            +payment_id
        );
    if (!bookingProducts || !bookingProducts.length) {
        return res.status(404).json({ message: "No booking products found" });
    }
    return res.status(200).json(bookingProducts);
};

const createProductPayment = async (req: Request, res: Response) => {
    const { payload } = req;
    const bookingProduct = req.body as BookingProduct[];
    const result = await BookingProductService.createProductPayment(
        bookingProduct,
        payload.user_id
    );
    return res.status(201).json(result);
};

const cashProduct = async (req: Request, res: Response) => {
    const bookingProduct = req.body as BookingProduct[];
    const result = await BookingProductService.addProductForBooking(
        bookingProduct
    );
    if (!result) {
        return res.status(400).json({ message: "Failed to cash product" });
    }
    return res.status(201).json(result);
};

export default {
    findAll,
    findByBookingId,
    findByBookingIdAndSlotId,
    findAllSlotByBookingIdAndPaymentId,
    createProductPayment,
    cashProduct,
};
