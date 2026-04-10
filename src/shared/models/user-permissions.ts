import { UserRole } from "./user-role";

export enum UserPermission {
    ViewPersonalVacations = "view-personal-vacations",
    ViewPendingVacations = "view-pending-vacations",
    ViewApprovedRejectedVacations = "view-approved-rejected-vacations",
    EditRequest = "edit-request",
    ApproveRequests = "approve-requests",
    RejectRequests = "reject-requests",
    CreateRequest = "create-request",
    CancelRequest = "cancel-request",
}

export const rolePermissions: Record<UserRole, UserPermission[]> = {
    [UserRole.Employee]: [
        UserPermission.ViewPersonalVacations,
        UserPermission.CreateRequest,
        UserPermission.EditRequest,
        UserPermission.CancelRequest,
    ],
    [UserRole.Admin]: [
        UserPermission.ViewPendingVacations,
        UserPermission.ViewApprovedRejectedVacations,
        UserPermission.ApproveRequests,
        UserPermission.RejectRequests,
    ],
};
