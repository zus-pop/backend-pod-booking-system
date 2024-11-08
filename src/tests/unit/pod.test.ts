import { setupTestDB, cleanupTestDB, getTestData } from "../testSetup";
import PODService from "../../app/services/PODService";

describe("PODService", () => {
    beforeAll(async () => {
        await setupTestDB();
    });

    afterAll(async () => {
        await cleanupTestDB();
    });

    describe("findPods", () => {
        it("should find pods by name with pagination", async () => {
            const { pod_name } = getTestData.pods.validPod;
            const pods = await PODService.find(
                { pod_name },
                { orderBy: "pod_id", direction: "ASC" },
                { limit: 10, page: 1 }
            );
            expect(pods).not.toBeNull();
            expect(Array.isArray(pods?.pods)).toBeTruthy();
        });
    });
});
