import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { bookingStatus as bookingStatusConstants } from '@/constants';
import { useDelete } from '@/hooks/use-delete';
import AppLayout from '@/layouts/app-layout';
import { Booking, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Eye, Pencil, Trash } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Bookings', href: '/bookings' },
];

export default function Index({ bookings }: { bookings: Booking[] }) {
    const { destroy, processing } = useDelete();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bookings - List" />
            <div className="p-4">
                <div className="flex justify-end">
                    <Link
                        className={buttonVariants({ variant: 'default' })}
                        href="/bookings/create"
                    >
                        Create
                    </Link>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Room</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Expires At</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell>{booking.id}</TableCell>
                                <TableCell>{booking.customer_name}</TableCell>
                                <TableCell>
                                    <a
                                        href={`/rooms/${booking.room.id}`}
                                        target="_blank"
                                        className="underline"
                                    >
                                        {booking.room.name}
                                    </a>
                                </TableCell>
                                <TableCell>{booking.start_date}</TableCell>
                                <TableCell>
                                    {booking.start_time.slice(0, 5)} -{' '}
                                    {booking.end_time.slice(0, 5)}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={
                                            bookingStatusConstants[booking.status - 1].badgeClass
                                        }
                                    >
                                        {bookingStatusConstants[booking.status - 1].label}
                                    </Badge>
                                </TableCell>
                                <TableCell>{booking.expires_at || '-'}</TableCell>
                                <TableCell className="flex justify-end gap-2">
                                    <Link
                                        className={buttonVariants({ variant: 'ghost' })}
                                        href={`/bookings/${booking.id}`}
                                        disabled={processing}
                                    >
                                        <Eye />
                                    </Link>
                                    <Link
                                        className={buttonVariants({ variant: 'ghost' })}
                                        href={`/bookings/${booking.id}/edit`}
                                        disabled={processing}
                                    >
                                        <Pencil />
                                    </Link>
                                    {booking.status === 1 && (
                                        <Button
                                            variant="ghost"
                                            onClick={() =>
                                                destroy(
                                                    'bookings.destroy',
                                                    booking.id,
                                                    `#${booking.id}`
                                                )
                                            }
                                            disabled={processing}
                                        >
                                            <Trash />
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
