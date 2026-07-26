export function priceDisplay(amount: number) {
    const formatted = amount.toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return `₱ ${formatted}`;
}

/** Short "Aug 1" form for promo start dates. Parsed as local time so the day never shifts. */
export function promoDateDisplay(date: string | null) {
    if (!date) return '';
    return new Date(date + 'T00:00:00').toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
    });
}

/** What's still owed on a booking's (possibly discounted) total, never negative. */
export function remainingBalance(booking: { total_price: number; total_paid: number }) {
    return Math.max(0, Number(booking.total_price) - Number(booking.total_paid));
}

export function dateTimeInputDisplay(datetime: string) {
    const date = new Date(datetime.replace(' ', 'T'));
    return date.toISOString().slice(0, 16);
}
