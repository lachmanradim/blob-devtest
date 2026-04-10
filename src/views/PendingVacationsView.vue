<template>
    <VacationsTable
        title="Žádosti ke schválení"
        :items="pendingVacations"
        :is-loading="isLoading"
        hide-reject-reason
        hide-status-column
    />
</template>

<script setup lang="ts">
import VacationsTable from "@/vacations/components/VacationsTable.vue";
import { useVacationsStore } from "@/vacations/stores/use-vacations-store";
import { storeToRefs } from "pinia";

const vacationsStore = useVacationsStore();
const { isLoading, pendingVacations } = storeToRefs(vacationsStore);
</script>
