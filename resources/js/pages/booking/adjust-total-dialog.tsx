import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Booking } from '@/types';
import { priceDisplay } from '@/utils/formatters';
import { router } from '@inertiajs/react';
import { ArrowRight, Loader2, Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

type Direction = 'add' | 'deduct';

/**
 * Set, replace, or remove the booking's single manual total adjustment.
 *
 * Staff pick Add/Deduct and type a positive amount; it's sent signed. The server
 * (AdjustBookingTotalRequest) re-checks both the reason and the not-below-zero
 * rule — the checks here only keep staff from submitting something it would reject.
 */
export default function AdjustTotalDialog({
    booking,
    open,
    onOpenChange,
}: {
    booking: Booking;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const existing = Number(booking.adjustment_amount ?? 0);

    const [direction, setDirection] = useState<Direction>('add');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (open) {
            setDirection(existing < 0 ? 'deduct' : 'add');
            setAmount(existing ? Math.abs(existing).toString() : '');
            setReason(booking.adjustment_reason ?? '');
            setErrors({});
        }
    }, [open, existing, booking.adjustment_reason]);

    // The total the adjustment applies to: subtotal after discounts and vouchers.
    const beforeAdjustment = Math.max(
        0,
        Number(booking.subtotal) - Number(booking.discount_amount)
    );
    const numericAmount = Number(amount) || 0;
    const signed = direction === 'deduct' ? -numericAmount : numericAmount;
    const newTotal = beforeAdjustment + signed;

    const exceedsTotal = direction === 'deduct' && numericAmount > beforeAdjustment;
    const canSubmit =
        !processing && numericAmount > 0 && reason.trim() !== '' && !exceedsTotal;

    const send = (payload: { amount: number | null; reason: string | null }) => {
        setProcessing(true);
        router.put(route('bookings.updateAdjustment', booking.id), payload, {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
            onError: (errs) => setErrors(errs),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adjust Total</DialogTitle>
                    <DialogDescription>
                        Add a charge or give a deduction on top of the calculated price. A
                        booking has one adjustment — saving replaces any previous one.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="grid gap-2">
                        <Label>Type</Label>
                        <ToggleGroup
                            type="single"
                            variant="outline"
                            value={direction}
                            onValueChange={(value) => value && setDirection(value as Direction)}
                            disabled={processing}
                            className="w-full"
                        >
                            <ToggleGroupItem value="add" className="flex-1 cursor-pointer">
                                <Plus className="size-4" /> Add charge
                            </ToggleGroupItem>
                            <ToggleGroupItem value="deduct" className="flex-1 cursor-pointer">
                                <Minus className="size-4" /> Deduct
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="adjustment_amount">Amount (PHP)</Label>
                        <Input
                            id="adjustment_amount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={processing}
                            placeholder="0.00"
                        />
                        {exceedsTotal && (
                            <p className="text-destructive text-xs">
                                A deduction can&apos;t be more than the current total (
                                {priceDisplay(beforeAdjustment)}).
                            </p>
                        )}
                        <InputError message={errors.amount} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="adjustment_reason">Reason</Label>
                        <Input
                            id="adjustment_reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            disabled={processing}
                            maxLength={255}
                            placeholder="e.g. Extra cleaning, Goodwill discount"
                        />
                        <p className="text-muted-foreground text-xs">
                            Shown to the customer in their emails.
                        </p>
                        <InputError message={errors.reason} />
                    </div>
                    <div className="flex items-center justify-center gap-2 rounded-lg border p-3 text-sm">
                        <span className="text-muted-foreground">
                            {priceDisplay(beforeAdjustment)}
                        </span>
                        <ArrowRight className="text-muted-foreground size-4" />
                        <span className="font-bold">{priceDisplay(Math.max(0, newTotal))}</span>
                    </div>
                </div>
                <DialogFooter className="gap-2 sm:justify-between">
                    <div>
                        {existing !== 0 && (
                            <Button
                                variant="destructive"
                                className="cursor-pointer"
                                disabled={processing}
                                onClick={() => send({ amount: null, reason: null })}
                            >
                                Remove adjustment
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="cursor-pointer"
                            disabled={!canSubmit}
                            onClick={() => send({ amount: signed, reason: reason.trim() })}
                        >
                            {processing && <Loader2 className="animate-spin" />}
                            Save
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
