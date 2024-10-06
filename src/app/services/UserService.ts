import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserRepo from "../repositories/UserRepository.ts";
import RoleRepo from "../repositories/RoleRepository.ts";
import { pool } from "../config/pool.ts";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
const salt: number = 8;

const findAll = async () => {
    const connection = await pool.getConnection();
    try {
        const users = await UserRepo.findAll(connection);
        return await Promise.all(
            users.map(async (user) => ({
                user_id: user.user_id,
                email: user.email,
                user_name: user.user_name,
                role: await RoleRepo.findById(user.role_id, connection),
            }))
        );
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};
const findById = async (id: number) => {
    const connection = await pool.getConnection();
    try {
        const user = await UserRepo.findById(id, connection);
        return {
            user_id: user.user_id,
            email: user.email,
            user_name: user.user_name,
            role: await RoleRepo.findById(user.role_id, connection),
        };
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const findByEmail = async (email: string) => {
    const connection = await pool.getConnection();
    try {
        const user = await UserRepo.findByEmail(email, connection);
        return user;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        connection.release();
    }
};

const persist = async (user: {
    email: string;
    password: string;
    user_name: string;
    role_id: number;
    phone_number?: string;
}) => {
    const connection = await pool.getConnection();
    try {
        return UserRepo.persist(user, connection);
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
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
        // expiresIn: "30m",
    });
    return token;
};

const verifyToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        return decoded;
    } catch (err) {
        throw err;
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
