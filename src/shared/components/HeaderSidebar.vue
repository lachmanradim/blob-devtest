<template>
    <VAppBar class="pr-4" border>
        <template #prepend>
            <VAppBarNavIcon @click="toggleSidebar" />
        </template>
        <VAppBarTitle>Dovolenkátor</VAppBarTitle>
    </VAppBar>
    <VNavigationDrawer v-model="isSidebarOpen" temporary class="pa-2" width="280">
        <VList>
            <VListItem
                v-if="showMyVacations"
                prepend-icon="mdi-table-account"
                title="Moje žádosti"
                :to="{ name: Routes.PersonalVacations }"
            />
            <VListItem
                v-if="showApprovedRejectedVacations"
                prepend-icon="mdi-table-check"
                title="Schválené/Zamítnuté žádosti"
                :to="{ name: Routes.ApprovedRejectedVacations }"
            />
            <VListItem
                v-if="showPendingVacations"
                prepend-icon="mdi-table-alert"
                title="Žádosti ke schválení"
                :to="{ name: Routes.PendingVacations }"
            />
        </VList>
        <template #append>
            <VList>
                <VListItem title="Tmavý režim">
                    <template #append>
                        <VListItemAction>
                            <VSwitch
                                id="dark-theme-switch"
                                v-model="isDarkTheme"
                                hide-details
                                inset
                                false-icon="mdi-white-balance-sunny"
                                true-icon="mdi-weather-night"
                            />
                        </VListItemAction>
                    </template>
                </VListItem>
                <VListItem
                    prepend-icon="mdi-logout"
                    title="Odhlásit"
                    :to="{ name: Routes.Login }"
                    color="primary"
                    active
                    @click="logout"
                />
            </VList>
        </template>
    </VNavigationDrawer>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useTheme } from "vuetify";
import { Routes } from "@/router/routes";
import { userHasPermission } from "../utils/user-has-permission";
import { useUserStore } from "../stores/use-user-store";
import { storeToRefs } from "pinia";
import { UserPermission } from "../models/user-permissions";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();
const { isLoggedIn, activeUser } = storeToRefs(userStore);

const theme = useTheme();
const isDarkTheme = computed({
    get() {
        return theme.current.value.dark;
    },
    set() {
        theme.toggle();
    },
});

const isSidebarOpen = ref(false);
const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

const showMyVacations = computed(() => {
    if (!isLoggedIn.value || !activeUser.value) return false;

    return userHasPermission(activeUser.value, UserPermission.ViewPersonalVacations);
});

const showPendingVacations = computed(() => {
    if (!isLoggedIn.value || !activeUser.value) return false;

    return userHasPermission(activeUser.value, UserPermission.ViewPendingVacations);
});

const showApprovedRejectedVacations = computed(() => {
    if (!isLoggedIn.value || !activeUser.value) return false;

    return userHasPermission(activeUser.value, UserPermission.ViewApprovedRejectedVacations);
});

const logout = () => {
    userStore.logOut();
    router.push({ name: Routes.Login });
};
</script>
