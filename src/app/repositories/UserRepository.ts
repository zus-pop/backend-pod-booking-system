import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Pagination, Role, User, UserQueries } from "../types/type.ts";
import RoleRepository from "./RoleRepository.ts";

export interface MappingOptions {
    role?: boolean;
}

export interface MappingResponse {
    user_id?: number;
    email?: string;
    user_name?: string;
    role?: Role;
    phone_number?: string;
}

const userMapper = async (
    user: User,
    connection: PoolConnection,
    options?: MappingOptions
) => {
    const mappingResult: MappingResponse = {
        user_id: user.user_id,
        email: user.email,
        user_name: user.user_name,
        phone_number: user.phone_number,
    };

    if (options) {
        if (options.role) {
            const role = await RoleRepository.findById(
                user.role_id,
                connection
            );
            mappingResult.role = role;
        }
    }
    return mappingResult;
};

const find = async (
    filters: UserQueries = {},
    connection: PoolConnection,
    pagination?: Pagination,
    options?: MappingOptions
) => {
    const conditions: string[] = [];
    const queryParams: any[] = [];
    let sql = "SELECT ?? FROM ??";
    let countSql = "SELECT COUNT(*) AS total FROM User";

    Object.keys(filters).forEach((filter) => {
        const key = filter;
        const value = filters[filter as keyof UserQueries];
        if (value) {
            conditions.push(`${key} LIKE ?`);
            queryParams.push(`%${value}%`);
        }
    });

    if (conditions.length) {
        const where = ` WHERE ${conditions.join(" OR ")}`;
        sql += where;
        countSql += where;
    }

    const [totalCount] = await connection.query<RowDataPacket[]>(
        countSql,
        queryParams
    );

    if (pagination) {
        const { limit, page } = pagination;
        const offset = (page! - 1) * limit!;
        sql += ` LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);
    }

    const columns = [
        "user_id",
        "phone_number",
        "email",
        "password",
        "user_name",
        "role_id",
    ];
    const values = [columns, "User", ...queryParams];
    const [rows] = await connection.query<RowDataPacket[]>(sql, values);
    const users = rows as User[];
    return {
        users: await Promise.all(
            users.map(async (user) => userMapper(user, connection, options))
        ),
        total: totalCount[0].total as number,
    };
};

const findById = async (
    id: number,
    connection: PoolConnection,
    options?: MappingOptions
) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = [
        "user_id",
        "phone_number",
        "email",
        "password",
        "user_name",
        "role_id",
    ];
    const values = [columns, "User", "user_id", id];
    const [user] = await connection.query<RowDataPacket[]>(sql, values);
    return await userMapper(user[0] as User, connection, options);
};

const findByEmail = async (email: string, connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = [
        "user_id",
        "phone_number",
        "email",
        "password",
        "user_name",
        "role_id",
    ];
    const values = [columns, "User", "email", email];
    const [user] = await connection.query<RowDataPacket[]>(sql, values);
    console.log;
    return user[0] as User;
};

const findByPhone = async (
    phone_number: string,
    connection: PoolConnection
) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = [
        "user_id",
        "phone_number",
        "password",
        "user_name",
        "role_id",
    ];
    const values = [columns, "User", "phone_number", phone_number];
    const [user] = await connection.query<RowDataPacket[]>(sql, values);
    console.log;
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

const update = async (user: User, id: number, connection: PoolConnection) => {
    const sql = "UPDATE ?? SET ? WHERE ?? = ?";
    const values = ["User", user, "user_id", id];
    const [result] = await connection.query<ResultSetHeader>(sql, values);
    return result;
};

export default {
    find,
    findById,
    findByEmail,
    findByPhone,
    persist,
    update,
};
