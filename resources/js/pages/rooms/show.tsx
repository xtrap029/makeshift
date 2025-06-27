import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import IconDynamic from '@/components/ui/icon-dynamic';
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
import { BreadcrumbItem, Room } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Check, SquareDashed, Users } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rooms', href: '/rooms' },
    { title: 'Show', href: '/rooms/show' },
];

export default function Show({ room }: { room: Room }) {
    const { destroy } = useDelete();

    const [openPreview, setOpenPreview] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rooms - Show" />
            <div className="p-4">
                <div className="mb-8 flex justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/rooms">Back</Link>
                        </Button>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => setOpenPreview(true)}
                        >
                            Preview
                        </Button>
                        <Link
                            className={buttonVariants({ variant: 'outline' })}
                            href={`/rooms/${room.id}/edit`}
                        >
                            Edit
                        </Link>
                        <Button
                            variant="destructive"
                            className="cursor-pointer"
                            onClick={() => destroy('rooms.destroy', room.id, room.name)}
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
                    <Table className="my-4">
                        <TableBody>
                            <TableRow>
                                <TableHead>Price</TableHead>
                                <TableCell>{room.price ? `₱ ${room.price}` : '-'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableHead>Status</TableHead>
                                <TableCell>{room.is_active ? 'Active' : 'Inactive'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableCell>{room.is_private ? 'Private' : 'Common'}</TableCell>
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
                                            return <Badge key={amenity.id}>{amenity.name}</Badge>;
                                        })}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <div className="text-muted-foreground text-sm">{room.description}</div>
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
                                            {room.price ? `₱ ${room.price}` : '-'}
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
                                    <Button className="bg-destructive/80 hover:bg-destructive/90 mt-4 w-full rounded-full py-6 text-lg font-bold text-white">
                                        BOOK NOW
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        className="w-full cursor-pointer rounded-full py-6 text-lg font-bold"
                                        onClick={() => setOpenPreview(false)}
                                    >
                                        BACK
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
