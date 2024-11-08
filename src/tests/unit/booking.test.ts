import { setupTestDB, cleanupTestDB, getTestData } from "../testSetup";
import BookingService from "../../app/services/BookingService";

describe("BookingService", () => {
    beforeAll(async () => {
        await setupTestDB();
    });

    afterAll(async () => {
        await cleanupTestDB();
    });

    describe("findBookings", () => {
        it("should find pending bookings with pagination", async () => {
            const { booking_status } = getTestData.bookings;
            const result = await BookingService.find(
                { booking_status },
                { page: 1, limit: 3 },
                {}
            );
            expect(result).not.toBeNull();
            expect(Array.isArray(result?.bookings)).toBeTruthy();
        });
    });
});
