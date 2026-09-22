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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Booking, RescheduleOptions } from '@/types';
import { RescheduleBookingForm } from '@/types/form';
import { priceDisplay } from '@/utils/formatters';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function RescheduleDialog({
    booking,
    open,
    onOpenChange,
}: {
    booking: Booking;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const { data, setData, put, processing, errors, reset, clearErrors } =
        useForm<RescheduleBookingForm>({
            start_date: '',
            start_time: '',
            note: '',
        });

    const [options, setOptions] = useState<RescheduleOptions | null>(null);
    const [isLoadingOptions, setIsLoadingOptions] = useState(false);

    const minDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
    const hours = options?.hours ?? Math.round(booking.total_hours);

    // Derived end time — the duration is fixed so the paid total can't drift.
    const endTime = data.start_time
        ? `${(Number(data.start_time.split(':')[0]) + hours).toString().padStart(2, '0')}:00`
        : '';

    useEffect(() => {
        if (!open) {
            reset();
            clearErrors();
            setOptions(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const onDateChange = async (date: string) => {
        setData((prev) => ({ ...prev, start_date: date, start_time: '' }));
        setOptions(null);
        if (!date || date < minDate) return;

        setIsLoadingOptions(true);
        try {
            const { data: result } = await axios.get<RescheduleOptions>(
                `/api/bookings/${booking.id}/reschedule-options`,
                { params: { date } }
            );
            setOptions(result);
        } catch {
            toast.error('Failed to load available times for that date');
        } finally {
            setIsLoadingOptions(false);
        }
    };

    const submit = () => {
        put(`/bookings/${booking.id}/reschedule`, {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    };

    const pricing = options?.pricing;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reschedule Booking</DialogTitle>
                    <DialogDescription>
                        Move this confirmed booking to a new date and time in the same room.
                        Duration stays at {hours} hour{hours === 1 ? '' : 's'} and the paid
                        rate is locked.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="text-muted-foreground rounded-lg border px-3 py-2 text-sm">
                        <span className="font-medium">Current:</span>{' '}
                        {dayjs(booking.start_date).format('MMM DD, YYYY')},{' '}
                        {booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="reschedule_date">New Date</Label>
                        <Input
                            id="reschedule_date"
                            type="date"
                            min={minDate}
                            value={data.start_date}
                            onChange={(e) => onDateChange(e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.start_date} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="reschedule_start">New Start Time</Label>
                            <Select
                                value={data.start_time}
                                onValueChange={(value) => setData('start_time', value)}
                                disabled={processing || isLoadingOptions || !options}
                            >
                                <SelectTrigger id="reschedule_start">
                                    <SelectValue
                                        placeholder={
                                            isLoadingOptions
                                                ? 'Checking availability...'
                                                : !data.start_date
                                                  ? 'Select a date first'
                                                  : 'Select a start time'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {options && options.start_times.length === 0 && (
                                        <SelectItem value="--:--" disabled>
                                            No available slots for this date
                                        </SelectItem>
                                    )}
                                    {options?.start_times.map((time) => (
                                        <SelectItem key={time} value={`${time}:00`}>
                                            {time}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.start_time} />
                        </div>
                        <div className="grid gap-2">
                            <Label>New End Time</Label>
                            <Input value={endTime} readOnly disabled placeholder="--:--" />
                        </div>
                    </div>
                    {pricing && (
                        <div className="flex flex-col gap-3 rounded-lg border p-3">
                            <p className="text-sm font-medium">
                                The rate stays the same — this booking is already paid.
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1 rounded-lg border p-3">
                                    <div className="text-muted-foreground text-xs font-semibold uppercase">
                                        Current (locked)
                                    </div>
                                    <div className="text-muted-foreground text-sm">
                                        {pricing.current.discount_name
                                            ? `${pricing.current.discount_name} (- ${priceDisplay(pricing.current.discount_amount)})`
                                            : 'No discount'}
                                    </div>
                                    <div className="mt-1 border-t pt-2 text-sm font-bold">
                                        {priceDisplay(pricing.current.total_price)}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 rounded-lg border p-3">
                                    <div className="text-muted-foreground text-xs font-semibold uppercase">
                                        Rate on new date
                                    </div>
                                    <div className="text-muted-foreground text-sm">
                                        {pricing.would_be.discount_name
                                            ? `${pricing.would_be.discount_name} (- ${priceDisplay(pricing.would_be.discount_amount)})`
                                            : 'No discount'}
                                    </div>
                                    <div className="mt-1 border-t pt-2 text-sm font-bold">
                                        {priceDisplay(pricing.would_be.total_price)}
                                    </div>
                                </div>
                            </div>
                            {pricing.changed ? (
                                <p className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
                                    <span>Would normally be</span>
                                    <span className="text-foreground font-bold">
                                        {priceDisplay(pricing.would_be.total_price)}
                                    </span>
                                    <ArrowRight className="size-4" />
                                    <span>customer keeps</span>
                                    <span className="text-foreground font-bold">
                                        {priceDisplay(pricing.current.total_price)}
                                    </span>
                                </p>
                            ) : (
                                <p className="text-muted-foreground text-center text-sm">
                                    Same rate on the new date.
                                </p>
                            )}
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="reschedule_note">Note (optional)</Label>
                        <Textarea
                            id="reschedule_note"
                            placeholder="Reason for rescheduling — appended to the booking notes as a log entry"
                            value={data.note}
                            onChange={(e) => setData('note', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.note} />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={processing}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={submit}
                        disabled={processing || !data.start_date || !data.start_time}
                    >
                        {processing && <Loader2 className="animate-spin" />}
                        {processing ? 'Rescheduling...' : 'Reschedule'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
