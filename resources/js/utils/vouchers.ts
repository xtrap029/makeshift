import { VoucherCatalogEntry, VoucherOffer } from '@/types';

/**
 * Turn the hours-independent voucher catalog into offers for a specific selection.
 *
 * The inquiry modal lets the customer change the time range as they go, so
 * qualification and savings have to be recomputed as they do. This mirrors
 * Voucher::qualifies() / OfferService::availableFor() on the server — which stays
 * the authority: OfferService::applyTo() re-validates everything on submit, so
 * anything wrong here can only mislead the display, never the price charged.
 */
export function evaluateVouchers(
    vouchers: VoucherCatalogEntry[],
    hours: number,
    qty: number = 1
): VoucherOffer[] {
    return vouchers.map((voucher) => {
        const subtotal = voucher.room_price * hours * qty;

        const hoursShort =
            voucher.min_hours && hours < voucher.min_hours
                ? Math.round((voucher.min_hours - hours) * 100) / 100
                : null;
        const spendShort =
            voucher.min_spend && subtotal < voucher.min_spend
                ? Math.round((voucher.min_spend - subtotal) * 100) / 100
                : null;

        const qualifies = hours > 0 && hoursShort === null && spendShort === null;

        return {
            ...voucher,
            total_savings: Math.round(voucher.per_hour_amount * hours * qty * 100) / 100,
            qualifies,
            shortfall: qualifies ? null : { hours: hoursShort, spend: spendShort },
        };
    });
}
