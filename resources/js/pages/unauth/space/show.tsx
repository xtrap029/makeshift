import { Input } from '@/components/custom/makeshift/input';
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
import AppLayoutHeaderCustomer from '@/layouts/app/app-header-layout-customer';
import { Room } from '@/types';
import { priceDisplay } from '@/utils/formatters';
import { Head } from '@inertiajs/react';
import { Check, Dot, SquareDashed, Users } from 'lucide-react';
import { useState } from 'react';

export default function Show({ room }: { room: Room }) {
    const [drawerOpen, setDrawerOpen] = useState(false);

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
                    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
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
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground mb-1 ml-3">
                                                Start Time
                                            </div>
                                            <Input type="time" />
                                        </div>
                                        <div>
                                            <div className="text-muted-foreground mb-1 ml-3">
                                                End Time
                                            </div>
                                            <Input type="time" />
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-muted-foreground mb-1 ml-3">
                                                Layout
                                            </div>
                                            <Input type="text"/>
                                        </div>
                                    </div>
                                </div>
                                <DrawerFooter className="pb-10">
                                    <Button variant="makeshiftDefault" size="makeshiftXl">
                                        Next
                                    </Button>
                                    <Button variant="makeshiftOutline" size="makeshiftXl" onClick={() => setDrawerOpen(false)}>
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
