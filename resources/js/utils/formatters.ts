export function priceDisplay(amount: number) {
    const formatted = amount.toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return `₱ ${formatted}`;
}
