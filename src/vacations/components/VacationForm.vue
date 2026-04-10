<template>
    <form class="mt-4 d-flex flex-column" @submit.prevent="onSubmit">
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
        <div v-if="datesField.errorMessage.value" class="text-error text-caption mb-4 ml-4">
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
            {{ submitLabel }}
        </VBtn>
    </form>
</template>

<script lang="ts" setup>
import { watch } from "vue";
import { useField, useForm } from "vee-validate";
import { array, date, mixed, object, string } from "yup";
import { VacationType } from "../models/vacation";

const props = defineProps<{
    submitLabel: string;
    initialValues?: {
        dates: Date[];
        type: VacationType;
        commentary: string;
    };
}>();

const emit = defineEmits<{
    submit: [values: { dates: Date[]; type: VacationType; commentary: string }];
}>();

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const minDate = new Date(Date.now() + ONE_DAY_MS);

const vacationTypes = [
    { title: "Dovolená", value: VacationType.Regular },
    { title: "Sick Day", value: VacationType.SickDay },
];

const { handleSubmit, meta, resetForm } = useForm<{
    dates: Date[];
    type: VacationType;
    commentary: string;
}>({
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

const onSubmit = handleSubmit((values) => {
    emit("submit", {
        dates: values.dates as Date[],
        type: values.type as VacationType,
        commentary: values.commentary ?? "",
    });
});

watch(
    () => props.initialValues,
    (vals) => {
        if (vals) {
            resetForm({ values: vals });
        } else {
            resetForm();
        }
    },
    { immediate: true },
);

defineExpose({ resetForm });
</script>
