import { Input } from '@/components/custom/makeshift/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Room } from '@/types';
import axios from 'axios';
import dayjs from 'dayjs';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DayButtonProps } from 'react-day-picker';

type DayRate = {
    price: number;
    original_price: number;
    discount_label: string | null;
    closed: boolean;
};

/** Compact calendar-cell price, e.g. "3.4k" or "450" — full pesos don't fit a day cell. */
function compactPrice(amount: number) {
    if (amount >= 1000) {
        return `${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
    }
    return amount.toString();
}

export default function RoomDatePicker({
    room,
    value,
    onChange,
    minDate,
}: {
    room: Room;
    value: string;
    onChange: (date: string) => void;
    minDate: string;
}) {
    const [open, setOpen] = useState(false);
    const [month, setMonth] = useState<Date>(value ? dayjs(value).toDate() : dayjs().toDate());
    const [loading, setLoading] = useState(false);
    const [rates, setRates] = useState<Record<string, DayRate>>({});
    const fetchedMonths = useRef(new Set<string>());

    useEffect(() => {
        if (!open) return;

        const monthKey = dayjs(month).format('YYYY-MM');
        if (fetchedMonths.current.has(monthKey)) return;

        const from = dayjs(month).startOf('month').format('YYYY-MM-DD');
        const to = dayjs(month).endOf('month').format('YYYY-MM-DD');

        setLoading(true);
        axios
            .get(`/api/spaces/${room.name}/rate-calendar`, { params: { from, to } })
            .then(({ data }) => {
                fetchedMonths.current.add(monthKey);
                setRates((prev) => ({ ...prev, ...data.days }));
            })
            .finally(() => setLoading(false));
    }, [open, month, room.name]);

    const minDateObj = useMemo(() => dayjs(minDate).startOf('day'), [minDate]);

    const isDisabled = (date: Date) => {
        if (dayjs(date).isBefore(minDateObj, 'day')) return true;
        const rate = rates[dayjs(date).format('YYYY-MM-DD')];
        return rate?.closed ?? false;
    };

    // Memoized so the day grid isn't torn down and remounted (losing hover/focus)
    // on every unrelated re-render — only when the data it actually reads changes.
    const DayButton = useCallback(
        (props: DayButtonProps) => {
            const { day, modifiers, children, ...buttonProps } = props;
            const dateKey = dayjs(day.date).format('YYYY-MM-DD');
            const rate = rates[dateKey];

            return (
                <button {...buttonProps}>
                    {children}
                    {!modifiers.disabled && !modifiers.outside && (
                        <span
                            className={cn(
                                'text-[0.65rem] leading-none',
                                rate?.discount_label
                                    ? 'font-semibold text-green-600'
                                    : 'text-muted-foreground'
                            )}
                        >
                            {loading && !rate ? (
                                <Loader2 className="size-2.5 animate-spin" />
                            ) : rate ? (
                                compactPrice(rate.price)
                            ) : (
                                ''
                            )}
                        </span>
                    )}
                </button>
            );
        },
        [rates, loading]
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className="relative">
                    <Input
                        readOnly
                        value={value ? dayjs(value).format('MMM D, YYYY') : ''}
                        placeholder="Select a date"
                        className="cursor-pointer pr-8"
                    />
                    <CalendarIcon className="text-muted-foreground pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2" />
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value ? dayjs(value).toDate() : undefined}
                    onSelect={(date) => {
                        if (!date) return;
                        onChange(dayjs(date).format('YYYY-MM-DD'));
                        setOpen(false);
                    }}
                    month={month}
                    onMonthChange={setMonth}
                    disabled={isDisabled}
                    components={{ DayButton }}
                />
            </PopoverContent>
        </Popover>
    );
}
