import Countdown from '@/components/custom/countdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { bookingStatus } from '@/constants';
import { useDelete } from '@/hooks/use-delete';
import { useUpdateStatus } from '@/hooks/use-update-status';
import AppLayout from '@/layouts/app-layout';
import { Booking, BreadcrumbItem } from '@/types';
import { priceDisplay } from '@/utils/formatters';
import { Head, Link, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import {
    CheckCircle,
    Circle,
    CircleDashed,
    CircleFadingArrowUp,
    CircleX,
    Loader2,
    Send,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import ShowPayment from './show-payment';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Bookings', href: '/bookings' },
    { title: 'Show', href: '/bookings/show' },
];

export default function Show({ booking }: { booking: Booking }) {
    const labelWidth = 'w-[150px]';
    const { destroy, processing: deleteProcessing } = useDelete();

    const updateStatusConfig = {
        routeName: 'bookings.updateStatus',
        id: booking.id,
        label: `#${booking.id}`,
    };
    const { updateStatus: updateToInquiryStatus, processing: updateToInquiryProcessing } =
        useUpdateStatus('inquiry');
    const { updateStatus: updateToPendingStatus, processing: updateToPendingProcessing } =
        useUpdateStatus('pending');
    const { updateStatus: updateToCanceledStatus, processing: updateToCanceledProcessing } =
        useUpdateStatus('canceled');
    const { updateStatus: updateToConfirmedStatus, processing: updateToConfirmedProcessing } =
        useUpdateStatus('confirmed');
    const [isEmailProcessing, setIsEmailProcessing] = useState(false);

    const isAnyProcessing =
        deleteProcessing ||
        updateToInquiryProcessing ||
        updateToPendingProcessing ||
        updateToCanceledProcessing ||
        updateToConfirmedProcessing ||
        isEmailProcessing;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bookings - Show" />
            <div className="p-4">
                <div className="mb-8 flex justify-between gap-2">
                    <div className="flex gap-2">
                        <Link href="/bookings">
                            <Button variant="outline" disabled={isAnyProcessing}>
                                Back
                            </Button>
                        </Link>
                        {bookingStatus.find((status) => status.id === booking.status)?.label !==
                            'Confirmed' && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" disabled={isAnyProcessing}>
                                        <CircleFadingArrowUp size={16} />
                                        Status
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-50" align="start">
                                    {bookingStatus.find((status) => status.id === booking.status)
                                        ?.label === 'Pending' && (
                                        <DropdownMenuItem
                                            onClick={() => {
                                                if (booking.total_paid >= booking.total_price) {
                                                    updateToConfirmedStatus(updateStatusConfig);
                                                } else {
                                                    toast.error(
                                                        'Total paid is less than total price'
                                                    );
                                                }
                                            }}
                                            className="cursor-pointer"
                                        >
                                            Confirmed
                                            <DropdownMenuShortcut>
                                                <CheckCircle size={16} />
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    )}
                                    {bookingStatus.find((status) => status.id === booking.status)
                                        ?.label === 'Inquiry' && (
                                        <DropdownMenuItem
                                            onClick={() =>
                                                updateToPendingStatus(updateStatusConfig)
                                            }
                                            className="cursor-pointer"
                                        >
                                            Pending
                                            <DropdownMenuShortcut>
                                                <Circle size={16} />
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    )}
                                    {['Pending', 'Canceled'].includes(
                                        bookingStatus.find((status) => status.id === booking.status)
                                            ?.label || ''
                                    ) && (
                                        <DropdownMenuItem
                                            onClick={() =>
                                                updateToInquiryStatus(updateStatusConfig)
                                            }
                                            className="cursor-pointer"
                                        >
                                            Inquiry
                                            <DropdownMenuShortcut>
                                                <CircleDashed size={16} />
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    )}
                                    {bookingStatus.find((status) => status.id === booking.status)
                                        ?.label === 'Pending' && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    updateToCanceledStatus(updateStatusConfig)
                                                }
                                                className="cursor-pointer"
                                            >
                                                Canceled
                                                <DropdownMenuShortcut>
                                                    <CircleX size={16} />
                                                </DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                        {['Pending'].includes(
                            bookingStatus.find((status) => status.id === booking.status)?.label ||
                                ''
                        ) && (
                            <Button
                                variant="outline"
                                disabled={isAnyProcessing}
                                onClick={() => {
                                    if (confirm('Are you sure you want to notify the customer?')) {
                                        setIsEmailProcessing(true);
                                        router.get(
                                            `/bookings/${booking.id}/send-acknowledged-email`
                                        );
                                    }
                                }}
                            >
                                {isEmailProcessing ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <Send size={16} />
                                )}
                                {isEmailProcessing ? 'Sending...' : 'Notify'}
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {['Inquiry', 'Pending'].includes(
                            bookingStatus.find((status) => status.id === booking.status)?.label ||
                                ''
                        ) && (
                            <Link href={`/bookings/${booking.id}/edit`}>
                                <Button variant="default" disabled={isAnyProcessing}>
                                    Edit
                                </Button>
                            </Link>
                        )}
                        {bookingStatus.find((status) => status.id === booking.status)?.label ===
                            'Inquiry' && (
                            <Button
                                variant="destructive"
                                onClick={() =>
                                    destroy('bookings.destroy', booking.id, `#${booking.id}`)
                                }
                                disabled={isAnyProcessing}
                            >
                                Delete
                            </Button>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold">
                            #{booking.booking_id}{' '}
                            <a
                                href={`/rooms/${booking.room.id}`}
                                target="_blank"
                                className="underline"
                            >
                                {booking.room.name}
                            </a>
                        </h1>
                        <div className="flex items-center gap-1">
                            <Badge
                                variant="outline"
                                className={
                                    bookingStatus.find((status) => status.id === booking.status)
                                        ?.badgeClass
                                }
                            >
                                {
                                    bookingStatus.find((status) => status.id === booking.status)
                                        ?.label
                                }
                            </Badge>
                            {booking.expires_at &&
                                bookingStatus.find((status) => status.id === booking.status)
                                    ?.label === 'Pending' && (
                                    <Badge
                                        variant="outline"
                                        className={
                                            bookingStatus.find(
                                                (status) => status.id === booking.status
                                            )?.badgeClass
                                        }
                                    >
                                        Expires in <Countdown deadline={booking.expires_at} />
                                    </Badge>
                                )}
                        </div>
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
                                    <TableRow>
                                        <TableHead className={labelWidth}>Total Hours</TableHead>
                                        <TableCell>{booking.total_hours}</TableCell>
                                    </TableRow>
                                    {booking.voucher_code && (
                                        <TableRow>
                                            <TableHead className={labelWidth}>
                                                Voucher Code
                                            </TableHead>
                                            <TableCell>
                                                <Dialog>
                                                    <DialogTrigger className="cursor-pointer underline">
                                                        {booking.voucher_code}
                                                    </DialogTrigger>
                                                    <DialogContent className="w-75 p-3">
                                                        <DialogHeader>
                                                            <DialogDescription className="flex flex-col items-center justify-center gap-2">
                                                                <img
                                                                    src={`/storage/vouchers/${booking.voucher_code}.png`}
                                                                    alt="Voucher Code"
                                                                    className="w-full"
                                                                />
                                                                <p className="text-center text-lg font-bold">
                                                                    {booking.voucher_code}
                                                                </p>
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    )}
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
                                            {booking.room.price
                                                ? priceDisplay(Number(booking.room.price))
                                                : '-'}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={labelWidth}>Quantity</TableHead>
                                        <TableCell>{booking.qty}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={labelWidth}>Computation</TableHead>
                                        <TableCell>
                                            {booking.room.price
                                                ? priceDisplay(Number(booking.room.price))
                                                : '-'}{' '}
                                            x {booking.total_hours} hours x {booking.qty} spaces
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={labelWidth}>Total Price</TableHead>
                                        <TableCell className="font-bold">
                                            {booking.total_price
                                                ? priceDisplay(Number(booking.total_price))
                                                : '-'}
                                        </TableCell>
                                    </TableRow>
                                    {booking.voucher_sent_at && (
                                        <TableRow>
                                            <TableHead className={labelWidth}>
                                                Voucher Sent
                                            </TableHead>
                                            <TableCell>
                                                {dayjs(booking.voucher_sent_at).format(
                                                    'YYYY-MM-DD HH:mm'
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="col-span-12 mt-4">
                            <ShowPayment booking={booking} />
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
                                            by {booking.owner?.name || 'Customer'}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={labelWidth}>Updated</TableHead>
                                        <TableCell>
                                            {dayjs(booking.updated_at).format('YYYY-MM-DD HH:mm')}{' '}
                                            by {booking.updater?.name || 'Customer'}
                                        </TableCell>
                                    </TableRow>
                                    {bookingStatus.find((status) => status.id === booking.status)
                                        ?.label === 'Canceled' &&
                                        booking.cancel_reason && (
                                            <TableRow>
                                                <TableHead className={labelWidth}>
                                                    Cancel Reason
                                                </TableHead>
                                                <TableCell>{booking.cancel_reason}</TableCell>
                                            </TableRow>
                                        )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
