export enum VacationStatus {
    Pending = "pending",
    Approved = "approved",
    Rejected = "rejected",
}

export enum VacationType {
    Regular = "regular",
    SickDay = "sick-day",
}

export type Vacation = {
    id: number;
    employeeName: string;
    dateFrom: Date;
    dateTo: Date;
    dateCreated: Date;
    status: VacationStatus;
    type: VacationType;
    commentary?: string;
    rejectReason?: string;
};
