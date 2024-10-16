import PODService from "../app/services/PODService";
import { pool } from "../app/config/pool";

describe.skip("POD queries", () => {
    it("should return all PODs by name", async () => {
        const name = "meeting";
        const pods = await PODService.findPODByName(name);
        expect(pods).not.toBeNull();
    });
});

afterAll(() => {
    pool.end();
});
