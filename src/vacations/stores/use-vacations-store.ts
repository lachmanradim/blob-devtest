import { defineStore, storeToRefs } from "pinia";
import { VacationStatus, type Vacation } from "../models/vacation";
import { computed, readonly, ref, watch } from "vue";
import { useUserStore } from "@/shared/stores/use-user-store";
import { getVacationsList } from "../apis/vacations-list-api";

export const useVacationsStore = defineStore("vacations", () => {
    const userStore = useUserStore();
    const { isLoggedIn } = storeToRefs(userStore);

    const vacations = ref<Vacation[]>([]);
    const isLoading = ref(false);

    const approvedVacations = computed(() => {
        if (!vacations.value.length) return [];

        return vacations.value.filter((v) => v.status === VacationStatus.Approved);
    });

    const rejectedVacations = computed(() => {
        if (!vacations.value.length) return [];

        return vacations.value.filter((v) => v.status === VacationStatus.Rejected);
    });

    const pendingVacations = computed(() => {
        if (!vacations.value.length) return [];

        return vacations.value.filter((v) => v.status === VacationStatus.Pending);
    });

    const createVacation = (vacation: Vacation) => {
        vacations.value.push(vacation);
    };

    const approveVacation = (vacationId: number) => {
        const vacation = vacations.value.find((v) => v.id === vacationId);

        if (vacation && vacation.status === VacationStatus.Pending) {
            vacation.status = VacationStatus.Approved;
        }
    };

    const rejectVacation = (vacationId: number, reason: string) => {
        const vacation = vacations.value.find((v) => v.id === vacationId);

        if (vacation && vacation.status === VacationStatus.Pending) {
            vacation.status = VacationStatus.Rejected;
            vacation.rejectReason = reason;
        }
    };

    watch(
        isLoggedIn,
        async (newIsLoggedIn) => {
            if (!newIsLoggedIn) {
                vacations.value = [];
                return;
            }

            isLoading.value = true;

            try {
                vacations.value = await getVacationsList();
            } catch (error) {
                console.error("Failed to load vacations:", error);
            } finally {
                isLoading.value = false;
            }
        },
        { immediate: true },
    );

    return {
        approvedVacations,
        pendingVacations,
        rejectedVacations,

        isLoading: readonly(isLoading),

        createVacation,
        approveVacation,
        rejectVacation,
    };
});
