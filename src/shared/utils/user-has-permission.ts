import { rolePermissions, UserPermission } from "../models/user-permissions";
import { useUserStore } from "../stores/use-user-store";
import { storeToRefs } from "pinia";

export const userHasPermission = (permission: UserPermission): boolean => {
    const userStore = useUserStore();
    const { activeUser } = storeToRefs(userStore);

    if (!activeUser.value || !permission) return false;

    const permissions = rolePermissions[activeUser.value.role];
    return permissions.includes(permission);
};
