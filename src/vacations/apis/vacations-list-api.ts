import { Vacation, VacationStatus, VacationType } from "../models/vacation";

const firstNames = [
    "Alice",
    "Bob",
    "Carol",
    "David",
    "Eva",
    "Frank",
    "Grace",
    "Henry",
    "Iris",
    "Jack",
];
const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Wilson",
    "Moore",
];
const commentaries = [
    "Family trip",
    "Medical leave",
    "Personal time",
    "Long commentary happy happy happy sausage tree carpet pillow",
    undefined,
];

function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export const getVacationsList = async (): Promise<Vacation[]> => {
    return new Promise<Vacation[]>((resolve) => {
        setTimeout(() => {
            const vacations: Vacation[] = Array.from({ length: 100 }, (_, i) => {
                const dateFrom = randomDate(new Date(2025, 0, 1), new Date(2026, 11, 31));
                const dateTo = new Date(
                    dateFrom.getTime() + (Math.floor(Math.random() * 14) + 1) * 86400000,
                );
                return {
                    id: i + 1,
                    employeeName: randomItem(firstNames) + " " + randomItem(lastNames),
                    dateFrom,
                    dateTo,
                    dateCreated: randomDate(new Date(2024, 0, 1), dateFrom),
                    status: VacationStatus.Pending,
                    type: randomItem([VacationType.Regular, VacationType.SickDay]),
                    commentary:
                        i % 3 === 0
                            ? randomItem(commentaries.filter(Boolean) as string[])
                            : undefined,
                };
            });
            resolve(vacations);
        }, 1000);
    });
};
