import { Button, buttonVariants } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useDelete } from '@/hooks/use-delete';
import AppLayout from '@/layouts/app-layout';
import { Room, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Check, Eye, Pencil, Trash } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rooms', href: '/rooms' },
];

export default function Index({ rooms }: { rooms: Room[] }) {
    const { destroy, processing } = useDelete();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rooms - List" />
            <div className="p-4">
                <div className="flex justify-end">
                    <Link className={buttonVariants({ variant: 'default' })} href="/rooms/create">
                        Create
                    </Link>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-center">Price</TableHead>
                            <TableHead className="text-center">Schedule</TableHead>
                            <TableHead className="text-center">Active</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rooms.map((room) => (
                            <TableRow key={room.id}>
                                <TableCell>{room.name}</TableCell>
                                <TableCell className="text-center">
                                    {room.price ? `₱ ${room.price}` : '-'}
                                </TableCell>
                                <TableCell className="text-center">
                                    {room.schedule ? (
                                        <span
                                            className={`${
                                                room.schedule.is_active
                                                    ? 'text-green-500'
                                                    : 'text-red-500'
                                            }`}
                                        >
                                            {room.schedule.name}
                                        </span>
                                    ) : (
                                        '-'
                                    )}
                                </TableCell>
                                <TableCell className="text-center">
                                    {room.is_active ? (
                                        <Check className="mx-auto text-green-500" />
                                    ) : (
                                        ''
                                    )}
                                </TableCell>
                                <TableCell className="flex justify-end gap-2">
                                    <Link
                                        className={buttonVariants({ variant: 'ghost' })}
                                        href={`/rooms/${room.id}`}
                                    >
                                        <Eye />
                                    </Link>
                                    <Link
                                        className={buttonVariants({ variant: 'ghost' })}
                                        href={`/rooms/${room.id}/edit`}
                                    >
                                        <Pencil />
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        className="cursor-pointer"
                                        onClick={() => destroy('rooms.destroy', room.id, room.name)}
                                        disabled={processing}
                                    >
                                        <Trash />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
