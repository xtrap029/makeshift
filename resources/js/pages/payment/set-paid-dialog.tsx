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
import { Payment } from '@/types';
import { priceDisplay } from '@/utils/formatters';
import { router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Confirmation for the one-click "Set as Paid" shortcut. Shared by the payments
 * list and the payment detail page so the wording and behaviour can't drift.
 */
export default function SetPaidDialog({
    payment,
    open,
    onOpenChange,
}: {
    payment: Payment | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [paidAt, setPaidAt] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (open && payment) {
            setPaidAt(
                payment.paid_at
                    ? dayjs(payment.paid_at).format('YYYY-MM-DDTHH:mm')
                    : dayjs().format('YYYY-MM-DDTHH:mm')
            );
        }
    }, [open, payment]);

    if (!payment) return null;

    // Marking paid records the full expected amount; flag when that overwrites a
    // partial figure already on the payment.
    const overwritesPartial = Number(payment.amount_paid) !== Number(payment.amount);

    const submit = () => {
        setProcessing(true);
        router.put(
            route('payments.setPaid', payment.id),
            { paid_at: paidAt || null },
            {
                preserveScroll: true,
                onSuccess: () => onOpenChange(false),
                onFinish: () => setProcessing(false),
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Mark payment as paid</DialogTitle>
                    <DialogDescription>
                        {payment.reference_number
                            ? `Payment ${payment.reference_number}`
                            : `Payment #${payment.id}`}{' '}
                        will be marked as paid.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="rounded-lg border p-3">
                        <div className="text-muted-foreground text-xs font-semibold uppercase">
                            Amount recorded as received
                        </div>
                        <div className="text-lg font-bold">
                            {priceDisplay(Number(payment.amount))}
                        </div>
                        {overwritesPartial && (
                            <p className="text-muted-foreground mt-1 text-xs">
                                Currently recorded: {priceDisplay(Number(payment.amount_paid))}. To
                                record a partial amount instead, use Edit.
                            </p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="set_paid_at">Paid At</Label>
                        <Input
                            id="set_paid_at"
                            type="datetime-local"
                            value={paidAt}
                            onChange={(e) => setPaidAt(e.target.value)}
                            disabled={processing}
                        />
                        <p className="text-muted-foreground text-xs">
                            Optional — leave blank to use the current time.
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => onOpenChange(false)}
                        disabled={processing}
                    >
                        Cancel
                    </Button>
                    <Button className="cursor-pointer" onClick={submit} disabled={processing}>
                        {processing && <Loader2 className="animate-spin" />}
                        {processing ? 'Saving...' : 'Mark as Paid'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
