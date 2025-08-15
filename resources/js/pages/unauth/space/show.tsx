import { Input } from '@/components/custom/makeshift/input';
import { SelectTrigger } from '@/components/custom/makeshift/selectTrigger';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import IconDynamic from '@/components/ui/icon-dynamic';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import AppLayoutHeaderCustomer from '@/layouts/app/app-header-layout-customer';
import { Room } from '@/types';
import { priceDisplay } from '@/utils/formatters';
import { Head, router } from '@inertiajs/react';
import { Check, Dot, SquareDashed, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

type InquiryForm = {
    date: string;
    start_time: string;
    end_time: string;
    layout: string;
};

export default function Show({
    room,
    availableTimes,
    selectedDate,
}: {
    room: Room;
    availableTimes: string[];
    selectedDate: string;
}) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [inquiryForm, setInquiryForm] = useState<InquiryForm>({
        date: selectedDate || '',
        start_time: '',
        end_time: '',
        layout: '',
    });

    const [selectedTimes, setSelectedTimes] = useState<{
        start_time: string;
        end_time: string;
    }>({
        start_time: '',
        end_time: '',
    });

    const generateEndTimes = (times: string[], startTime: string): string[] => {
        // Helper: convert HH:mm to minutes
        const toMinutes = (t: string) => {
            const [h, m] = t.split(':').map(Number);
            return h * 60 + m;
        };

        // Increment each time by 1 hour (skip times that go past 23:59)
        const incrementedTimes = times
            .map((time) => {
                const [hourStr, minuteStr] = time.split(':');
                const hour = parseInt(hourStr, 10);
                const incrementedHour = hour + 1;
                if (incrementedHour > 23) return null;
                return `${incrementedHour.toString().padStart(2, '0')}:${minuteStr}`;
            })
            .filter((t): t is string => t !== null);

        const startMins = toMinutes(startTime);

        // Filter incremented times strictly after startTime
        const filteredTimes = incrementedTimes.filter((t) => toMinutes(t) > startMins);

        // Return times while gaps between consecutive times <= 60 mins
        const result: string[] = [];
        let prevMins = startMins;

        for (const t of filteredTimes) {
            const currentMins = toMinutes(t);
            const diff = currentMins - prevMins;

            if (diff > 60) break;

            result.push(t);
            prevMins = currentMins;
        }

        return result;
    };

    const handleDateChange = (date: string) => {
        setInquiryForm({
            ...inquiryForm,
            date,
        });
        setSelectedTimes({
            start_time: '',
            end_time: '',
        });

        router.get(
            route('spaces.show', room.name),
            { date: date },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleNext = () => {
        console.log(inquiryForm);
    };

    useEffect(() => {
        setTotalPrice(
            inquiryForm.end_time && inquiryForm.start_time
                ? room.price *
                      (Number(inquiryForm.end_time.split(':')[0]) -
                          Number(inquiryForm.start_time.split(':')[0]))
                : 0
        );
    }, [inquiryForm.end_time, inquiryForm.start_time, room.price]);

    return (
        <AppLayoutHeaderCustomer page={room.name} rightIcon="arrow-left" rightIconHref="/spaces">
            <Head title={room.name} />
            <div className="flex flex-col items-center">
                <img
                    src={`/storage/${room.image?.name}`}
                    alt={room.name}
                    className="mb-3 h-50 w-full rounded-2xl object-cover shadow-lg"
                />
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between gap-2">
                        <h2 className="text-foreground text-lg font-bold">{room.name}</h2>
                        <Badge
                            variant="outline"
                            className="text-destructive text-md rounded-full font-bold shadow-sm"
                        >
                            {room.price ? priceDisplay(Number(room.price)) : '-'}
                            <span className="text-muted-foreground text-xs">/hr</span>
                        </Badge>
                    </div>
                    <div className="text-foreground flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                            <Users className="size-4" />
                            <div>{room.cap} pax</div>
                        </div>
                        <div className="flex items-center gap-1">
                            <SquareDashed className="size-4" />
                            <div>{room.sqm} sqm</div>
                        </div>
                    </div>
                    <div className="text-muted-foreground mt-4 text-sm">{room.description}</div>
                    <div className="text-foreground mt-4 grid grid-cols-2 gap-2">
                        <div className="text-muted-foreground col-span-2 text-sm">Amenities</div>
                        {room.amenities.map((amenity) => {
                            return (
                                <div className="flex items-center gap-3" key={amenity.name}>
                                    {amenity.icon ? (
                                        <IconDynamic name={amenity.icon} className="size-4" />
                                    ) : (
                                        <Check className="size-4" />
                                    )}
                                    <div>{amenity.name}</div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="text-foreground mt-4 grid grid-cols-2 gap-2">
                        <div className="text-muted-foreground col-span-2 text-sm">Layouts</div>
                        {room.layouts.map((layout) => {
                            return (
                                <div className="flex items-center gap-3" key={layout.name}>
                                    <Dot className="size-4" />
                                    <div>{layout.name}</div>
                                </div>
                            );
                        })}
                    </div>
                    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} autoFocus={drawerOpen}>
                        <DrawerTrigger asChild>
                            <Button
                                variant="makeshiftDefault"
                                size="makeshiftXl"
                                className="mt-4 w-full shadow-lg"
                            >
                                Inquire Now
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <div className="mx-auto w-full max-w-sm">
                                <DrawerHeader>
                                    <DrawerTitle>Inquire Now</DrawerTitle>
                                    <DrawerDescription>Customize your space</DrawerDescription>
                                </DrawerHeader>
                                <div className="p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <div className="text-muted-foreground mb-1 ml-3">
                                                Date
                                            </div>
                                            <Input
                                                type="date"
                                                min={
                                                    new Date(Date.now() + 24 * 60 * 60 * 1000)
                                                        .toISOString()
                                                        .split('T')[0]
                                                }
                                                value={inquiryForm.date}
                                                onChange={(e) => handleDateChange(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground mb-1 ml-3">
                                                Start Time
                                            </div>
                                            <Select
                                                value={selectedTimes.start_time}
                                                onValueChange={(value) => {
                                                    setSelectedTimes({
                                                        ...selectedTimes,
                                                        start_time: value,
                                                        end_time: '',
                                                    });
                                                }}
                                                required
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="--:--" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {inquiryForm.date &&
                                                        availableTimes.length === 0 && (
                                                            <SelectItem value="--:--" disabled>
                                                                No available times
                                                            </SelectItem>
                                                        )}
                                                    {(inquiryForm.date &&
                                                        availableTimes.map((time) => (
                                                            <SelectItem key={time} value={time}>
                                                                {time}
                                                            </SelectItem>
                                                        ))) || (
                                                        <SelectItem value="--:--" disabled>
                                                            Select a date first
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground mb-1 ml-3">
                                                End Time
                                            </div>
                                            <Select
                                                value={selectedTimes.end_time}
                                                onValueChange={(value) => {
                                                    setSelectedTimes({
                                                        ...selectedTimes,
                                                        end_time: value,
                                                    });
                                                }}
                                                required
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="--:--" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(selectedTimes.start_time &&
                                                        generateEndTimes(
                                                            availableTimes,
                                                            selectedTimes.start_time
                                                        ).map((time) => (
                                                            <SelectItem key={time} value={time}>
                                                                {time}
                                                            </SelectItem>
                                                        ))) || (
                                                        <SelectItem value="--:--" disabled>
                                                            Select a start time first
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-muted-foreground mb-1 ml-3">
                                                Layout
                                            </div>
                                            <Select
                                                value={inquiryForm.layout}
                                                onValueChange={(value) => {
                                                    setInquiryForm({
                                                        ...inquiryForm,
                                                        layout: value,
                                                    });
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a layout" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {room.layouts.map((layout) => (
                                                        <SelectItem
                                                            key={layout.name}
                                                            value={layout.name.toString()}
                                                        >
                                                            {layout.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-muted-foreground mb-1 ml-3">
                                                Total Price
                                            </div>
                                            <Input
                                                type="text"
                                                value={priceDisplay(totalPrice)}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DrawerFooter className="pb-10">
                                    <Button
                                        variant="makeshiftDefault"
                                        size="makeshiftXl"
                                        onClick={handleNext}
                                    >
                                        Next
                                    </Button>
                                    <Button
                                        variant="makeshiftOutline"
                                        size="makeshiftXl"
                                        onClick={() => setDrawerOpen(false)}
                                    >
                                        Close
                                    </Button>
                                </DrawerFooter>
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>
            </div>
        </AppLayoutHeaderCustomer>
    );
}
