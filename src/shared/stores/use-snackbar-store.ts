import { defineStore } from "pinia";
import { ref } from "vue";
import { SnackbarQueueMessage } from "vuetify";
import { SnackbarMessageType } from "@/shared/models/snackbar-message";

export const useSnackbarStore = defineStore("snackbar", () => {
    const snackbarMessages = ref<SnackbarQueueMessage[]>([]);

    const showMessage = (
        title?: string,
        text?: string,
        type: SnackbarMessageType = SnackbarMessageType.Default,
        timeout = 2000,
    ) => {
        const isDefault = type === SnackbarMessageType.Default;
        const color = isDefault ? undefined : type;
        const icon = isDefault ? undefined : `$${type}`;

        snackbarMessages.value.push({
            title,
            text,
            color,
            prependIcon: icon,
            timeout,
        });
    };

    return { snackbarMessages, showMessage };
});
