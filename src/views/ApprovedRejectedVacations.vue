<template>
    <VacationsTable
        class="mb-4"
        title="Schválené žádosti"
        :items="approvedVacations"
        hide-footer
        hide-actions
    />
    <VacationsTable title="Zamítnuté žádosti" :items="rejectedVacations" hide-footer hide-actions />
</template>

<script setup lang="ts">
import VacationsTable from "@/vacations/pending-vacations/components/VacationsTable.vue";
import { useVacationsStore } from "@/vacations/stores/use-vacations-store";
import { storeToRefs } from "pinia";

const vacationsStore = useVacationsStore();
const { approvedVacations, rejectedVacations } = storeToRefs(vacationsStore);
</script>
