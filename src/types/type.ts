import { RowDataPacket } from "mysql2";
import bcrypt from "bcryptjs";
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
    user_id: number;
    email: string;
    password: string;
    user_name: string;
    avatar?: string;
    role_id: number;
    phone_number?: string;
    created_at?: Date;
    updated_at?: Date;
}

export enum Role {
    Admin = 1,
    Customer = 2,
    Manager = 3,
    Staff = 4,
}

// const passwords: string[] = ["admin123", "jane123", "staff123", "peter123"];
// passwords.forEach(async (pass) => {
//     const hashedPassword = bcrypt.hashSync(pass, 8);
//     console.log(`${pass} = ${hashedPassword}`);
//     console.log(await bcrypt.compare(pass, hashedPassword));
// });
