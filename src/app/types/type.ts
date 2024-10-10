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
export interface POD {
    pod_id?: number;
    pod_name?: string;
    type_id?: number;
    description?: string;
    image?: string;
    is_available?: boolean;
    store_id?: number;
}
export interface User {
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

export interface Product {
    product_id?: number;
    product_name?: string;
    category_id?: number;
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

export interface BookingSlot {
    id?: number;
    booking_id?: number;
    slot_id?: number;
    price?: number;
}

export interface Category {
    category_id: number;
    category_name: string;
}

export interface Utility {
    utility_id: number;
    utility_name: string;
    description: string;
}

export interface Payment {
    payment_id?: number;
    booking_id?: number;
    transaction_id?: string;
    total_cost?: number;
    payment_url?: string;
    payment_date?: Date | string;
    payment_status?: keyof typeof PaymentStatus;
}

export interface OnlinePaymentResponse {
    return_code: number;
    return_message: string;
    sub_return_code: number;
    sub_return_message: string;
    order_url: string;
    zp_trans_token: string;
    order_token: string;
    qr_code?: string;
    app_trans_id?: string;
}

export interface Store {
    store_id: number;
    store_name: string;
    address: string;
    hotline: string;
}

export interface Slot {
    slot_id?: number;
    pod_id?: number;
    start_time?: Date | string;
    end_time?: Date | string;
    unit_price?: number;
    is_available?: boolean;
}

export interface PODType {
    type_id: number;
    type_name: string;
    capacity: number;
}

export interface Booking {
    booking_id?: number;
    pod_id?: number;
    user_id?: number;
    rating?: number;
    comment?: string;
    booking_date?: Date | string;
    booking_status?: keyof typeof BookingStatus;
}

export interface StorePrice {
    id?: number;
    start_hour?: number;
    end_hour?: number;
    price?: number;
    store_id?: number;
    type_id?: number;
    days_of_week?: number;
}

export interface Role {
    role_id: number;
    role_name: string;
}

export enum BookingStatus {
    Pending = "Pending",
    Confirmed = "Confirmed",
    Canceled = "Canceled",
    Complete = "Complete",
    Ongoing = "Ongoing",
}

export enum PaymentStatus {
    Processing = "Processing",
    Unpaid = "Unpaid",
    Paid = "Paid",
    Failed = "Failed",
}

export enum Roles {
    Admin = 1,
    Customer = 2,
    Manager = 3,
    Staff = 4,
}

export enum DaysOfWeek {
    Sunday = 1 << 0,
    Monday = 1 << 1,
    Tuesday = 1 << 2,
    Wednesday = 1 << 3,
    Thursday = 1 << 4,
    Friday = 1 << 5,
    Saturday = 1 << 6,
}
