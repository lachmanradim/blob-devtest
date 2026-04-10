const dateFormatter = new Intl.DateTimeFormat("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
});

export const formatDate = (date: Date | null | undefined): string => {
    if (!date) return "";

    return dateFormatter.format(date);
};
