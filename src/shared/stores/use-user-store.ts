import { defineStore } from "pinia";
import { computed, readonly, ref } from "vue";
import { UserRole } from "../models/user-role";
import { User } from "../models/user";

export const useUserStore = defineStore("user", () => {
    const activeUser = ref<User | null>(null);

    const isLoggedIn = computed(() => activeUser.value !== null);

    const logIn = (username: string, role: UserRole) => {
        const user: User = { employeeId: 1, username, role };
        activeUser.value = user;
    };

    const logOut = () => {
        activeUser.value = null;
    };

    return {
        isLoggedIn,
        activeUser: readonly(activeUser),

        logIn,
        logOut,
    };
});
