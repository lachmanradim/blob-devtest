import { defineStore, storeToRefs } from "pinia";
import { VacationStatus, type Vacation } from "../models/vacation";
import { computed, readonly, ref, watch } from "vue";
import { useUserStore } from "@/shared/stores/use-user-store";
import { getVacationsList } from "../apis/vacations-list-api";

export const useVacationsStore = defineStore("vacations", () => {
    const userStore = useUserStore();
    const { isLoggedIn, activeUser } = storeToRefs(userStore);

    const allVacations = ref<Vacation[]>([]);
    const isLoading = ref(false);

    const userVacations = computed(() => {
        if (!allVacations.value.length || !activeUser.value) return [];

        return allVacations.value.filter((v) => v.employeeId === activeUser.value?.id);
    });

    const userResolvedVacations = computed(() => {
        if (!userVacations.value.length) return [];

        return userVacations.value.filter((v) => v.status !== VacationStatus.Pending);
    });

    const approvedVacations = computed(() => {
        if (!allVacations.value.length) return [];

        return allVacations.value.filter((v) => v.status === VacationStatus.Approved);
    });

    const rejectedVacations = computed(() => {
        if (!allVacations.value.length) return [];

        return allVacations.value.filter((v) => v.status === VacationStatus.Rejected);
    });

    const pendingVacations = computed(() => {
        if (!allVacations.value.length) return [];

        return allVacations.value.filter((v) => v.status === VacationStatus.Pending);
    });

    const requestVacation = (vacation: Vacation) => {
        allVacations.value.push(vacation);
    };

    const approveVacation = (vacationId: number) => {
        const vacation = allVacations.value.find((v) => v.id === vacationId);

        if (vacation && vacation.status === VacationStatus.Pending) {
            vacation.status = VacationStatus.Approved;
        }
    };

    const rejectVacation = (vacationId: number, reason: string) => {
        const vacation = allVacations.value.find((v) => v.id === vacationId);

        if (vacation && vacation.status === VacationStatus.Pending) {
            vacation.status = VacationStatus.Rejected;
            vacation.rejectReason = reason;
        }
    };

    watch(
        isLoggedIn,
        async (newIsLoggedIn) => {
            if (!newIsLoggedIn) {
                allVacations.value = [];
                return;
            }

            isLoading.value = true;

            try {
                allVacations.value = await getVacationsList();
            } catch (error) {
                console.error("Failed to load vacations:", error);
            } finally {
                isLoading.value = false;
            }
        },
        { immediate: true },
    );

    return {
        userVacations,
        userResolvedVacations,

        approvedVacations,
        pendingVacations,
        rejectedVacations,

        isLoading: readonly(isLoading),

        requestVacation,
        approveVacation,
        rejectVacation,
    };
});
