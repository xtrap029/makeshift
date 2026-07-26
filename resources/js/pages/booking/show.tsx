import Countdown from '@/components/custom/countdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import { Textarea } from '@/components/ui/textarea';
import { bookingStatus } from '@/constants';
import { useDelete } from '@/hooks/use-delete';
import { useUpdateStatus } from '@/hooks/use-update-status';
import AppLayout from '@/layouts/app-layout';
import { Booking, BreadcrumbItem } from '@/types';
import { priceDisplay } from '@/utils/formatters';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import dayjs from 'dayjs';
import {
    ArrowRight,
    CheckCircle,
    Circle,
    CircleDashed,
    CircleFadingArrowUp,
    CircleX,
    Loader2,
    RefreshCw,
    Send,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ShowPayment from './show-payment';

type DiscountLine = { name: string; type: number; value: number; amount: number };
type RecalcSide = { discounts: DiscountLine[]; discount_amount: number; total_price: number };
type RecalcPreview = { subtotal: number; before: RecalcSide; after: RecalcSide; changed: boolean };

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Bookings', href: '/bookings' },
    { title: 'Show', href: '/bookings/show' },
];

const CANCEL_REASONS = [
    'Guest request',
    'Non-payment',
    'Room unavailable',
    'Maintenance issue',
    'Policy violation',
    'Other',
];

export default function Show({ booking }: { booking: Booking }) {
    const labelWidth = 'w-[150px]';
    const { destroy, processing: deleteProcessing } = useDelete();
    const [isCanceledDialogOpen, setIsCanceledDialogOpen] = useState(false);
    const [bookingCancelReason, setBookingCancelReason] = useState(booking.cancel_reason || '');

    const updateStatusConfig = {
        id: booking.id,
        label: `#${booking.id}`,
    };
    const { updateStatus: updateToInquiryStatus, processing: updateToInquiryProcessing } =
        useUpdateStatus('inquiry');
    const { updateStatus: updateToPendingStatus, processing: updateToPendingProcessing } =
        useUpdateStatus('pending');
    const { updateStatus: updateToCanceledStatus, processing: updateToCanceledProcessing } =
        useUpdateStatus('canceled', bookingCancelReason);
    const { updateStatus: updateToConfirmedStatus, processing: updateToConfirmedProcessing } =
        useUpdateStatus('confirmed');
    const [isEmailProcessing, setIsEmailProcessing] = useState(false);
    const [isRecalculating, setIsRecalculating] = useState(false);
    const [isRecalcDialogOpen, setIsRecalcDialogOpen] = useState(false);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [recalcPreview, setRecalcPreview] = useState<RecalcPreview | null>(null);

    const isAnyProcessing =
        deleteProcessing ||
        updateToInquiryProcessing ||
        updateToPendingProcessing ||
        updateToCanceledProcessing ||
        updateToConfirmedProcessing ||
        isEmailProcessing ||
        isRecalculating;

    const isEditableStatus = ['Inquiry', 'Pending'].includes(
        bookingStatus.find((status) => status.id === booking.status)?.label || ''
    );

    const openRecalculatePreview = async () => {
        setIsRecalcDialogOpen(true);
        setIsPreviewLoading(true);
        setRecalcPreview(null);
        try {
            const { data } = await axios.get<RecalcPreview>(
                `/api/bookings/${booking.id}/preview-discount`
            );
            setRecalcPreview(data);
        } catch {
            toast.error('Failed to load discount preview');
            setIsRecalcDialogOpen(false);
        } finally {
            setIsPreviewLoading(false);
        }
    };

    const confirmRecalculate = () => {
        setIsRecalcDialogOpen(false);
        setIsRecalculating(true);
        router.get(
            `/bookings/${booking.id}/recalculate-discount`,
            {},
            { onFinish: () => setIsRecalculating(false) }
        );
    };

    useEffect(() => {
        if (!isCanceledDialogOpen) {
            setBookingCancelReason('');
        }
    }, [isCanceledDialogOpen]);

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
                                                onClick={() => setIsCanceledDialogOpen(true)}
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
                            {booking.room.deleted_at ? (
                                <span className="text-gray-500">{booking.room.name}</span>
                            ) : (
                                <a
                                    href={`/rooms/${booking.room.id}`}
                                    target="_blank"
                                    className="underline"
                                >
                                    {booking.room.name}
                                </a>
                            )}
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
                                    <TableRow>
                                        <TableHead className={labelWidth}>Referred By</TableHead>
                                        <TableCell>{booking.referred_by || '—'}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={labelWidth}>Source</TableHead>
                                        <TableCell>{booking.source?.name || '—'}</TableCell>
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
                                    {booking.discounts?.length > 0 && (
                                        <>
                                            <TableRow>
                                                <TableHead className={labelWidth}>
                                                    Subtotal
                                                </TableHead>
                                                <TableCell>
                                                    {priceDisplay(Number(booking.subtotal))}
                                                </TableCell>
                                            </TableRow>
                                            {booking.discounts.map((discount, index) => (
                                                <TableRow key={discount.id}>
                                                    <TableHead className={labelWidth}>
                                                        Discount
                                                        <span className="text-muted-foreground block text-xs font-normal">
                                                            {discount.name}
                                                            {Number(discount.type) === 2
                                                                ? ` (${Number(discount.value)}% off/hr)`
                                                                : ` (${priceDisplay(Number(discount.value))} off/hr)`}
                                                        </span>
                                                    </TableHead>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-green-600">
                                                                - {priceDisplay(Number(discount.amount))}
                                                            </span>
                                                            {isEditableStatus &&
                                                                index === booking.discounts.length - 1 && (
                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="size-7"
                                                                        disabled={isAnyProcessing}
                                                                        title="Recalculate discount"
                                                                        onClick={openRecalculatePreview}
                                                                    >
                                                                        <RefreshCw className="size-3.5" />
                                                                    </Button>
                                                                )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </>
                                    )}
                                    {isEditableStatus && !(booking.discounts?.length > 0) && (
                                        <TableRow>
                                            <TableHead className={labelWidth}>Discount</TableHead>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="size-7"
                                                    disabled={isAnyProcessing}
                                                    title="Recalculate discount"
                                                    onClick={openRecalculatePreview}
                                                >
                                                    <RefreshCw className="size-3.5" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )}
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
            <Dialog open={isCanceledDialogOpen} onOpenChange={setIsCanceledDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogDescription className="flex flex-col gap-2" asChild>
                            <div>
                                <DialogTitle>Cancel Booking</DialogTitle>
                                <p className="pt-3">
                                    Are you sure you want to cancel this booking?
                                </p>
                                <Textarea
                                    value={bookingCancelReason}
                                    onChange={(e) => setBookingCancelReason(e.target.value)}
                                    placeholder="Enter Cancel Reason"
                                />
                                <div className="flex flex-wrap gap-2">
                                    {CANCEL_REASONS.map((reason) => (
                                        <Badge
                                            key={reason}
                                            variant="outline"
                                            className="cursor-pointer"
                                            onClick={() => setBookingCancelReason(reason)}
                                        >
                                            {reason}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsCanceledDialogOpen(false)}
                                        className="cursor-pointer"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            updateToCanceledStatus(updateStatusConfig);
                                            setIsCanceledDialogOpen(false);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        Cancel Now
                                    </Button>
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <Dialog open={isRecalcDialogOpen} onOpenChange={setIsRecalcDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Recalculate Discount</DialogTitle>
                        <DialogDescription>
                            Re-checks this booking&apos;s room and dates against active
                            discounts. Review the change below before applying it.
                        </DialogDescription>
                    </DialogHeader>
                    {isPreviewLoading && (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="text-muted-foreground size-6 animate-spin" />
                        </div>
                    )}
                    {!isPreviewLoading && recalcPreview && (
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-2 rounded-lg border p-3">
                                    <div className="text-muted-foreground text-xs font-semibold uppercase">
                                        Before
                                    </div>
                                    {recalcPreview.before.discounts.length > 0 ? (
                                        recalcPreview.before.discounts.map((d, i) => (
                                            <div key={i} className="text-sm">
                                                <div className="font-medium">{d.name}</div>
                                                <div className="text-green-600">
                                                    - {priceDisplay(d.amount)}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-muted-foreground text-sm">
                                            No discount
                                        </div>
                                    )}
                                    <div className="mt-1 border-t pt-2 text-sm font-bold">
                                        {priceDisplay(recalcPreview.before.total_price)}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 rounded-lg border p-3">
                                    <div className="text-muted-foreground text-xs font-semibold uppercase">
                                        After
                                    </div>
                                    {recalcPreview.after.discounts.length > 0 ? (
                                        recalcPreview.after.discounts.map((d, i) => (
                                            <div key={i} className="text-sm">
                                                <div className="font-medium">{d.name}</div>
                                                <div className="text-green-600">
                                                    - {priceDisplay(d.amount)}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-muted-foreground text-sm">
                                            No discount
                                        </div>
                                    )}
                                    <div className="mt-1 border-t pt-2 text-sm font-bold">
                                        {priceDisplay(recalcPreview.after.total_price)}
                                    </div>
                                </div>
                            </div>
                            {recalcPreview.changed ? (
                                <div className="flex items-center justify-center gap-2 text-sm">
                                    <span>{priceDisplay(recalcPreview.before.total_price)}</span>
                                    <ArrowRight className="text-muted-foreground size-4" />
                                    <span className="font-bold">
                                        {priceDisplay(recalcPreview.after.total_price)}
                                    </span>
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center text-sm">
                                    No change — this booking already reflects the current
                                    discounts.
                                </p>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsRecalcDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isPreviewLoading || !recalcPreview}
                            onClick={confirmRecalculate}
                        >
                            {recalcPreview?.changed ? 'Apply Change' : 'Recalculate Anyway'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
