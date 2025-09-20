export function priceDisplay(amount: number) {
    const formatted = amount.toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return `₱ ${formatted}`;
}

export function dateTimeInputDisplay(datetime: string) {
    const date = new Date(datetime.replace(' ', 'T'));
    return date.toISOString().slice(0, 16);
}
