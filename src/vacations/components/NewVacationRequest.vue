<template>
    <VCard border rounded="pill" class="pa-3 mb-6">
        <VBtn variant="outlined" prepend-icon="mdi-plus" @click="openDialog"> Nová žádost </VBtn>
    </VCard>
    <VDialog v-model="isDialogOpen" max-width="500">
        <VCard rounded="xl">
            <VCardTitle class="d-flex align-center justify-space-between pt-4 px-6">
                Žádost o dovolenou
                <VBtn icon="mdi-close" size="small" @click="closeDialog" />
            </VCardTitle>
            <VCardText>
                <VacationForm ref="formRef" submit-label="Odeslat žádost" @submit="submitRequest" />
            </VCardText>
        </VCard>
    </VDialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { VacationType } from "../models/vacation";
import { useVacationsStore } from "../stores/use-vacations-store";
import { useUserStore } from "@/shared/stores/use-user-store";
import { storeToRefs } from "pinia";
import { useSnackbarStore } from "@/shared/stores/use-snackbar-store";
import { SnackbarMessageType } from "@/shared/models/snackbar-message";
import VacationForm from "./VacationForm.vue";

const vacationsStore = useVacationsStore();
const userStore = useUserStore();
const { activeUser } = storeToRefs(userStore);
const snackbarStore = useSnackbarStore();

const isDialogOpen = ref(false);
const formRef = ref<InstanceType<typeof VacationForm> | null>(null);

const openDialog = () => {
    isDialogOpen.value = true;
};

const closeDialog = () => {
    formRef.value?.resetForm();
    isDialogOpen.value = false;
};

const submitRequest = (values: { dates: Date[]; type: VacationType; commentary: string }) => {
    if (!activeUser.value) return;

    vacationsStore.createVacationRequest({
        dateFrom: values.dates[0],
        dateTo: values.dates[1] ?? values.dates[0],
        type: values.type,
        commentary: values.commentary,
        employeeId: activeUser.value.employeeId,
        employeeName: activeUser.value.username,
    });
    snackbarStore.showMessage(
        "Žádost byla úspěšně vytvořena",
        undefined,
        SnackbarMessageType.Success,
    );

    closeDialog();
};
</script>
