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
                <form class="mt-4 d-flex flex-column" @submit.prevent="submitRequest">
                    <VDatePicker
                        v-model="datesField.value.value"
                        hide-header
                        show-adjacent-months
                        width="100%"
                        :border="datesField.errorMessage.value ? 'error sm' : 'opacity-25 sm'"
                        rounded="xl"
                        class="mb-1"
                        multiple="range"
                        :min="minDate"
                    />
                    <div
                        v-if="datesField.errorMessage.value"
                        class="text-error text-caption mb-4 ml-4"
                    >
                        {{ datesField.errorMessage.value }}
                    </div>
                    <div v-else class="mb-4"></div>
                    <VSelect
                        v-model="typeField.value.value"
                        :error-messages="typeField.errorMessage.value"
                        label="Typ dovolené"
                        :items="vacationTypes"
                        variant="outlined"
                        class="mb-1"
                    />
                    <VTextField
                        v-model="commentaryField.value.value"
                        :error-messages="commentaryField.errorMessage.value"
                        label="Komentář"
                        variant="outlined"
                        autocomplete="off"
                        class="mb-1"
                    />
                    <VBtn
                        :disabled="!meta.valid || !meta.dirty"
                        color="primary"
                        variant="flat"
                        block
                        type="submit"
                    >
                        Odeslat žádost
                    </VBtn>
                </form>
            </VCardText>
        </VCard>
    </VDialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { VacationStatus, VacationType } from "../models/vacation";
import { useField, useForm } from "vee-validate";
import { array, date, mixed, object, string } from "yup";
import { useVacationsStore } from "../stores/use-vacations-store";
import { useUserStore } from "@/shared/stores/use-user-store";
import { storeToRefs } from "pinia";
import { useSnackbarStore } from "@/shared/stores/use-snackbar-store";
import { SnackbarMessageType } from "@/shared/models/snackbar-message";

const vacationsStore = useVacationsStore();
const userStore = useUserStore();
const { activeUser } = storeToRefs(userStore);
const snackbarStore = useSnackbarStore();

const isDialogOpen = ref(false);

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const minDate = new Date(Date.now() + ONE_DAY_MS);

const vacationTypes = [
    { title: "Dovolená", value: VacationType.Regular },
    { title: "Sick Day", value: VacationType.SickDay },
];

const { handleSubmit, meta, resetForm } = useForm({
    validationSchema: object({
        dates: array().of(date()).min(1, "Datum je povinné").required("Datum je povinné"),
        type: mixed<VacationType>()
            .oneOf(Object.values(VacationType))
            .required("Typ dovolené je povinný"),
        commentary: string(),
    }),
});

const datesField = useField<Date[]>("dates");
const typeField = useField<VacationType>("type");
const commentaryField = useField<string>("commentary");

const openDialog = () => {
    isDialogOpen.value = true;
};

const closeDialog = () => {
    resetForm();
    isDialogOpen.value = false;
};

const submitRequest = handleSubmit((values) => {
    if (!activeUser.value) return;

    vacationsStore.createVacationRequest(
        new Date(),
        values.dates[0],
        values.dates[1] ?? values.dates[0],
        values.type,
        VacationStatus.Pending,
        values.commentary,
        activeUser.value.employeeId,
        activeUser.value.username,
    );
    snackbarStore.showMessage(
        "Žádost byla úspěšně vytvořena",
        undefined,
        SnackbarMessageType.Success,
    );

    closeDialog();
});
</script>
