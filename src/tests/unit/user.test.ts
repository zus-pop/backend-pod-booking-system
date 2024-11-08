import { setupTestDB, cleanupTestDB, getTestData } from "../testSetup";
import UserService from "../../app/services/UserService";

describe("UserService", () => {
    beforeAll(async () => {
        await setupTestDB();
    });

    afterAll(async () => {
        await cleanupTestDB();
    });

    describe("findByEmail", () => {
        it("should find existing user by email", async () => {
            const { email } = getTestData.users.validUser;
            const user = await UserService.findByEmail(email);
            expect(user).not.toBeNull();
        });

        it("should return null for non-existing email", async () => {
            const user = await UserService.findByEmail(
                "nonexistent@example.com"
            );
            expect(user).toBeUndefined();
        });
    });
});
