<template>
    <VContainer class="fill-height d-flex align-center">
        <VRow justify="center">
            <VCol cols="4">
                <VCard border class="pa-6" rounded="xl">
                    <VCardTitle class="pa-0"> Dovolenkátor </VCardTitle>
                    <form class="mt-4 d-flex flex-column" @submit.prevent="submitLogin">
                        <VTextField
                            v-model.trim="loginField.value.value"
                            :error-messages="loginField.errorMessage.value"
                            type="text"
                            name="login"
                            label="Login"
                            rounded="pill"
                            variant="outlined"
                        />
                        <VBtn
                            color="primary"
                            class="mt-4 align-self-end"
                            type="submit"
                            :disabled="!meta.valid"
                        >
                            Přihlásit
                        </VBtn>
                    </form>
                </VCard>
            </VCol>
        </VRow>
    </VContainer>
</template>

<script lang="ts" setup>
import { useField, useForm } from "vee-validate";
import { useRouter } from "vue-router";
import { object, string } from "yup";
import { useSnackbarStore } from "@/shared/stores/use-snackbar-store";
import { SnackbarMessageType } from "@/shared/models/snackbar-message";
import { Routes } from "@/router/routes";

const router = useRouter();
const snackbarStore = useSnackbarStore();

const { handleSubmit, meta } = useForm({
    validationSchema: object({
        login: string().required("Login je povinný"),
    }),
});

const loginField = useField("login");

const submitLogin = handleSubmit(() => {
    snackbarStore.showMessage("Přihlášení úspěšné!", undefined, SnackbarMessageType.Success);
    router.push({ name: Routes.PendingVacations });
});
</script>
