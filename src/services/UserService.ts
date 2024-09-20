import { pool } from "../database/db.ts";
import { User } from "../types/type.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const connection = await pool.getConnection();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
const salt: number = 8;
const testToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ1c2VyX25hbWUiOiJNYXJyeSBKYW5lIiwicm9sZV9pZCI6MiwiaWF0IjoxNzI2ODU0OTEwfQ.3RT5UQKPcs3GPCMOV-xTY9QnH6_wFR4mi4bjqWhQDcA";
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
        const [users] = await connection.query(sql, values);
        return users;
    } catch (err) {
        console.error(err);
        return null;
    }
};
const findById = async (id: null) => {
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

const comparePassword = async (password: string, hashedPassword: string) => {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
};

const generateToken = (payload: string | Buffer | object) => {
    const token = jwt.sign(payload, JWT_SECRET_KEY);
    return token;
};

export default {
    findAll,
    findById,
    findByEmail,
    comparePassword,
    generateToken,
};
