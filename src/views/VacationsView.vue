<template>
    <v-app-bar class="pr-4" border>
        <template v-slot:prepend>
            <v-app-bar-nav-icon />
        </template>
        <template v-slot:append>
            <v-switch
                hide-details
                inset
                @change="toggleTheme"
                false-icon="mdi-white-balance-sunny"
                true-icon="mdi-weather-night"
            />
        </template>
    </v-app-bar>
    <h1>Main</h1>
</template>

<script setup lang="ts">
import { useTheme } from "vuetify";

const theme = useTheme();

const toggleTheme = () => {
    theme.toggle();
};
</script>
