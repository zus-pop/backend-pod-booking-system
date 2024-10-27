import BookingService from "../app/services/BookingService";
import { pool } from "../app/config/pool";
describe("booking id", () => {
    test("test book", async () => {
        const result = await BookingService.find(
            { booking_status: "Pending" },
            { page: 1, limit: 3 },
            {}
        );
        expect(result).not.toBeNull();
    });
});

afterAll(() => {
    pool.end();
});
