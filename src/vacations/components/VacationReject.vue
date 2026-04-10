<template>
    <VDialog v-model="isDialogOpen" max-width="500">
        <VConfirmEdit
            ok-text="Zamítnout žádost"
            :disabled="confirmDisabledButtons"
            @cancel="closeDialog"
            @save="rejectVacationRequest"
        >
            <template #default="{ actions }">
                <VCard title="Zamítnout žádost" rounded="xl">
                    <VCardText>
                        <VTextField
                            v-model="rejectReason"
                            label="Důvod zamítnutí"
                            variant="outlined"
                        />
                    </VCardText>

                    <template #actions>
                        <VSpacer />
                        <component :is="actions"></component>
                    </template>
                </VCard>
            </template>
        </VConfirmEdit>
    </VDialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useVacationsStore } from "@/vacations/stores/use-vacations-store";
import { useSnackbarStore } from "@/shared/stores/use-snackbar-store";
import { SnackbarMessageType } from "@/shared/models/snackbar-message";

const vacationsStore = useVacationsStore();
const snackbarStore = useSnackbarStore();

const activeVacationId = defineModel<number | null>();
const isDialogOpen = ref(false);
const rejectReason = ref<string>("");

const confirmDisabledButtons = computed<boolean | ("save" | "cancel")[]>(() => {
    if (!rejectReason.value.length) return ["save"];

    return false;
});

const closeDialog = () => {
    activeVacationId.value = null;
    rejectReason.value = "";
    isDialogOpen.value = false;
};

const rejectVacationRequest = () => {
    if (!activeVacationId.value) return;

    vacationsStore.rejectVacationRequest(activeVacationId.value, rejectReason.value);
    snackbarStore.showMessage("Žádost zamítnuta", undefined, SnackbarMessageType.Success);
    closeDialog();
};

watch(activeVacationId, (newValue) => {
    isDialogOpen.value = newValue !== null;
});
</script>
