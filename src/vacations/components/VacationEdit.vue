<template>
    <VDialog v-model="isDialogOpen" max-width="500">
        <VCard rounded="xl">
            <VCardTitle class="d-flex align-center justify-space-between pt-4 px-6">
                Upravit žádost
                <VBtn icon="mdi-close" size="small" @click="closeDialog" />
            </VCardTitle>
            <VCardText>
                <form class="mt-4 d-flex flex-column" @submit.prevent="editRequest">
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
                    ></VDatePicker>
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
                    ></VSelect>
                    <VTextField
                        v-model="commentaryField.value.value"
                        :error-messages="commentaryField.errorMessage.value"
                        label="Komentář"
                        variant="outlined"
                        autocomplete="off"
                        class="mb-1"
                    ></VTextField>
                    <VBtn
                        :disabled="!meta.valid || !meta.dirty"
                        color="primary"
                        variant="flat"
                        block
                        type="submit"
                    >
                        Upravit žádost
                    </VBtn>
                </form>
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
import { VacationType } from "../models/vacation";
import { useField, useForm } from "vee-validate";
import { array, date, mixed, object, string } from "yup";
import { useUserStore } from "@/shared/stores/use-user-store";

const vacationsStore = useVacationsStore();
const { userUnresolvedVacations } = storeToRefs(vacationsStore);
const snackbarStore = useSnackbarStore();
const userStore = useUserStore();
const { activeUser } = storeToRefs(userStore);

const activeVacationId = defineModel<number | null>();
const isDialogOpen = ref(false);

const activeVacation = computed(() => {
    return userUnresolvedVacations.value.find((v) => v.id === activeVacationId.value) || null;
});

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

const closeDialog = () => {
    activeVacationId.value = null;
    isDialogOpen.value = false;
};

const editRequest = handleSubmit((values) => {
    if (!activeUser.value || !activeVacationId.value || !values.type) return;

    vacationsStore.editVacationRequest(
        activeVacationId.value,
        values.dates[0],
        values.dates[1] ?? values.dates[0],
        values.type,
        values.commentary,
    );
    snackbarStore.showMessage("Žádost byla úspěšně upravena", "", SnackbarMessageType.Success);

    closeDialog();
});

watch(activeVacation, (vacation) => {
    if (vacation) {
        resetForm({
            values: {
                dates: [vacation.dateFrom, vacation.dateTo],
                type: vacation.type,
                commentary: vacation.commentary ?? "",
            },
        });
        isDialogOpen.value = true;
    } else {
        isDialogOpen.value = false;
    }
});

const minDate = new Date(Date.now() + 86400000);

const vacationTypes = [
    { title: "Dovolená", value: VacationType.Regular },
    { title: "Sick Day", value: VacationType.SickDay },
];
</script>
