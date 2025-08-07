import Animation from '@/components/custom/animation';
import ImageWithFallback from '@/components/custom/imageWithFallback';
import { Input } from '@/components/custom/makeshift/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import AppLayoutHeaderCustomer from '@/layouts/app/app-header-layout-customer';
import { Room } from '@/types';
import { router } from '@inertiajs/react';
import { CalendarIcon, SquareDashed, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Index({ rooms }: { rooms: Room[] }) {
    const [scrolled, setScrolled] = useState(false);
    const [appliedDate, setAppliedDate] = useState<string>(route().params.date || '');
    const [draftDate, setDraftDate] = useState<string>(route().params.date || '');
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleFilterChange = () => {
        setAppliedDate(draftDate);
        router.get(
            route('spaces'),
            { date: draftDate },
            {
                preserveState: true,
                replace: true,
            }
        );

        setDrawerOpen(false);
    };

    const handleClearFilter = () => {
        setAppliedDate('');
        setDraftDate('');
        router.get(route('spaces'), { date: '' }, { preserveState: true, replace: true });
        setDrawerOpen(false);
    };

    // Reset draft date when drawer opens to match applied date
    const handleDrawerOpenChange = (open: boolean) => {
        setDrawerOpen(open);
        if (open) {
            setDraftDate(appliedDate);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AppLayoutHeaderCustomer page="Spaces">
            <Drawer open={drawerOpen} onOpenChange={handleDrawerOpenChange}>
                <DrawerTrigger asChild>
                    <Button
                        variant="makeshiftDefault"
                        size="makeshiftXl"
                        className={`transition-all duration-300 ${
                            scrolled
                                ? 'text-makeshift-primary fixed top-5 right-4 z-50 h-[50px] w-[50px] bg-white shadow-xl'
                                : 'shadow-lg'
                        }`}
                    >
                        <CalendarIcon className="size-5" />
                        {scrolled
                            ? ''
                            : `${
                                  appliedDate
                                      ? new Date(appliedDate).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })
                                      : 'Filter by Date'
                              }`}
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle>Filter by Date</DrawerTitle>
                            <DrawerDescription>Select preferred date</DrawerDescription>
                        </DrawerHeader>
                        <div className="p-4 pb-0">
                            <div className="flex items-center justify-center space-x-2">
                                <Input
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full"
                                    onChange={(e) => setDraftDate(e.target.value)}
                                    value={draftDate}
                                />
                            </div>
                        </div>
                        <DrawerFooter className="pb-10">
                            <Button
                                variant="makeshiftDefault"
                                size="makeshiftXl"
                                onClick={handleFilterChange}
                            >
                                Apply
                            </Button>
                            <Button
                                variant="makeshiftOutline"
                                size="makeshiftXl"
                                onClick={handleClearFilter}
                            >
                                Clear
                            </Button>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                {rooms.map((room) => (
                    <div key={room.id.toString()} className="w-full">
                        <Animation isRandom>
                            <Card className="w-full cursor-pointer rounded-2xl py-2 shadow-lg">
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
