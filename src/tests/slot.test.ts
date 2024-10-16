import { pool } from "../app/config/pool.ts";
import SlotRepository from "../app/repositories/SlotRepository.ts";
import SlotService from "../app/services/SlotService.ts";
import moment from "moment";

describe.skip("Select multiple slot", () => {
    test("should return list of slots by range of slot_ids", async () => {
        const slot_ids: number[] = [1, 2, 3, 4, 5];
        const slots = await SlotService.findSlotByRangeOfId(slot_ids);
        expect(slots).toHaveLength(slot_ids.length);
    });
    test("should return list of available slot by date and pod id", async () => {
        const slots = await SlotService.findSlotByDateAndPodId(
            3,
            moment("2024-10-01").format("YYYY-MM-DD")
        );
        expect(slots?.length).toBeGreaterThan(0);
    });
});

describe.skip("checkAllAvailableSlot", () => {
    test("should return true if all slots are available", async () => {
        const slot_ids: number[] = [1, 5, 6, 7];
        const slots = await SlotService.checkAllAvailableSlot(slot_ids);
        expect(slots?.status).toBe(true);
    });
});

describe("check overlappingSlots", () => {
    test("should return true if there is overlapping slot", async () => {
        const connection = await pool.getConnection();
        const format = "YYYY-MM-DD HH:mm:ss";
        const start_time = moment("2024-08-30 07:00:00").format(format);
        const end_time = moment("2024-08-30 09:00:00").format(format);
        const pod_id = 1;
        await SlotRepository.checkOverlappingSlots(
            pod_id,
            start_time,
            end_time,
            connection
        );
    });
});

afterAll(() => {
    // Release the connection back to the pool
    pool.end();
});
