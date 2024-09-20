import { ResultSetHeader } from "mysql2";
import { pool } from "../database/db.ts";
import { User } from "../types/type.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const connection = await pool.getConnection();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
const salt: number = 8;

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

const comparePassword = async (password: string, hashedPassword: string) => {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
};

const hashPassword = async (password: string) => {
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

const generateToken = (payload: string | Buffer | object) => {
    const token = jwt.sign(payload, JWT_SECRET_KEY, {
        expiresIn: "30m",
    });
    return token;
};

const verifyToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        return decoded;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export default {
    findAll,
    findById,
    findByEmail,
    persist,
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken,
};
