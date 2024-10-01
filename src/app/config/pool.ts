import mysql2, { PoolConnection } from "mysql2/promise";

export const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

pool.on("connection", (connetion: PoolConnection) => {
    console.log(`connected with id: ${connetion.threadId}`);
});

pool.on("release", (connection: PoolConnection) => {
    console.log(`released connection id: ${connection.threadId}`);
});
