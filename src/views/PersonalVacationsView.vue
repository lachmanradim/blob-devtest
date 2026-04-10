<template>
    <NewVacationRequest v-if="canCreateRequest" />
    <VacationsTable
        v-if="canViewPersonalRequests"
        title="Moje žádosti"
        :is-loading
        :items="userUnresolvedVacations"
        hide-search
        hide-name-column
        hide-reject-reason
        hide-status-column
    />
    <VacationsTable
        v-if="canViewPersonalRequests"
        title="Moje rozhodnuté žádosti"
        :is-loading
        :items="userResolvedVacations"
        hide-search
        hide-actions-column
        hide-name-column
    />
</template>

<script lang="ts" setup>
import NewVacationRequest from "@/vacations/components/NewVacationRequest.vue";
import VacationsTable from "@/vacations/components/VacationsTable.vue";
import { useVacationsStore } from "@/vacations/stores/use-vacations-store";
import { storeToRefs } from "pinia";
import { userHasPermission } from "@/shared/utils/user-has-permission";
import { UserPermission } from "@/shared/models/user-permissions";

const vacationsStore = useVacationsStore();
const { userUnresolvedVacations, userResolvedVacations, isLoading } = storeToRefs(vacationsStore);

const canCreateRequest = userHasPermission(UserPermission.CreateRequest);
const canViewPersonalRequests = userHasPermission(UserPermission.ViewPersonalVacations);
</script>
