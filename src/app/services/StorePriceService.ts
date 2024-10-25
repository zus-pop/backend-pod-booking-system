import { pool } from "../config/pool.ts";
import StorePriceRepo from "../repositories/StorePriceRepository.ts";
import { Pagination, StorePrice, StorePriceQueries } from "../types/type.ts";
import { convertStringDaysToBitField } from "../utils/days-and-bitfield.ts";

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

const create = async (storePrice: StorePrice) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const insertId = await StorePriceRepo.create(
            {
                ...storePrice,
                days_of_week: convertStringDaysToBitField(
                    storePrice.days_of_week as string[]
                ),
            },
            connection
        );
        await connection.commit();
        return insertId;
    } catch (err) {
        await connection.rollback();
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const update = async (storePrice: StorePrice, id: number) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const updatedRows = await StorePriceRepo.update(
            storePrice.days_of_week
                ? {
                      ...storePrice,
                      days_of_week: convertStringDaysToBitField(
                          storePrice.days_of_week as string[]
                      ),
                  }
                : storePrice,
            id,
            connection
        );
        await connection.commit();
        return updatedRows;
    } catch (err) {
        await connection.rollback();
        console.error(err);
        return null;
    } finally {
        connection.release();
    }
};

const remove = async (id: number) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const deletedRows = await StorePriceRepo.remove(id, connection);
        await connection.commit();
        return deletedRows;
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
    create,
    update,
    remove,
};
