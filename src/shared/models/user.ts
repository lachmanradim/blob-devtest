import { UserRole } from "./user-role";

export type User = {
    employeeId: number;
    username: string;
    role: UserRole;
};
