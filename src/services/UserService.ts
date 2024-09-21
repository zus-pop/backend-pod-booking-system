import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserRepo from "../databases/UserRepository.ts";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
const salt: number = 8;

const findAll = () => {
    return UserRepo.findAll();
};
const findById = (id: number) => {
    return UserRepo.findById(id);
};

const findByEmail = (email: string) => {
    return UserRepo.findByEmail(email);
};

const persist = (user: {
    email: string;
    password: string;
    user_name: string;
    role_id: number;
    phone_number?: string;
}) => {
    return UserRepo.persist(user);
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
