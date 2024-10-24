import { pool } from "../config/pool.ts";
import StorePriceRepo from "../repositories/StorePriceRepository.ts";
import { Pagination, StorePriceQueries } from "../types/type.ts";

const find = async (filters: StorePriceQueries, pagination?: Pagination) => {
    const connection = await pool.getConnection();
    try {
        const storePrices = await StorePriceRepo.find(
            filters,
            connection,
            pagination
        );
        return storePrices;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

export default {
    find,
};
