import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import "@fontsource/roboto/100.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto/900.css";

import { createApp } from "vue";
import { createVuetify } from "vuetify";
import { cs } from "vuetify/locale";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

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
