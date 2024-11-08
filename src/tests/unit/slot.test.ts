import SlotService from "../../app/services/SlotService";
import { cleanupTestDB, getTestData, setupTestDB } from "../testSetup";

describe("SlotService", () => {
    beforeAll(async () => {
        await setupTestDB();
    });

    afterAll(async () => {
        await cleanupTestDB();
    });

    describe("findSlots", () => {
        it("should find unavailable slots by date and pod id", async () => {
            const { validDate, validPodId } = getTestData.slots;
            const slots = await SlotService.find({
                pod_id: validPodId,
                date: validDate,
                is_available: false,
            });
            expect(slots).toBeDefined();
            expect(slots?.length).toBeGreaterThan(0);
        });
    });

    describe("slotAvailability", () => {
        it("should check slot availability correctly", async () => {
            const { invalidSlotIds } = getTestData.slots;
            const result = await SlotService.checkAllAvailableSlot(
                invalidSlotIds
            );
            expect(result?.status).toBeFalsy();
        });
    });
});
