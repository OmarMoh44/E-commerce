import { Role } from "@prisma/client";

export interface UserInfo {
    email: string;
    name: string;
    phone: string;
    password: string;
    confirmPassword: string;
    role: Role;
};