<template>
    <VDialog v-model="isDialogOpen" max-width="500">
        <VCard rounded="xl">
            <VCardTitle class="d-flex align-center justify-space-between pt-4 px-6">
                Upravit žádost
                <VBtn icon="mdi-close" size="small" @click="closeDialog" />
            </VCardTitle>
            <VCardText>
                <VacationForm
                    submit-label="Upravit žádost"
                    :initial-values="formInitialValues"
                    @submit="editRequest"
                />
            </VCardText>
        </VCard>
    </VDialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useVacationsStore } from "@/vacations/stores/use-vacations-store";
import { useSnackbarStore } from "@/shared/stores/use-snackbar-store";
import { SnackbarMessageType } from "@/shared/models/snackbar-message";
import { storeToRefs } from "pinia";
import type { VacationType } from "@/vacations/models/vacation";
import VacationForm from "./VacationForm.vue";

const vacationsStore = useVacationsStore();
const { userUnresolvedVacations } = storeToRefs(vacationsStore);
const snackbarStore = useSnackbarStore();

const activeVacationId = defineModel<number | null>();
const isDialogOpen = ref(false);

const activeVacation = computed(
    () => userUnresolvedVacations.value.find((v) => v.id === activeVacationId.value) ?? null,
);

const formInitialValues = computed(() =>
    activeVacation.value
        ? {
              dates: [activeVacation.value.dateFrom, activeVacation.value.dateTo],
              type: activeVacation.value.type,
              commentary: activeVacation.value.commentary ?? "",
          }
        : undefined,
);

const closeDialog = () => {
    activeVacationId.value = null;
    isDialogOpen.value = false;
};

const editRequest = (values: { dates: Date[]; type: VacationType; commentary: string }) => {
    if (!activeVacationId.value) return;

    vacationsStore.editVacationRequest(
        activeVacationId.value,
        values.dates[0],
        values.dates[1] ?? values.dates[0],
        values.type,
        values.commentary,
    );
    snackbarStore.showMessage(
        "Žádost byla úspěšně upravena",
        undefined,
        SnackbarMessageType.Success,
    );

    closeDialog();
};

watch(activeVacation, (vacation) => {
    isDialogOpen.value = vacation !== null;
});
</script>
