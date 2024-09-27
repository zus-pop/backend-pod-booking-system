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
    created_at?: Date | string;
    updated_at?: Date | string;
}

export interface Product extends RowDataPacket {
    product_id?: number;
    product_name?: string;
    catedory_id?: number;
    image?: string;
    description?: string;
    price?: number;
    store_id?: number;
    stock?: number;
}

export interface BookingProduct {
    booking_id?: number;
    product_id?: number;
    unit_price?: number;
    quantity?: number;
}

export interface Category extends RowDataPacket {
    category_id: number;
    category_name: string;
}

export interface Payment {
    payment_id?: number;
    booking_id?: number;
    transaction_id?: string;
    total_cost?: number;
    payment_date?: Date | string;
    payment_status?: keyof typeof PaymentStatus;
}

export interface Store extends RowDataPacket {
    store_id: number;
    store_name: string;
    address: string;
    hotline: string;
}

export interface Slot {
    slot_id?: number;
    pod_id?: number;
    start_time?: Date;
    end_time?: Date;
    unit_price?: number;
    is_available?: boolean;
}

export interface PODType extends RowDataPacket {
    type_id: number;
    type_name: string;
    capacity: number;
}

export interface Booking extends RowDataPacket {
    booking_id?: number;
    pod_id?: number;
    slot_id?: number;
    user_id?: number;
    booking_date?: Date | string;
    booking_status?: keyof typeof BookingStatus;
}

export enum BookingStatus {
    Pending = "Pending",
    Confirmed = "Confirmed",
    Cancelled = "Cancelled",
    Completed = "Completed",
}

export enum PaymentStatus {
    Processing = "Processing",
    Unpaid = "Unpaid",
    Paid = "Paid",
    Failed = "Failed",
}

export enum Role {
    Admin = 1,
    Customer = 2,
    Manager = 3,
    Staff = 4,
}
