<template>
    <VacationsTable
        title="Schválené žádosti"
        :items="approvedVacations"
        hide-search
        hide-actions-column
        hide-reject-reason
        hide-status-column
        :is-loading
    />
    <VacationsTable
        title="Zamítnuté žádosti"
        :items="rejectedVacations"
        hide-search
        hide-actions-column
        hide-status-column
        :is-loading
    />
</template>

<script setup lang="ts">
import VacationsTable from "@/vacations/components/VacationsTable.vue";
import { useVacationsStore } from "@/vacations/stores/use-vacations-store";
import { storeToRefs } from "pinia";

const vacationsStore = useVacationsStore();
const { approvedVacations, rejectedVacations, isLoading } = storeToRefs(vacationsStore);
</script>
