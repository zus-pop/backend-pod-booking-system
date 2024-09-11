import { pool } from "../database/db.ts";

const connection = await pool.getConnection()

const findAll = async () => {
    try {
        const sql = 'SELECT * FROM ??';
        const values = ['pod']
        const [pod] = await connection.query(sql, values);
        return pod;
    } catch (err) {
        console.error('error:', err);
        return null;
    }
}

export default {
    findAll
}