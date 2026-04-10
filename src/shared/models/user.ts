import { UserRole } from "./user-role";

export type User = {
    id: number;
    username: string;
    role: UserRole;
};
