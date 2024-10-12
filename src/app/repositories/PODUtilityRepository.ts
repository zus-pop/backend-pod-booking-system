import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { PODUtility } from "../types/type.ts";

const findAll = async (connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ??";
    const columns = ["id", "pod_id", "utility_id"];
    const values = [columns, "POD_Utility"];
    const [podUtilities] = await connection.query<RowDataPacket[]>(sql, values);
    return podUtilities as PODUtility[];
};

const findById = async (id: number, connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = ["id", "pod_id", "utility_id"];
    const values = [columns, "POD_Utility", "id", id];
    const [podUtilities] = await connection.query<RowDataPacket[]>(sql, values);
    return podUtilities[0] as PODUtility;
};

const findByPodId = async (podId: number, connection: PoolConnection) => {
    const sql =
        "SELECT ?? FROM ?? pu JOIN ?? u ON pu.utility_id = u.utility_id WHERE ?? = ?";
    const columns = ["u.utility_id", "u.utility_name", "u.description"];
    const values = [columns, "POD_Utility", "Utility", "pu.pod_id", podId];
    const [utilities] = await connection.query<RowDataPacket[]>(sql, values);
    return utilities as PODUtility[];
};

const create = async (
    podUtilities: PODUtility[],
    connection: PoolConnection
) => {
    const sql = "INSERT INTO ?? (??) VALUES ?";
    const columns = ["pod_id", "utility_id"];
    const values = [
        "POD_Utility",
        columns,
        podUtilities.map((podUtility) => [
            podUtility.pod_id,
            podUtility.utility_id,
        ]),
    ];
    const [result] = await connection.query<ResultSetHeader>(sql, values);
    return result;
};

export default {
    findAll,
    findById,
    findByPodId,
    create,
};
