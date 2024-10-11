import { pool } from "../config/pool.ts";
import UtilityRepository from "../repositories/UtilityRepository.ts";
import { Utility } from "../types/type.ts";

const findAll = async () => {
  const connection = await pool.getConnection();
  try {
    const utilities = await UtilityRepository.findAll(connection);
    return utilities;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    connection.release();
  }
};

const findUtilityById = async (id: number) => {
  const connection = await pool.getConnection();
  try {
    const utility = await UtilityRepository.findById(id, connection);
    return utility;
  } catch (err) {
    console.log(err);
    return null;
  } finally {
    connection.release();
  }
};

const createNewUtility = async (utilityData: Utility) => {
  const conneciton = await pool.getConnection();
  try {
    const newUtilityId = await UtilityRepository.createNewUtility(
      utilityData,
      conneciton
    );
    const newUtility = await UtilityRepository.findById(
      newUtilityId,
      conneciton
    );
    return newUtility;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    conneciton.release();
  }
};

export default {
  findAll,
  findUtilityById,
  createNewUtility,
};
