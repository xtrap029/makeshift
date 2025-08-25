import WeekSchedule from '@/components/custom/week-schedule';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import IconDynamic from '@/components/ui/icon-dynamic';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { useDelete } from '@/hooks/use-delete';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, Room } from '@/types';
import { priceDisplay } from '@/utils/formatters';
import { Head, Link, router } from '@inertiajs/react';
import { Check, Clock, Dot, Eye, SquareDashed, Users } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rooms', href: '/rooms' },
    { title: 'Show', href: '/rooms/show' },
];

export default function Show({ room }: { room: Room }) {
    const { destroy, processing } = useDelete();

    const [openPreview, setOpenPreview] = useState(false);
    const [is24Hour, setIs24Hour] = useState(true);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rooms - Show" />
            <div className="p-4">
                <div className="mb-8 flex justify-between gap-2">
                    <div className="flex gap-2">
                        <Button variant="outline" asChild disabled={processing}>
                            <Link href="/rooms">Back</Link>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setOpenPreview(true)}
                            disabled={processing}
                        >
                            <Eye size={16} />
                            Preview
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setIs24Hour(!is24Hour)}
                            disabled={processing}
                        >
                            <Clock size={16} />
                            View in {is24Hour ? '12 Hour' : '24 Hour'} format
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            className={buttonVariants({ variant: 'default' })}
                            href={`/rooms/${room.id}/edit`}
                            disabled={processing}
                        >
                            Edit
                        </Link>
                        <Button
                            variant="destructive"
                            onClick={() => destroy('rooms.destroy', room.id, room.name)}
                            disabled={processing}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                        {room.image?.name && (
                            <img
                                src={`/storage/${room.image?.name}`}
                                alt={room.name}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                        )}
                        <h1 className="text-2xl font-bold">{room.name}</h1>
                    </div>
                    <div className="text-muted-foreground my-4 text-sm">{room.description}</div>
                    <div className="grid w-full grid-cols-12 gap-2">
                        <div className="col-span-9">
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableHead>Price</TableHead>
                                        <TableCell>
                                            {room.price ? priceDisplay(Number(room.price)) : '-'}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Status</TableHead>
                                        <TableCell>
                                            {room.is_active ? 'Active' : 'Inactive'}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableCell>
                                            {room.is_private ? 'Private' : 'Common'}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Size</TableHead>
                                        <TableCell>{room.sqm} m²</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Quantity</TableHead>
                                        <TableCell>{room.qty}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Capacity</TableHead>
                                        <TableCell>{room.cap}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Amenities</TableHead>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-2">
                                                {room.amenities.map((amenity) => {
                                                    return (
                                                        <Badge key={amenity.id}>
                                                            {amenity.name}
                                                        </Badge>
                                                    );
                                                })}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Layouts</TableHead>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-2">
                                                {room.layouts.map((layout) => {
                                                    return (
                                                        <Badge key={layout.id}>{layout.name}</Badge>
                                                    );
                                                })}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                        <div className="col-span-3">
                            <Table>
                                <TableBody className="border-l">
                                    <TableRow>
                                        <TableHead>Overrides</TableHead>
                                    </TableRow>
                                    {room.overrides &&
                                        room.overrides.length > 0 &&
                                        room.overrides.map((override, index) => {
                                            return (
                                                <TableRow key={override.id} className="border-0">
                                                    <TableCell className="flex justify-between gap-2">
                                                        {index === 0 ||
                                                        room.overrides[index - 1].date !==
                                                            override.date ? (
                                                            <div className="text-muted-foreground text-sm">
                                                                {override.date}
                                                            </div>
                                                        ) : (
                                                            <div></div>
                                                        )}
                                                        <Badge
                                                            key={override.id}
                                                            className={cn(
                                                                'cursor-pointer rounded-full text-sm',
                                                                override.is_open
                                                                    ? 'bg-emerald-100 text-emerald-700'
                                                                    : 'bg-rose-100 text-rose-700'
                                                            )}
                                                            onClick={() =>
                                                                router.visit(
                                                                    route('overrides.edit', {
                                                                        override: override.id,
                                                                    })
                                                                )
                                                            }
                                                        >
                                                            {override.note}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    {room.overrides && room.overrides.length === 0 && (
                                        <TableRow>
                                            <TableCell>No overrides</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    {room.schedule && (
                        <>
                            <Separator className="mb-4" />
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold">{room.schedule.name}</h1>
                                <div className="flex gap-2 self-center">
                                    <Badge variant="outline" className="text-sm">
                                        {room.schedule.max_day} days
                                    </Badge>
                                    <Badge variant="outline" className="text-sm">
                                        {room.schedule.max_date}
                                    </Badge>
                                </div>
                            </div>
                            <WeekSchedule schedule={room.schedule} is24Hour={is24Hour} />
                        </>
                    )}
                </div>
            </div>
            <Sheet open={openPreview} onOpenChange={setOpenPreview}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Preview</SheetTitle>
                        <SheetDescription className="flex flex-col gap-4 pt-4" asChild>
                            <div>
                                <img
                                    src={`/storage/${room.image?.name}`}
                                    alt={room.name}
                                    className="mb-3 h-50 w-full rounded-2xl object-cover shadow-lg"
                                />
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between gap-2">
                                        <h2 className="text-foreground text-lg font-bold">
                                            {room.name}
                                        </h2>
                                        <Badge
                                            variant="outline"
                                            className="text-destructive text-md rounded-full font-bold shadow-sm"
                                        >
                                            {room.price ? priceDisplay(Number(room.price)) : '-'}
                                            <span className="text-muted-foreground text-xs">
                                                /hr
                                            </span>
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
                                    <div className="text-muted-foreground mt-4 text-sm">
                                        {room.description}
                                    </div>
                                    <div className="text-foreground mt-4 grid grid-cols-2 gap-2">
                                        <div className="text-muted-foreground col-span-2 text-sm">
                                            Amenities
                                        </div>
                                        {room.amenities.map((amenity) => {
                                            return (
                                                <div
                                                    className="flex items-center gap-3"
                                                    key={amenity.id}
                                                >
                                                    {amenity.icon ? (
                                                        <IconDynamic
                                                            name={amenity.icon}
                                                            className="size-4"
                                                        />
                                                    ) : (
                                                        <Check className="size-4" />
                                                    )}
                                                    <div>{amenity.name}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="text-foreground mt-4 grid grid-cols-2 gap-2">
                                        <div className="text-muted-foreground col-span-2 text-sm">
                                            Layouts
                                        </div>
                                        {room.layouts.map((layout) => {
                                            return (
                                                <div
                                                    className="flex items-center gap-3"
                                                    key={layout.id}
                                                >
                                                    <Dot className="size-4" />
                                                    <div>{layout.name}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <Button className="bg-destructive/80 hover:bg-destructive/90 mt-4 w-full rounded-full py-6 text-lg font-bold text-white">
                                        Inquire Now
                                    </Button>
                                </div>
                            </div>
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </AppLayout>
    );
}
