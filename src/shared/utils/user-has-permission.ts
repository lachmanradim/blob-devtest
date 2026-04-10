import { rolePermissions, UserPermission } from "../models/user-permissions";
import { useUserStore } from "../stores/use-user-store";

export const userHasPermission = (permission: UserPermission): boolean => {
    const userStore = useUserStore();
    const { activeUser } = userStore;

    if (!activeUser) return false;

    return rolePermissions[activeUser.role].includes(permission);
};
