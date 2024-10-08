import "dotenv/config";
import { pool } from "../app/config/pool.ts";
import SlotService from "../app/services/SlotService.ts";
import moment from "moment";

describe("Select multiple slot", () => {
    test("should return list of slots by range of slot_ids", async () => {
        const slot_ids: number[] = [1, 2, 3, 4, 5];
        const slots = await SlotService.findSlotByRangeOfId(slot_ids);
        expect(slots).toHaveLength(slot_ids.length);
    });
    test("should return list of available slot by date and pod id", async () => {
        const slots = await SlotService.findAvailableSlotByDateAndPodId(
            3,
            moment("2024-10-01").format("YYYY-MM-DD")
        );
        expect(slots?.length).toBeGreaterThan(0);
    });
});

describe("checkAllAvailableSlot", () => {
    test("should return true if all slots are available", async () => {
        const slot_ids: number[] = [4, 5, 6, 7];
        const slots = await SlotService.checkAllAvailableSlot(slot_ids);
        expect(slots?.status).toBe(true);
    });
});

afterAll(() => {
    // Release the connection back to the pool
    pool.end();
});
