import BookingService from "../app/services/BookingService";
import { pool } from "../app/config/pool";
describe.skip("booking id", () => {
    test("test book", async () => {
        const booking = await BookingService.findBookingById(8);
        expect(booking).not.toBeNull();
    });
});

afterAll(() => {
    pool.end();
});
