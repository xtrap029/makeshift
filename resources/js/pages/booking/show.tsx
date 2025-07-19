import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { bookingStatus } from '@/constants';
import { useDelete } from '@/hooks/use-delete';
import { useUpdateStatus } from '@/hooks/use-update-status';
import AppLayout from '@/layouts/app-layout';
import { Booking, BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import dayjs from 'dayjs';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Bookings', href: '/bookings' },
    { title: 'Show', href: '/bookings/show' },
];

export default function Show({ booking }: { booking: Booking }) {
    const labelWidth = 'w-[150px]';
    const { destroy, processing: deleteProcessing } = useDelete();
    const { updateStatus, processing: updateProcessing } = useUpdateStatus('pending');

    const handleStatusChange = () => {
        updateStatus({
            routeName: 'bookings.updateStatus',
            id: booking.id,
            label: `#${booking.id}`,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bookings - Show" />
            <div className="p-4">
                <div className="mb-8 flex justify-between gap-2">
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/bookings">Back</Link>
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleStatusChange}
                            disabled={deleteProcessing || updateProcessing}
                        >
                            Mark as Pending
                        </Button>
                        <Link
                            className={buttonVariants({ variant: 'default' })}
                            href={`/bookings/${booking.id}/edit`}
                            disabled={deleteProcessing || updateProcessing}
                        >
                            Edit
                        </Link>
                        {booking.status === 1 && (
                            <Button
                                variant="destructive"
                                onClick={() =>
                                    destroy('bookings.destroy', booking.id, `#${booking.id}`)
                                }
                                disabled={deleteProcessing || updateProcessing}
                            >
                                Delete
                            </Button>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                        {booking.room.image?.name && (
                            <img
                                src={`/storage/${booking.room.image?.name}`}
                                alt={booking.room.name}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                        )}
                        <h1 className="text-2xl font-bold">
                            #{booking.id}{' '}
                            <a
                                href={`/rooms/${booking.room.id}`}
                                target="_blank"
                                className="underline"
                            >
                                {booking.room.name}
                            </a>
                        </h1>
                        <Badge
                            variant="outline"
                            className={bookingStatus[booking.status - 1].badgeClass}
                        >
                            {bookingStatus[booking.status - 1].label}
                        </Badge>
                    </div>
                    <div className="grid w-full grid-cols-12 gap-2">
                        <div className="col-span-6 mt-4">
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableHead colSpan={2}>
                                            <h2 className="text-lg font-bold">Customer</h2>
                                        </TableHead>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={labelWidth}>Name</TableHead>
                                        <TableCell>{booking.customer_name}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={labelWidth}>Email</TableHead>
                                        <TableCell>{booking.customer_email}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={labelWidth}>Phone</TableHead>
                                        <TableCell>{booking.customer_phone}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                        <div className="col-span-6 mt-4">
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableHead colSpan={2}></TableHead>
                                    </TableRow>
                                    <TableRow className="border-b-0">
                                        <TableHead colSpan={2}>Notes</TableHead>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={2} className="whitespace-normal">
                                            {booking.note || '-'}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                        <div className="col-span-6 mt-4">
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableHead colSpan={2}>
                                            <h2 className="text-lg font-bold">Booking</h2>
                                        </TableHead>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={labelWidth}>Layout</TableHead>
                                        <TableCell>{booking.layout.name}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={labelWidth}>Date</TableHead>
                                        <TableCell>{booking.start_date}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={labelWidth}>Time</TableHead>
                                        <TableCell>
                                            {booking.start_time.slice(0, 5)} -{' '}
                                            {booking.end_time.slice(0, 5)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                        <div className="col-span-6 mt-4">
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableHead colSpan={2}></TableHead>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={labelWidth}>Room Price</TableHead>
                                        <TableCell>
                                            {booking.room.price ? `₱ ${booking.room.price}` : '-'}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={labelWidth}>Quantity</TableHead>
                                        <TableCell>{booking.qty}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={labelWidth}>Total Price</TableHead>
                                        <TableCell>
                                            {booking.room.price
                                                ? `₱ ${(
                                                      parseFloat(booking.room.price.toString()) *
                                                      booking.qty
                                                  ).toFixed(2)}`
                                                : '-'}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                        <div className="col-span-6 mt-4">
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableHead colSpan={2}>
                                            <h2 className="text-lg font-bold">History</h2>
                                        </TableHead>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={labelWidth}>Created</TableHead>
                                        <TableCell>
                                            {dayjs(booking.created_at).format('YYYY-MM-DD HH:mm')}{' '}
                                            by {booking.owner?.name}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={labelWidth}>Updated</TableHead>
                                        <TableCell>
                                            {dayjs(booking.updated_at).format('YYYY-MM-DD HH:mm')}{' '}
                                            by {booking.updater?.name}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
