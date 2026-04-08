<template>
    <VAppBar class="pr-4" border>
        <template v-slot:prepend>
            <VAppBarNavIcon @click="toggleSidebar" />
        </template>
        <VAppBarTitle>Dovolenkátor</VAppBarTitle>
    </VAppBar>
    <VNavigationDrawer v-model="isSidebarOpen" temporary class="pa-2" width="280">
        <VList>
            <VListItem prepend-icon="mdi-plus" title="Nová žádost" />
            <VListItem prepend-icon="mdi-table-alert" title="Žádosti ke schválení" />
        </VList>
        <template #append>
            <VList>
                <VListItem title="Tmavý režim">
                    <template #append>
                        <VListItemAction>
                            <VSwitch
                                id="dark-theme-switch"
                                hide-details
                                inset
                                v-model="isDarkTheme"
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
                />
            </VList>
        </template>
    </VNavigationDrawer>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useTheme } from "vuetify";
import { Routes } from "@/router/routes";

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
</script>
