import { Role } from "@prisma/client";

export type UserInfo = {
    email: string;
    name: string;
    phone: string;
    password: string;
    confirmPassword: string;
    role: Role;
};