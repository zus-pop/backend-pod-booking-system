import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/pool.ts";
import UserRepo, { MappingOptions } from "../repositories/UserRepository.ts";
import { Pagination, User, UserQueries } from "../types/type.ts";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
const salt: number = 8;

const find = async (
    filters: UserQueries,
    pagination?: Pagination,
    options?: MappingOptions
) => {
    const connection = await pool.getConnection();
    try {
        const users = await UserRepo.find(
            filters,
            connection,
            pagination,
            options
        );
        return users;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};
const findById = async (id: number, options?: MappingOptions) => {
    const connection = await pool.getConnection();
    try {
        const user = await UserRepo.findById(id, connection, options);
        return user;
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

const findByPhone = async (phone_number: string) => {
    const connection = await pool.getConnection();
    try {
        const user = await UserRepo.findByPhone(phone_number, connection);
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
        expiresIn: "30m",
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

const update = async (user: User, id: number) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const result = await UserRepo.update(user, id, connection);
        await connection.commit();
        return result.affectedRows;
    } catch (err) {
        await connection.rollback();
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

export default {
    find,
    findById,
    findByEmail,
    findByPhone,
    persist,
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken,
    update,
};
