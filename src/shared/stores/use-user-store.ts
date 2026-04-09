import { defineStore } from "pinia";
import { readonly, ref } from "vue";
import { UserRole } from "../models/user-role";
import { User } from "../models/user";

export const useUserStore = defineStore("user", () => {
    const isLoggedIn = ref(false);

    const activeUser = ref<User | null>(null);

    const logIn = (username: string, role: UserRole) => {
        isLoggedIn.value = true;
        activeUser.value = { username, role };
    };

    const logOut = () => {
        isLoggedIn.value = false;
        activeUser.value = null;
    };

    return {
        isLoggedIn: readonly(isLoggedIn),
        activeUser: readonly(activeUser),

        logIn,
        logOut,
    };
});
