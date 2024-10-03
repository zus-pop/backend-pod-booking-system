import mysql2, {
    Field,
    PoolConnection,
    TypeCastField,
    TypeCastNext,
} from "mysql2/promise";

export const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    typeCast: (field: TypeCastField, next: TypeCastNext) => {
        if (field.type === "TINY" && field.length === 1) {
            return field.string() === "1";
        }
        return next();
    },
});

pool.on("connection", (connetion: PoolConnection) => {
    console.log(`connected with id: ${connetion.threadId}`);
});

pool.on("release", (connection: PoolConnection) => {
    console.log(`released connection id: ${connection.threadId}`);
});
