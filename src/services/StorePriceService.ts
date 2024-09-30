import { pool } from "../config/pool.ts";
import StorePriceRepo from "../repositories/StorePriceRepository.ts";

const findAllStorePrice = async () => {
    const connection = await pool.getConnection();
    try {
        const storePrices = await StorePriceRepo.findAllStorePrice(connection);
        return storePrices;
    } catch (err) {
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const findAllStorePriceByPodType = async (type_id: number) => {
    const connection = await pool.getConnection();
    try {
        const storePrices = await StorePriceRepo.findAllStorePriceByPodType(
            type_id,
            connection
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
    findAllStorePrice,
    findAllStorePriceByPodType,
};
