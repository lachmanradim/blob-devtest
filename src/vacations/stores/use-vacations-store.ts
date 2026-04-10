import { defineStore, storeToRefs } from "pinia";
import { VacationStatus, VacationType, type Vacation } from "../models/vacation";
import { computed, readonly, ref, watch } from "vue";
import { useUserStore } from "@/shared/stores/use-user-store";
import { getVacationsList } from "../apis/vacations-list-api";

export const useVacationsStore = defineStore("vacations", () => {
    const userStore = useUserStore();
    const { isLoggedIn, activeUser } = storeToRefs(userStore);

    const allVacations = ref<Vacation[]>([]);
    const isLoading = ref(false);

    const nextVacationId = () => Math.max(0, ...allVacations.value.map((v) => v.id)) + 1;

    const userVacations = computed(() => {
        if (!activeUser.value) return [];

        return allVacations.value.filter((v) => v.employeeId === activeUser.value?.employeeId);
    });

    const userUnresolvedVacations = computed(() =>
        userVacations.value.filter((v) => v.status === VacationStatus.Pending),
    );

    const userResolvedVacations = computed(() =>
        userVacations.value.filter((v) => v.status !== VacationStatus.Pending),
    );

    const approvedVacations = computed(() =>
        allVacations.value.filter((v) => v.status === VacationStatus.Approved),
    );

    const rejectedVacations = computed(() =>
        allVacations.value.filter((v) => v.status === VacationStatus.Rejected),
    );

    const pendingVacations = computed(() =>
        allVacations.value.filter((v) => v.status === VacationStatus.Pending),
    );

    const createVacationRequest = (
        dateCreated: Date,
        dateFrom: Date,
        dateTo: Date,
        type: VacationType,
        status: VacationStatus,
        commentary: string,
        employeeId: number,
        employeeName: string,
    ) => {
        const vacation: Vacation = {
            id: nextVacationId(),
            dateCreated,
            dateFrom,
            dateTo,
            type,
            status,
            commentary,
            employeeId,
            employeeName,
        };

        allVacations.value.push(vacation);
    };

    const editVacationRequest = (
        vacationId: number,
        dateFrom: Date,
        dateTo: Date,
        type: VacationType,
        commentary: string,
    ) => {
        const vacation = allVacations.value.find((v) => v.id === vacationId);

        if (vacation && vacation.status === VacationStatus.Pending) {
            vacation.dateFrom = dateFrom;
            vacation.dateTo = dateTo;
            vacation.type = type;
            vacation.commentary = commentary;
        }
    };

    const cancelVacationRequest = (vacationId: number) => {
        const vacation = allVacations.value.find((v) => v.id === vacationId);

        if (vacation && vacation.status === VacationStatus.Pending) {
            allVacations.value.splice(allVacations.value.indexOf(vacation), 1);
        }
    };

    const approveVacationRequest = (vacationId: number) => {
        const vacation = allVacations.value.find((v) => v.id === vacationId);

        if (vacation && vacation.status === VacationStatus.Pending) {
            vacation.status = VacationStatus.Approved;
        }
    };

    const rejectVacationRequest = (vacationId: number, reason: string) => {
        const vacation = allVacations.value.find((v) => v.id === vacationId);

        if (vacation && vacation.status === VacationStatus.Pending) {
            vacation.status = VacationStatus.Rejected;
            vacation.rejectReason = reason;
        }
    };

    watch(
        isLoggedIn,
        async (newIsLoggedIn) => {
            if (!newIsLoggedIn || allVacations.value.length) {
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
        userUnresolvedVacations,
        userResolvedVacations,

        approvedVacations,
        pendingVacations,
        rejectedVacations,

        isLoading: readonly(isLoading),

        createVacationRequest,
        editVacationRequest,
        approveVacationRequest,
        rejectVacationRequest,
        cancelVacationRequest,
    };
});
