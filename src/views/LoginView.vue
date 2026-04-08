<template>
    <v-container class="fill-height d-flex align-center">
        <v-row justify="center">
            <v-col cols="4">
                <v-card border class="pa-6" rounded="xl">
                    <v-card-title class="pa-0"> Dovolenkátor </v-card-title>
                    <form @submit.prevent="submitLogin" class="mt-4 d-flex flex-column">
                        <v-text-field
                            v-model.trim="loginField.value.value"
                            :error-messages="loginField.errorMessage.value"
                            type="text"
                            name="login"
                            label="Login"
                            rounded="pill"
                            variant="outlined"
                        />
                        <v-btn
                            color="primary"
                            class="mt-4 align-self-end"
                            type="submit"
                            :disabled="!meta.valid"
                            rounded="pill"
                            size="large"
                        >
                            Přihlásit
                        </v-btn>
                    </form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
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
    router.push({ name: Routes.Vacations });
});
</script>
