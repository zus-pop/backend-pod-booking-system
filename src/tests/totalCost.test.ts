import "dotenv/config";
import { BookingProduct, Slot } from "../types/type.ts";
import { getTotalCost } from "../utils/util.ts";

describe("Get total cost", () => {
    test("should return right number", async () => {
        const bookingProducts: BookingProduct[] = [
            {
                product_id: 1,
                quantity: 2,
                unit_price: 20000,
            },
            {
                product_id: 1,
                quantity: 1,
                unit_price: 10000,
            },
            {
                product_id: 1,
                quantity: 2,
                unit_price: 10000,
            },
        ];
        const slot: Slot = {
            unit_price: 400000,
        };
        const totalCost = await getTotalCost(bookingProducts, slot);
        expect(totalCost).toBe(470_000);
    });
});

afterAll(() => {});
