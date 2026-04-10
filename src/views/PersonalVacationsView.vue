<template>
    <NewVacationRequest />
    <VacationsTable
        title="Moje žádosti"
        :is-loading
        :items="userVacations"
        hide-search
        hide-name-column
        hide-reject-reason
        hide-status-column
    />
    <VacationsTable
        title="Moje rozhodnuté žádosti"
        :is-loading
        :items="userResolvedVacations"
        hide-search
        hide-name-column
    />
</template>

<script lang="ts" setup>
import NewVacationRequest from "@/vacations/components/NewVacationRequest.vue";
import VacationsTable from "@/vacations/components/VacationsTable.vue";
import { useVacationsStore } from "@/vacations/stores/use-vacations-store";
import { storeToRefs } from "pinia";

const vacationsStore = useVacationsStore();
const { userVacations, userResolvedVacations, isLoading } = storeToRefs(vacationsStore);
</script>
