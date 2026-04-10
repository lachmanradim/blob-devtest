import { createRouter, createWebHistory } from "vue-router";
import { UserPermission } from "@/shared/models/user-permissions";
import { userHasPermission } from "@/shared/utils/user-has-permission";
import { useUserStore } from "@/shared/stores/use-user-store";
import { Routes } from "./routes";

declare module "vue-router" {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface RouteMeta {
        requiredPermission?: UserPermission;
    }
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            redirect: { name: Routes.Login },
        },
        {
            name: Routes.Login,
            path: "/prihlaseni",
            component: () => import("@/views/LoginView.vue"),
        },
        {
            path: "/",
            component: () => import("@/layouts/MainLayout.vue"),
            children: [
                {
                    name: Routes.PendingVacations,
                    path: "/dovolene",
                    component: () => import("@/views/PendingVacationsView.vue"),
                    meta: { requiredPermission: UserPermission.ViewPendingVacations },
                },
                {
                    name: Routes.ApprovedRejectedVacations,
                    path: "/dovolene/schvalene-zamitnute",
                    component: () => import("@/views/ApprovedRejectedVacations.vue"),
                    meta: { requiredPermission: UserPermission.ViewApprovedRejectedVacations },
                },
                {
                    name: Routes.PersonalVacations,
                    path: "/dovolene/moje",
                    component: () => import("@/views/PersonalVacationsView.vue"),
                    meta: { requiredPermission: UserPermission.ViewPersonalVacations },
                },
            ],
        },
        {
            name: Routes.NotFound,
            path: "/:pathMatch(.*)*",
            component: () => import("@/views/NotFoundView.vue"),
        },
    ],
});

router.beforeEach((to) => {
    const userStore = useUserStore();
    const requiredPermission = to.meta.requiredPermission;

    if (!requiredPermission) {
        return true;
    }

    if (userStore.activeUser && userHasPermission(requiredPermission)) {
        return;
    }

    if (!userStore.activeUser) {
        return { name: Routes.Login };
    }

    if (userHasPermission(UserPermission.ViewPendingVacations)) {
        return { name: Routes.PendingVacations };
    }

    if (userHasPermission(UserPermission.ViewPersonalVacations)) {
        return { name: Routes.PersonalVacations };
    }

    return { name: Routes.NotFound };
});

export default router;
