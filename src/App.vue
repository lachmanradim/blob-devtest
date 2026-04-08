<template>
    <v-app>
        <v-main>
            <v-container class="fill-height">
                <v-row justify="center" class="fill-height">
                    <v-col cols="12" class="fill-height">
                        <router-view />
                    </v-col>
                </v-row>
            </v-container>
            <Snackbar />
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import Snackbar from "./shared/components/Snackbar.vue";
</script>

<style lang="scss">
@use "../styles/main";
</style>
