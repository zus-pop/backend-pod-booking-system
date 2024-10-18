import PODService from "../app/services/PODService";
import { pool } from "../app/config/pool";

describe("POD queries", () => {
    it("should return all PODs by name", async () => {
        const name = "meeting";
        const pods = await PODService.find(
            {
                pod_name: name,
            },
            {
                orderBy: "pod_id",
                direction: "ASC",
            },
            {
                limit: 10,
                page: 1,
            }
        );
        expect(pods).not.toBeNull();
    });
});

afterAll(() => {
    pool.end();
});
