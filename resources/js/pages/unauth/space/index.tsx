import Animation from '@/components/custom/animation';
import ImageWithFallback from '@/components/custom/imageWithFallback';
import { Input } from '@/components/custom/makeshift/input';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import AppLayoutHeaderCustomer from '@/layouts/app/app-header-layout-customer';
import { Room } from '@/types';
import { Head, router } from '@inertiajs/react';
import { CalendarIcon, SquareDashed, Users } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

const validationSchema = z.object({
    date: z.string().min(1, 'Date is required'),
});

export default function Index({ rooms }: { rooms: Room[] }) {
    const [appliedDate, setAppliedDate] = useState<string>(route().params.date || '');
    const [draftDate, setDraftDate] = useState<string>(route().params.date || '');
    const [dialogOpen, setDialogOpen] = useState(false);

    const [zodErrors, setZodErrors] = useState<Record<string, string>>({});

    const handleFilterChange = () => {
        const result = validationSchema.safeParse({ date: draftDate });

        if (!result.success) {
            setZodErrors(
                Object.fromEntries(
                    result.error.issues.map((err) => [err.path[0]?.toString(), err.message])
                )
            );
            return;
        }

        setZodErrors({});

        setAppliedDate(draftDate);
        router.get(
            route('spaces'),
            { date: draftDate },
            {
                preserveState: true,
                replace: true,
            }
        );

        setDialogOpen(false);
    };

    const handleClearFilter = () => {
        setAppliedDate('');
        setDraftDate('');
        router.get(route('spaces'), { date: '' }, { preserveState: true, replace: true });
        setDialogOpen(false);
    };

    // Reset draft date when drawer opens to match applied date
    const handleDialogOpenChange = (open: boolean) => {
        setDialogOpen(open);
        if (open) {
            setDraftDate(appliedDate);
        }
    };

    return (
        <AppLayoutHeaderCustomer page="Spaces">
            <Head title="Spaces" />
            <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogTrigger asChild>
                    <Button
                        variant="makeshiftDefault"
                        size="makeshiftXl"
                        className="shadow-lg transition-all duration-300"
                    >
                        <CalendarIcon className="size-5" />
                        {appliedDate
                            ? new Date(appliedDate).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                              })
                            : 'Filter by Date'}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Filter by Date</DialogTitle>
                        <DialogDescription className="mt-4 flex flex-col items-center justify-center gap-4">
                            <Input
                                type="date"
                                min={
                                    new Date(Date.now() + 24 * 60 * 60 * 1000)
                                        .toISOString()
                                        .split('T')[0]
                                }
                                className="w-full"
                                onChange={(e) => setDraftDate(e.target.value)}
                                value={draftDate}
                            />
                            <InputError message={zodErrors.date} />
                            <Button
                                variant="makeshiftDefault"
                                size="makeshiftXl"
                                onClick={handleFilterChange}
                                className="w-full"
                            >
                                Apply
                            </Button>
                            <Button
                                variant="makeshiftOutline"
                                size="makeshiftXl"
                                onClick={handleClearFilter}
                                className="w-full"
                            >
                                Clear
                            </Button>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                {rooms.map((room) => (
                    <div key={room.id.toString()} className="w-full">
                        <Animation isRandom>
                            <Card
                                className="w-full cursor-pointer rounded-2xl py-2 shadow-lg"
                                onClick={() =>
                                    router.visit(
                                        route('spaces.show', room.name) +
                                            `?date=${encodeURIComponent(appliedDate)}`
                                    )
                                }
                            >
                                <CardContent className="px-2">
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="relative h-[100px] w-[100px] flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                                            <ImageWithFallback
                                                src={`/storage/${room.image?.name}`}
                                                alt={room.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col gap-2">
                                            <div className="flex flex-col items-start">
                                                <h3 className="pb-0 text-xl font-bold">
                                                    {room.name}
                                                </h3>
                                                <div className="flex items-center gap-5">
                                                    <div className="flex items-center gap-1">
                                                        <Users className="size-4" />
                                                        <span className="text-sm">
                                                            {room.cap} pax
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <SquareDashed className="size-4" />
                                                        <span className="text-sm">
                                                            {room.sqm} sqm
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-muted-foreground mt-2 line-clamp-2 min-h-[2.4rem] text-sm leading-tight">
                                                {room.description}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Animation>
                    </div>
                ))}
                {rooms.length === 0 && (
                    <div className="col-span-full flex h-[calc(100vh-400px)] items-center justify-center">
                        <p className="text-muted-foreground">No spaces found</p>
                    </div>
                )}
            </div>
        </AppLayoutHeaderCustomer>
    );
}
