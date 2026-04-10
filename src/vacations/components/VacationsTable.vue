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
                <VChip class="text-uppercase" size="small" label>
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
                        @click="approveVacation(item.id)"
                    />
                    <VBtn
                        v-if="isRejectAllowed"
                        v-tooltip:top="'Zamítnout'"
                        icon="mdi-close"
                        size="small"
                        color="red"
                        @click="openRejectDialog(item.id)"
                    />
                </div>
            </template>
        </VDataTable>
    </VCard>
    <VDialog v-if="areActionsVisible" v-model="isRejectDialogOpen" max-width="500">
        <VConfirmEdit
            ok-text="Zamítnout"
            :disabled="confirmDisabledButtons"
            @cancel="closeRejectDialog"
            @save="rejectVacation"
        >
            <template #default="{ actions }">
                <VCard title="Zamítnout žádost" rounded="xl">
                    <VCardText>
                        <VTextField
                            v-model="rejectReason"
                            label="Důvod zamítnutí"
                            variant="outlined"
                        ></VTextField>
                    </VCardText>

                    <template #actions>
                        <VSpacer></VSpacer>
                        <component :is="actions"></component>
                    </template>
                </VCard>
            </template>
        </VConfirmEdit>
    </VDialog>
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
import { computed, ref } from "vue";
import { useVacationsStore } from "@/vacations/stores/use-vacations-store";
import { useSnackbarStore } from "@/shared/stores/use-snackbar-store";
import { SnackbarMessageType } from "@/shared/models/snackbar-message";
import type { DataTableHeader } from "vuetify";

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

const isRejectDialogOpen = ref(false);
const activeVacationId = ref<number | null>(null);
const rejectReason = ref<string>("");

const confirmDisabledButtons = computed<boolean | ("save" | "cancel")[]>(() => {
    if (!rejectReason.value.length) return ["save"];

    return false;
});

const openRejectDialog = (vacationId: number) => {
    activeVacationId.value = vacationId;
    rejectReason.value = "";
    isRejectDialogOpen.value = true;
};

const closeRejectDialog = () => {
    activeVacationId.value = null;
    rejectReason.value = "";
    isRejectDialogOpen.value = false;
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

const vacationStatus = (status: string): string => {
    switch (status) {
        case "Pending":
            return "Čeká na schválení";
        case "Approved":
            return "Schváleno";
        case "Rejected":
            return "Zamítnuto";
        default:
            return "";
    }
};

const approveVacation = (vacationId: number) => {
    vacationsStore.approveVacation(vacationId);
    snackbarStore.showMessage("Dovolená schválena", "", SnackbarMessageType.Success);
};

const rejectVacation = () => {
    if (!activeVacationId.value) return;

    vacationsStore.rejectVacation(activeVacationId.value, rejectReason.value);
    snackbarStore.showMessage("Dovolená zamítnuta", "", SnackbarMessageType.Success);
    closeRejectDialog();
};

const isApproveAllowed = computed(() => {
    if (!activeUser.value) return false;

    return userHasPermission(activeUser.value, UserPermission.ApproveRequests);
});

const isRejectAllowed = computed(() => {
    if (!activeUser.value) return false;

    return userHasPermission(activeUser.value, UserPermission.RejectRequests);
});

const areActionsVisible = computed(() => {
    return !props.hideActionsColumn && (isApproveAllowed.value || isRejectAllowed.value);
});

const tableHeaders = computed(() => {
    const headers: DataTableHeader[] = [
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
