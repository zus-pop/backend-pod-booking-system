import { RowDataPacket } from "mysql2";

export interface SlotOption {
    startDate: string;
    endDate: string;
    startHour: number;
    endHour: number;
    durationMinutes: number;
    podId: number;
    unitPrice: number;
    gap?: number;
}

export interface POD extends RowDataPacket {
    pod_id: number;
    pod_name: string;
    type_id: number;
    description?: string;
    image?: string;
    is_available: boolean;
    store_id?: number;
}
