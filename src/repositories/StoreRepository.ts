import { pool } from "../config/pool.ts";
import { Store } from "../types/type.ts";

const connection = await pool.getConnection();

const findAll = async () => {
    try {
        const sql = "SELECT ?? FROM ??";
        const columns = ["store_id", "store_name", "address", "hotline"];
        const values = [columns, "Store"];
        const [stores] = await connection.query<Store[]>(sql, values);
        return stores;
    } catch (err) {
        console.error(err);
        return null;
    }
};

const findById = async (id: number) => {
    try {
        const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
        const columns = ["store_id", "store_name", "address", "hotline"];
        const values = [columns, "Store", "store_id", id];
        const [stores] = await connection.query<Store[]>(sql, values);
        return stores[0];
    } catch (err) {
        console.error(err);
        return null;
    }
};

export default {
    findAll,
    findById,
};
