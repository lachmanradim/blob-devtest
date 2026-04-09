import { createApp } from "vue";
import { createVuetify } from "vuetify";
import { cs } from "vuetify/locale";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

const vuetify = createVuetify({
    locale: {
        locale: "cs",
        messages: { cs },
    },
    theme: {
        defaultTheme: "system",
    },
    defaults: {
        global: {
            flat: true,
            elevation: 0,
        },
        VBtn: {
            rounded: "pill",
            size: "large",
        },
        VListItem: {
            rounded: "pill",
        },
        VField: {
            rounded: "pill",
        },
    },
});

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(vuetify);
app.use(pinia);
app.mount("#app");
