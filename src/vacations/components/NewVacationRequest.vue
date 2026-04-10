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
                <VForm>
                    <VDatePicker></VDatePicker>
                    <VDatePicker
                        hide-header
                        show-adjacent-months
                        width="100%"
                        border
                        rounded="xl"
                        class="mb-4"
                        multiple="range"
                        :min="minDate"
                    ></VDatePicker>
                    <VCombobox
                        label="Typ dovolené"
                        :items="vacationTypes"
                        variant="outlined"
                    ></VCombobox>
                    <VTextField label="Komentář" variant="outlined"></VTextField>
                </VForm>
            </VCardText>
        </VCard>
    </VDialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { VacationType } from "../models/vacation";

const isDialogOpen = ref(false);

const openDialog = () => {
    isDialogOpen.value = true;
};

const closeDialog = () => {
    isDialogOpen.value = false;
};

const minDate = new Date(Date.now() + 86400000);

const vacationTypes = [
    { title: "Dovolená", value: VacationType.Regular },
    { title: "Sick Day", value: VacationType.SickDay },
];
</script>
