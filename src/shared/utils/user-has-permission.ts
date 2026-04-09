import { rolePermissions, UserPermission } from "../models/user-permissions";
import { User } from "../models/user";

export const userHasPermission = (user: User | null, permission: UserPermission): boolean => {
    if (!user || !permission) return false;

    const permissions = rolePermissions[user.role];
    return permissions.includes(permission);
};
