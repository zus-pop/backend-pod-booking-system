import "dotenv/config";
import { pool } from "../app/config/pool.ts";
import SlotRepository from "../app/repositories/SlotRepository.ts";
import { PoolConnection } from "mysql2/promise";

let connection: PoolConnection;
beforeAll(async () => {
    // Initialize the connection
    connection = await pool.getConnection();
});

describe("Select multiple slot", () => {
    test("should return list of slots by range of slot_ids", async () => {
        const slot_ids: number[] = [1, 2, 3, 4, 5];
        const slots = await SlotRepository.findByMultipleId(
            slot_ids,
            connection
        );
        expect(slots).toHaveLength(slot_ids.length);
    });
});

afterAll(() => {
    // Release the connection back to the pool
    connection.release();
});
