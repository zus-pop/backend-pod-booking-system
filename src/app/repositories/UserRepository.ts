import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { User } from "../types/type.ts";

const findAll = async (connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ??";
    const columns = ["user_id", "email", "password", "user_name", "role_id"];
    const values = [columns, "User"];
    const [users] = await connection.query<RowDataPacket[]>(sql, values);
    return users as User[];
};

const findById = async (id: number, connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = ["user_id", "email", "password", "user_name", "role_id"];
    const values = [columns, "User", "user_id", id];
    const [user] = await connection.query<RowDataPacket[]>(sql, values);
    return user[0] as User;
};

const findByEmail = async (email: string, connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = ["user_id", "email", "password", "user_name", "role_id"];
    const values = [columns, "User", "email", email];
    const [user] = await connection.query<RowDataPacket[]>(sql, values);
    return user[0] as User;
};

const persist = async (
    user: {
        email: string;
        password: string;
        user_name: string;
        role_id: number;
        phone_number?: string;
    },
    connection: PoolConnection
) => {
    const sql = "INSERT INTO ?? SET ?";
    const values = ["User", user];
    console.log(connection.format(sql, values));
    const [result] = await connection.query<ResultSetHeader>(sql, values);
    return result;
};

export default {
    findAll,
    findById,
    findByEmail,
    persist,
};
