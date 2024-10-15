import { pool } from "../app/config/pool";
import { Roles, User } from "../app/types/type";
import "../app/services/UserService";
import UserService from "../app/services/UserService";

describe("User test", () => {
    // test("Create new user", async () => {
    //     const newUser: User = {
    //         user_name: "holyshit",
    //         email: "holy@gmail.com",
    //         password: "holymoly",
    //         role_id: Roles.Customer,
    //         phone_number: "1234567890",
    //     };
    //     const result = await UserService.persist(newUser);
    //     expect(result?.insertId).toBeGreaterThan(0);
    // });
    test("find user by email", async () => {
        const email = "jane@gmail.com";
        const user = await UserService.findByEmail(email);
        expect(user).not.toBeNull();
    });
});

afterAll(() => {
    pool.end();
});
