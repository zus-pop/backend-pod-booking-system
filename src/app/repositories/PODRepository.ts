import { ResultSetHeader, RowDataPacket } from "mysql2";
import { POD } from "../types/type.ts";
import { PoolConnection } from "mysql2/promise";

const findAll = async (connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ??";
    const columns = [
        "pod_id",
        "pod_name",
        "type_id",
        "description",
        "image",
        "is_available",
        "store_id",
    ];
    const values = [columns, "POD"];
    const [pods] = await connection.query<RowDataPacket[]>(sql, values);
    return pods as POD[];
};

const findById = async (id: number, connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = [
        "pod_id",
        "pod_name",
        "type_id",
        "description",
        "image",
        "is_available",
        "store_id",
    ];
    const values = [columns, "POD", "pod_id", id];
    const [pods] = await connection.query<RowDataPacket[]>(sql, values);
    return pods[0] as POD;
};

const findByName = async (name: string, connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? LIKE ?";
    const columns = [
        "pod_id",
        "pod_name",
        "type_id",
        "description",
        "image",
        "is_available",
        "store_id",
    ];
    const values = [columns, "POD", "pod_name", `%${name}%`];
    const [pods] = await connection.query<RowDataPacket[]>(sql, values);
    return pods as POD[];
};

const findByType = async (pod_type: number, connection: PoolConnection) => {
    const sql = "SELECT ?? FROM ?? WHERE ?? = ?";
    const columns = [
        "pod_id",
        "pod_name",
        "type_id",
        "description",
        "image",
        "is_available",
        "store_id",
    ];
    const values = [columns, "POD", "type_id", pod_type];
    const [pods] = await connection.query<RowDataPacket[]>(sql, values);
    return pods as POD[];
};

const createNewPod = async (pod: POD, connection: PoolConnection) => {
    const sql = "INSERT INTO POD SET ?";
    const [result] = await connection.query<ResultSetHeader>(sql, [pod]);
    return result.insertId;
};

const deleteOnePod = async (id: number, connection: PoolConnection) => {
    const existingPod = await findById(id, connection);
    if (!existingPod) {
        return null;
    }

    const sql = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
    const values = ["POD", "is_available", false, "pod_id", id];
    const [result] = await connection.query<RowDataPacket[]>(sql, values);
    return result;
};

const updatePOD = async (pod: POD, connection: PoolConnection) => {
    const sql = `UPDATE POD SET ? WHERE pod_id = ?`;
    const [result] = await connection.query<ResultSetHeader>(sql, [
        pod, // Các field của POD cần cập nhật
        pod.pod_id, // ID của POD
    ]);
    return result.affectedRows > 0;
};

export default {
    findAll,
    findById,
    findByName,
    findByType,
    createNewPod,
    deleteOnePod,
    updatePOD,
};
