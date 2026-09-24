import { VoucherOffer } from '@/types';
import { priceDisplay } from '@/utils/formatters';
import { Check, Lock, Ticket } from 'lucide-react';

/**
 * Offer cards for the vouchers available on a booking. Non-qualifying vouchers
 * are shown too, greyed out with what's still missing — the point is to let the
 * customer see what's within reach, not just what they've already earned.
 */
export default function VoucherPicker({
    vouchers,
    selectedId,
    onSelect,
    disabled = false,
}: {
    vouchers: VoucherOffer[];
    selectedId: number | null;
    onSelect: (id: number | null) => void;
    disabled?: boolean;
}) {
    if (vouchers.length === 0) return null;

    return (
        <div className="flex flex-col gap-2">
            {vouchers.map((voucher) => {
                const isSelected = selectedId === voucher.id;
                const locked = !voucher.qualifies;

                return (
                    <button
                        key={voucher.id}
                        type="button"
                        disabled={disabled || locked}
                        aria-pressed={isSelected}
                        onClick={() => onSelect(isSelected ? null : voucher.id)}
                        className={[
                            'flex w-full items-start gap-3 rounded-lg border p-3 text-left transition',
                            locked
                                ? 'cursor-not-allowed opacity-50'
                                : 'cursor-pointer hover:border-foreground/40',
                            isSelected ? 'border-foreground ring-foreground/20 ring-2' : '',
                        ].join(' ')}
                    >
                        <div className="mt-0.5">
                            {locked ? (
                                <Lock className="size-4" />
                            ) : isSelected ? (
                                <Check className="size-4" />
                            ) : (
                                <Ticket className="size-4" />
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-medium">{voucher.name}</span>
                                <span className="text-xs font-semibold text-green-600">
                                    {voucher.label}
                                </span>
                            </div>
                            {voucher.description && (
                                <p className="text-muted-foreground text-xs">
                                    {voucher.description}
                                </p>
                            )}
                            <p className="text-muted-foreground mt-1 text-xs">
                                {locked ? (
                                    <>
                                        {voucher.criteria_label} to unlock
                                        {voucher.shortfall?.hours
                                            ? ` — ${voucher.shortfall.hours} more hour${voucher.shortfall.hours === 1 ? '' : 's'}`
                                            : ''}
                                        {voucher.shortfall?.spend
                                            ? ` — ${priceDisplay(voucher.shortfall.spend)} more`
                                            : ''}
                                    </>
                                ) : (
                                    <>
                                        {voucher.criteria_label} · saves{' '}
                                        <span className="font-medium text-green-600">
                                            {priceDisplay(voucher.total_savings)}
                                        </span>
                                    </>
                                )}
                            </p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
