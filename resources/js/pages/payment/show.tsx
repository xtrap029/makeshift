import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { bookingStatus, paymentStatus } from '@/constants';
import { useDelete } from '@/hooks/use-delete';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Payment } from '@/types';
import { priceDisplay } from '@/utils/formatters';
import { Head, Link } from '@inertiajs/react';
import dayjs from 'dayjs';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Payments', href: '/payments' },
    { title: 'Show', href: '/payments/show' },
];

export default function Show({ payment }: { payment: Payment }) {
    const labelWidth = 'w-[150px]';
    const { destroy, processing } = useDelete();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payments - Show" />
            <div className="p-4">
                <div className="mb-8 flex justify-between gap-2">
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/payments">Back</Link>
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        {['Inquiry', 'Pending'].includes(
                            bookingStatus.find((status) => status.id === payment.booking.status)
                                ?.label || ''
                        ) && (
                            <Link
                                className={buttonVariants({ variant: 'default' })}
                                href={`/payments/${payment.id}/edit`}
                                disabled={processing}
                            >
                                Edit
                            </Link>
                        )}
                        {['Inquiry', 'Pending'].includes(
                            bookingStatus.find((status) => status.id === payment.booking.status)
                                ?.label || ''
                        ) && (
                            <Button
                                variant="destructive"
                                onClick={() =>
                                    destroy(
                                        'payments.destroy',
                                        payment.id,
                                        payment.reference_number || `#${payment.id}`
                                    )
                                }
                                disabled={processing}
                            >
                                Delete
                            </Button>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold">{payment.reference_number}</h1>
                        <div className="flex items-center gap-1">
                            <Badge
                                variant="outline"
                                className={
                                    paymentStatus.find((status) => status.id === payment.status)
                                        ?.badgeClass
                                }
                            >
                                {
                                    paymentStatus.find((status) => status.id === payment.status)
                                        ?.label
                                }
                            </Badge>
                        </div>
                    </div>
                    <div className="grid w-full grid-cols-12 gap-2">
                        <div className="col-span-6 mt-4">
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableHead colSpan={2}>
                                            <h2 className="text-lg font-bold">Details</h2>
                                        </TableHead>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={labelWidth}>
                                            Payment Provider
                                        </TableHead>
                                        <TableCell>{payment.payment_provider?.name}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={labelWidth}>Booking</TableHead>
                                        <TableCell className="flex items-center gap-2">
                                            <a
                                                href={`/bookings/${payment.booking.id}`}
                                                target="_blank"
                                                className="underline"
                                            >
                                                #{payment.booking?.booking_id}
                                            </a>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    bookingStatus.find(
                                                        (status) =>
                                                            status.id === payment.booking?.status
                                                    )?.badgeClass
                                                }
                                            >
                                                {
                                                    bookingStatus.find(
                                                        (status) =>
                                                            status.id === payment.booking?.status
                                                    )?.label
                                                }
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={labelWidth}>Room</TableHead>
                                        <TableCell>
                                            {payment.booking?.room?.deleted_at ? (
                                                <span className="text-sm text-gray-500">
                                                    {payment.booking?.room?.name}
                                                </span>
                                            ) : (
                                                <a
                                                    href={`/rooms/${payment.booking?.room?.id}`}
                                                    target="_blank"
                                                    className="underline"
                                                >
                                                    {payment.booking?.room?.name}
                                                </a>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={labelWidth}>Amount</TableHead>
                                        <TableCell>
                                            {priceDisplay(Number(payment.amount))}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={labelWidth}>Amount Paid</TableHead>
                                        <TableCell>
                                            {priceDisplay(Number(payment.amount_paid))}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={labelWidth}>Paid At</TableHead>
                                        <TableCell>
                                            {payment.paid_at
                                                ? dayjs(payment.paid_at).format('YYYY-MM-DD HH:mm')
                                                : '-'}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={labelWidth}>PR/PO ID</TableHead>
                                        <TableCell>
                                            {payment.pr_no ? (
                                                <a
                                                    href={`${import.meta.env.VITE_PRPO_URL}/transaction/view/${payment.pr_no}`}
                                                    target="_blank"
                                                    className="underline"
                                                >
                                                    {payment.pr_no}
                                                </a>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={labelWidth}>Attachment</TableHead>
                                        <TableCell>
                                            {payment.attachment ? (
                                                <a
                                                    href={`/storage/${payment.attachment}`}
                                                    target="_blank"
                                                    className="underline"
                                                >
                                                    View Attachment
                                                </a>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={labelWidth}>Note</TableHead>
                                        <TableCell>{payment.note || '-'}</TableCell>
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
                                            {dayjs(payment.created_at).format('YYYY-MM-DD HH:mm')}{' '}
                                            by {payment.owner?.name || 'N/A'}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className={labelWidth}>Updated</TableHead>
                                        <TableCell>
                                            {dayjs(payment.updated_at).format('YYYY-MM-DD HH:mm')}{' '}
                                            by {payment.updater?.name || 'N/A'}
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
