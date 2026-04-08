<template>
    <v-snackbar-queue
        v-model="snackbarMessages"
        :total-visible="5"
        location="top"
        rounded="pill"
        closable
    >
        <template #actions="{ props }">
            <v-btn icon="$close" variant="text" v-bind="props" />
        </template>
    </v-snackbar-queue>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useSnackbarStore } from "@/shared/stores/use-snackbar-store";

const snackbarStore = useSnackbarStore();
const { snackbarMessages } = storeToRefs(snackbarStore);
</script>
