<template>
    <VCard border rounded="xl" class="pt-2">
        <VCardTitle class="d-flex align-center pl-8 pr-8">
            {{ title }}
            <template v-if="searchable">
                <VSpacer></VSpacer>
                <VTextField
                    :model-value="search"
                    density="compact"
                    label="Vyhledat podle jména"
                    prepend-inner-icon="mdi-magnify"
                    variant="solo-filled"
                    flat
                    hide-details
                    single-line
                    @update:model-value="onSearchChange"
                ></VTextField>
            </template>
        </VCardTitle>
        <VDataTable
            v-model:search="search"
            class="mt-2"
            :search-fields="['employeeName']"
            :header-props="{ class: 'bg-surface-light font-weight-bold' }"
            :headers="tableHeaders"
            :items
            striped="even"
            :loading
            :hide-default-footer="hideFooter"
        >
            <template #item.dateFrom="{ item }"> {{ formatDate(item.dateFrom) }} </template>
            <template #item.dateTo="{ item }"> {{ formatDate(item.dateTo) }} </template>
            <template #item.dateCreated="{ item }"> {{ formatDate(item.dateCreated) }} </template>
            <template #item.type="{ item }">
                <VChip class="text-uppercase" size="small" label>
                    {{ vacationType(item.type) }}
                </VChip>
            </template>
            <template v-if="showActions" #item.actions="{ item }">
                <div class="d-flex align-center ga-1">
                    <VBtn
                        v-if="isApproveAllowed"
                        v-tooltip:top="'Schválit'"
                        icon="mdi-check"
                        size="small"
                        color="green"
                        @click="approve(item.id)"
                    />
                    <VBtn
                        v-if="isRejectAllowed"
                        v-tooltip:top="'Zamítnout'"
                        icon="mdi-close"
                        size="small"
                        color="red"
                        @click="reject(item.id)"
                    />
                </div>
            </template>
        </VDataTable>
    </VCard>
</template>

<script lang="ts" setup>
import { useField } from "vee-validate";
import * as yup from "yup";
import type { Vacation } from "@/vacations/models/vacation";
import { VacationType } from "@/vacations/models/vacation";
import { formatDate } from "@/shared/utils/date-time-utils";
import { userHasPermission } from "@/shared/utils/user-has-permission";
import { useUserStore } from "@/shared/stores/use-user-store";
import { storeToRefs } from "pinia";
import { UserPermission } from "@/shared/models/user-permissions";
import { computed } from "vue";
import { useVacationsStore } from "@/vacations/stores/use-vacations-store";

const props = withDefaults(
    defineProps<{
        title: string;
        items: Vacation[];
        searchable?: boolean;
        loading?: boolean;
        hideFooter?: boolean;
        hideActions?: boolean;
    }>(),
    {
        searchable: false,
        loading: false,
        hideFooter: false,
        hideActions: false,
    },
);

const userStore = useUserStore();
const { activeUser } = storeToRefs(userStore);
const vacationsStore = useVacationsStore();

const searchSchema = yup
    .string()
    .trim()
    .transform((val: string) => (val ? val.replace(/\s+/g, " ") : val));

const { value: search, handleChange } = useField<string>("search", searchSchema, {
    initialValue: "",
});

function onSearchChange(val: string | null) {
    const normalized = searchSchema.cast(val ?? "");
    handleChange(normalized ?? "", false);
}

const vacationType = (type: VacationType): string => {
    switch (type) {
        case VacationType.Regular:
            return "Dovolená";
        case VacationType.SickDay:
            return "Sick day";
        default:
            return "";
    }
};

const isApproveAllowed = computed(() => {
    if (!activeUser.value) return false;

    return userHasPermission(activeUser.value, UserPermission.ApproveRequests);
});

const isRejectAllowed = computed(() => {
    if (!activeUser.value) return false;

    return userHasPermission(activeUser.value, UserPermission.RejectRequests);
});

const showActions = computed(() => {
    return !props.hideActions && (isApproveAllowed.value || isRejectAllowed.value);
});

const approve = (vacationId: number) => {
    vacationsStore.approveVacation(vacationId);
};

const reject = (vacationId: number) => {
    vacationsStore.rejectVacation(vacationId);
};

const tableHeaders = computed(() => {
    const headers = [
        { title: "Jméno", value: "employeeName", key: "employeeName" },
        { title: "Datum od", value: "dateFrom", key: "dateFrom", width: "160px" },
        { title: "Datum do", value: "dateTo", key: "dateTo", width: "160px" },
        { title: "Datum vytvoření", value: "dateCreated", key: "dateCreated", width: "168px" },
        { title: "Typ", value: "type", key: "type", sortable: false, width: "100px" },
        {
            title: "Komentář",
            value: "commentary",
            key: "commentary",
            sortable: false,
            width: "320px",
        },
    ];

    if (showActions.value) {
        headers.push({
            title: "Akce",
            value: "actions",
            key: "actions",
            sortable: false,
            width: "120px",
        });
    }

    return headers;
});
</script>
