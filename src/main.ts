import { createApp } from "vue";
import { createVuetify } from "vuetify";
import App from "./App.vue";
import router from "./router";

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

const vuetify = createVuetify({
    theme: {
        defaultTheme: "light",
    },
});

createApp(App).use(vuetify).use(router).mount("#app");
