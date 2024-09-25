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
export interface User extends RowDataPacket {
    user_id?: number;
    email: string;
    password: string;
    user_name: string;
    avatar?: string;
    role_id: number;
    phone_number?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface Store extends RowDataPacket {
    store_id: number;
    store_name: string;
    address: string;
    hotline: string;
}

export interface Slot extends RowDataPacket {
    slot_id: number;
    pod_id: number;
    start_time: Date;
    end_time: Date;
    unit_price: number;
    is_available: boolean

}

export enum Role {
    Admin = 1,
    Customer = 2,
    Manager = 3,
    Staff = 4,
}
