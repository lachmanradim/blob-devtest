import { createRouter, createWebHistory } from "vue-router";
import { Routes } from "./routes";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            name: Routes.Login,
            path: "/",
            component: () => import("@/views/LoginView.vue"),
        },
        {
            path: "/",
            component: () => import("@/layouts/MainLayout.vue"),
            children: [
                {
                    name: Routes.Vacations,
                    path: "/dovolene",
                    component: () => import("@/views/VacationsView.vue"),
                },
            ],
        },
        {
            name: Routes.NotFound,
            path: "/:pathMatch(.*)*",
            component: () => import("@/views/NotFound.vue"),
        },
    ],
});

export default router;
