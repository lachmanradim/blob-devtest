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
                            autocomplete="off"
                        />
                        <VSelect
                            v-model="roleField.value.value"
                            :error-messages="roleField.errorMessage.value"
                            label="Přihlásit jako"
                            :items="comboboxOptions"
                            variant="outlined"
                            rounded="pill"
                            autocomplete="off"
                        ></VSelect>
                        <VBtn
                            color="primary"
                            class="mt-4 align-self-end"
                            type="submit"
                            :disabled="!meta.valid || !meta.dirty"
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
import { mixed, object, string } from "yup";
import { useSnackbarStore } from "@/shared/stores/use-snackbar-store";
import { SnackbarMessageType } from "@/shared/models/snackbar-message";
import { Routes } from "@/router/routes";
import { UserRole } from "@/shared/models/user-role";
import { useUserStore } from "@/shared/stores/use-user-store";
import { userHasPermission } from "@/shared/utils/user-has-permission";
import { UserPermission } from "@/shared/models/user-permissions";

const router = useRouter();
const snackbarStore = useSnackbarStore();
const userStore = useUserStore();

const { handleSubmit, meta } = useForm({
    validationSchema: object({
        login: string().min(5, "Login musí mít alespoň 5 znaků").required("Login je povinný"),
        role: mixed<UserRole>().oneOf(Object.values(UserRole)).required("Role je povinná"),
    }),
});

const loginField = useField<string>("login");
const roleField = useField<UserRole>("role");

const comboboxOptions = [
    { title: "Zaměstnanec", value: UserRole.Employee },
    { title: "Admin", value: UserRole.Admin },
];

const submitLogin = handleSubmit((values) => {
    userStore.logIn(values.login, values.role);
    snackbarStore.showMessage("Přihlášení úspěšné!", "", SnackbarMessageType.Success);

    if (userHasPermission(UserPermission.ViewPendingVacations)) {
        router.push({ name: Routes.PendingVacations });
    } else if (userHasPermission(UserPermission.ViewPersonalVacations)) {
        router.push({ name: Routes.PersonalVacations });
    }
});
</script>
