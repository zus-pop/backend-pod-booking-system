import { ResultSetHeader } from "mysql2/promise";
import { pool } from "../config/pool.ts";
import { User } from "../types/type.ts";

const connection = await pool.getConnection();

const findAll = async () => {
    try {
        const sql = "SELECT ?? FROM ??";
        const columns = [
            "user_id",
            "email",
            "password",
            "user_name",
            "role_id",
        ];
        const values = [columns, "User"];
        const [users] = await connection.query<User[]>(sql, values);
        return users;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const findById = async (id: number) => {
    try {
        const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
        const columns = [
            "user_id",
            "email",
            "password",
            "user_name",
            "role_id",
        ];
        const values = [columns, "User", "user_id", id];
        const [user] = await connection.query<User[]>(sql, values);
        return user[0];
    } catch (err) {
        console.error(err);
        return null;
    }
};

const findByEmail = async (email: string) => {
    try {
        const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
        const columns = [
            "user_id",
            "email",
            "password",
            "user_name",
            "role_id",
        ];
        const values = [columns, "User", "email", email];
        const [user] = await connection.query<User[]>(sql, values);
        return user[0];
    } catch (err) {
        console.error(err);
        return null;
    }
};

const persist = async (user: {
    email: string;
    password: string;
    user_name: string;
    role_id: number;
    phone_number?: string;
}) => {
    try {
        await connection.beginTransaction();
        const sql = "INSERT INTO ?? SET ?";
        const values = ["User", user];
        console.log(connection.format(sql, values));
        const [result] = await connection.query<ResultSetHeader>(sql, values);
        await connection.commit();
        return result;
    } catch (err) {
        await connection.rollback();
        console.error(err);
        return null;
    }
};

export default {
    findAll,
    findById,
    findByEmail,
    persist,
};
