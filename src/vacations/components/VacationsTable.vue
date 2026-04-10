<template>
    <VCard border rounded="xl" class="pt-2 mb-4">
        <VCardTitle class="d-flex align-center pl-8 pr-8">
            {{ title }}
            <template v-if="!hideSearch">
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
            :header-props="{ class: 'bg-surface-light' }"
            :headers="tableHeaders"
            :items
            striped="even"
            :loading="isLoading"
        >
            <template #item.dateFrom="{ item }"> {{ formatDate(item.dateFrom) }} </template>
            <template #item.dateTo="{ item }"> {{ formatDate(item.dateTo) }} </template>
            <template #item.dateCreated="{ item }"> {{ formatDate(item.dateCreated) }} </template>
            <template #item.type="{ item }">
                <VChip class="text-uppercase" size="small" label>
                    {{ vacationType(item.type) }}
                </VChip>
            </template>
            <template v-if="!hideStatusColumn" #item.status="{ item }">
                <VChip
                    class="text-uppercase"
                    size="small"
                    label
                    :color="vacationStatusColor(item.status)"
                >
                    {{ vacationStatus(item.status) }}
                </VChip>
            </template>
            <template v-if="areActionsVisible" #item.actions="{ item }">
                <div class="d-flex align-center ga-1">
                    <VBtn
                        v-if="isApproveAllowed"
                        v-tooltip:top="'Schválit'"
                        icon="mdi-check"
                        size="small"
                        color="green"
                        @click="approveVacationRequest(item.id)"
                    />
                    <VBtn
                        v-if="isRejectAllowed"
                        v-tooltip:top="'Zamítnout'"
                        icon="mdi-close"
                        size="small"
                        color="red"
                        @click="openRejectDialog(item.id)"
                    />
                    <VBtn
                        v-if="isEditAllowed"
                        v-tooltip:top="'Upravit'"
                        icon="mdi-pencil"
                        size="small"
                        color="blue"
                        @click="openEditDialog(item.id)"
                    />
                    <VBtn
                        v-if="isCancelAllowed"
                        v-tooltip:top="'Zrušit'"
                        icon="mdi-close"
                        size="small"
                        color="red"
                        @click="cancelVacationRequest(item.id)"
                    />
                </div>
            </template>
        </VDataTable>
    </VCard>
    <VacationReject v-if="isRejectAllowed" v-model="rejectVacationRequestId" />
    <VacationEdit v-if="isEditAllowed" v-model="editVacationId" />
</template>

<script lang="ts" setup>
import { useField } from "vee-validate";
import * as yup from "yup";
import { type Vacation, VacationStatus } from "@/vacations/models/vacation";
import { VacationType } from "@/vacations/models/vacation";
import { formatDate } from "@/shared/utils/date-time-utils";
import { userHasPermission } from "@/shared/utils/user-has-permission";
import { useUserStore } from "@/shared/stores/use-user-store";
import { storeToRefs } from "pinia";
import { UserPermission } from "@/shared/models/user-permissions";
import { computed, ref } from "vue";
import { useVacationsStore } from "@/vacations/stores/use-vacations-store";
import { useSnackbarStore } from "@/shared/stores/use-snackbar-store";
import { SnackbarMessageType } from "@/shared/models/snackbar-message";
import type { DataTableHeader } from "vuetify";
import VacationReject from "./VacationReject.vue";
import VacationEdit from "./VacationEdit.vue";

const props = withDefaults(
    defineProps<{
        title: string;
        items: Vacation[];
        isLoading?: boolean;
        hideSearch?: boolean;
        hideNameColumn?: boolean;
        hideActionsColumn?: boolean;
        hideStatusColumn?: boolean;
        hideRejectReason?: boolean;
    }>(),
    {
        isLoading: false,
        hideSearch: false,
        hideNameColumn: false,
        hideActionsColumn: false,
        hideStatusColumn: false,
        hideRejectReason: false,
    },
);

const userStore = useUserStore();
const { activeUser } = storeToRefs(userStore);
const vacationsStore = useVacationsStore();
const snackbarStore = useSnackbarStore();

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

const rejectVacationRequestId = ref<number | null>(null);
const openRejectDialog = (vacationId: number) => {
    rejectVacationRequestId.value = vacationId;
};

const editVacationId = ref<number | null>(null);
const openEditDialog = (vacationId: number) => {
    editVacationId.value = vacationId;
};

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

const vacationStatusColor = (status: VacationStatus): string => {
    switch (status) {
        case VacationStatus.Pending:
            return "orange";
        case VacationStatus.Approved:
            return "green";
        case VacationStatus.Rejected:
            return "red";
        default:
            return "";
    }
};
const vacationStatus = (status: VacationStatus): string => {
    switch (status) {
        case VacationStatus.Pending:
            return "Čeká na schválení";
        case VacationStatus.Approved:
            return "Schváleno";
        case VacationStatus.Rejected:
            return "Zamítnuto";
        default:
            return "";
    }
};

const approveVacationRequest = (vacationId: number) => {
    vacationsStore.approveVacationRequest(vacationId);
    snackbarStore.showMessage("Žádost schválena", "", SnackbarMessageType.Success);
};

const cancelVacationRequest = (vacationId: number) => {
    vacationsStore.cancelVacationRequest(vacationId);
    snackbarStore.showMessage("Žádost zrušena", "", SnackbarMessageType.Success);
};

const isApproveAllowed = computed(() => {
    if (!activeUser.value) return false;

    return userHasPermission(UserPermission.ApproveRequests);
});

const isRejectAllowed = computed(() => {
    if (!activeUser.value) return false;

    return userHasPermission(UserPermission.RejectRequests);
});

const isEditAllowed = computed(() => {
    if (!activeUser.value) return false;

    return userHasPermission(UserPermission.EditRequest);
});

const isCancelAllowed = computed(() => {
    if (!activeUser.value) return false;

    return userHasPermission(UserPermission.CancelRequest);
});

const areActionsVisible = computed(() => {
    return (
        !props.hideActionsColumn &&
        (isApproveAllowed.value ||
            isRejectAllowed.value ||
            isEditAllowed.value ||
            isCancelAllowed.value)
    );
});

const tableHeaders = computed(() => {
    const headers: DataTableHeader[] = [
        { title: "Datum od", value: "dateFrom", key: "dateFrom", width: "120px" },
        { title: "Datum do", value: "dateTo", key: "dateTo", width: "120px" },
        { title: "Datum vytvoření", value: "dateCreated", key: "dateCreated", width: "160px" },
        { title: "Typ", value: "type", key: "type", sortable: false, width: "100px" },
        {
            title: "Komentář",
            value: "commentary",
            key: "commentary",
            sortable: false,
            width: "320px",
        },
    ];

    if (!props.hideNameColumn) {
        headers.unshift({ title: "Jméno", value: "employeeName", key: "employeeName" });
    }

    if (!props.hideStatusColumn) {
        headers.push({
            title: "Stav",
            value: "status",
            key: "status",
            width: "120px",
        });
    }

    if (areActionsVisible.value) {
        headers.push({
            title: "Akce",
            value: "actions",
            key: "actions",
            sortable: false,
            width: "120px",
        });
    }

    if (!props.hideRejectReason) {
        headers.push({
            title: "Důvod zamítnutí",
            value: "rejectReason",
            key: "rejectReason",
            sortable: false,
            width: "320px",
        });
    }

    return headers;
});
</script>
