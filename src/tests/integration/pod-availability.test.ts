import PODService from "../../app/services/PODService";
import SlotService from "../../app/services/SlotService";
import { cleanupTestDB, setupTestDB } from "../testSetup";

describe("Pod Availability Integration", () => {
    beforeAll(async () => {
        await setupTestDB();
    });

    afterAll(async () => {
        await cleanupTestDB();
    });

    describe("Pod Search and Availability", () => {
        it("should find available pods with their slots", async () => {
            // 1. Find pods
            const pods = await PODService.find(
                { pod_name: "Pod" },
                { orderBy: "pod_id", direction: "ASC" },
                { limit: 10, page: 1 }
            );
            expect(pods?.pods.length).toBeGreaterThan(0);

            // 2. Check slots for first pod
            const firstPod = pods?.pods[0];
            const slots = await SlotService.find({
                pod_id: firstPod?.pod_id,
                date: "2024-10-01",
                is_available: true,
            });

            expect(slots).toBeDefined();
            expect(slots?.length).toBe(0);
        });
    });
});
