import { defineStore } from "pinia";
import { readonly, ref } from "vue";
import { UserRole } from "../models/user-role";
import { User } from "../models/user";

const SESSION_KEY = "activeUser";

export const useUserStore = defineStore("user", () => {
    const persisted = sessionStorage.getItem(SESSION_KEY);
    const initialUser: User | null = persisted ? (JSON.parse(persisted) as User) : null;

    const isLoggedIn = ref(initialUser !== null);

    const activeUser = ref<User | null>(initialUser);

    const logIn = (username: string, role: UserRole) => {
        const user: User = { id: 1, username, role };
        isLoggedIn.value = true;
        activeUser.value = user;
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    };

    const logOut = () => {
        isLoggedIn.value = false;
        activeUser.value = null;
        sessionStorage.removeItem(SESSION_KEY);
    };

    return {
        isLoggedIn: readonly(isLoggedIn),
        activeUser: readonly(activeUser),

        logIn,
        logOut,
    };
});
