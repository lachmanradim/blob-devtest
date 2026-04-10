import { defineStore } from "pinia";
import { computed, readonly, ref } from "vue";
import { UserRole } from "../models/user-role";
import { User } from "../models/user";

const SESSION_KEY = "activeUser";

export const useUserStore = defineStore("user", () => {
    const persisted = sessionStorage.getItem(SESSION_KEY);
    const initialUser: User | null = persisted ? (JSON.parse(persisted) as User) : null;

    const activeUser = ref<User | null>(initialUser);

    const isLoggedIn = computed(() => activeUser.value !== null);

    const logIn = (username: string, role: UserRole) => {
        const user: User = { employeeId: 1, username, role };
        activeUser.value = user;
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    };

    const logOut = () => {
        activeUser.value = null;
        sessionStorage.removeItem(SESSION_KEY);
    };

    return {
        isLoggedIn,
        activeUser: readonly(activeUser),

        logIn,
        logOut,
    };
});
