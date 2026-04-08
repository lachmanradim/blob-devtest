import { defineStore } from "pinia";
import { ref } from "vue";
import { SnackbarQueueMessage } from "vuetify";
import { SnackbarMessageType } from "@/shared/models/snackbar-message";

export const useSnackbarStore = defineStore("snackbar", () => {
    const snackbarMessages = ref<SnackbarQueueMessage[]>([]);

    const showMessage = (
        title?: string | undefined,
        text?: string | undefined,
        type: SnackbarMessageType = SnackbarMessageType.Default,
        timeout = 2000,
    ) => {
        const color = type === SnackbarMessageType.Default ? undefined : type;
        const icon = type === SnackbarMessageType.Default ? undefined : `$${type}`;

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
