import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { bookingStatus, paymentStatus } from '@/constants';
import { Booking } from '@/types';
import { priceDisplay } from '@/utils/formatters';
import dayjs from 'dayjs';
import { Plus } from 'lucide-react';

export default function ShowPayment({ booking }: { booking: Booking }) {
    return (
        <Table>
            <TableBody>
                <TableRow>
                    <TableHead colSpan={4}>
                        <h2 className="text-lg font-bold">Payments</h2>
                    </TableHead>
                    {bookingStatus.find((status) => status.id === booking.status)?.label ===
                        'Pending' && (
                        <TableHead className="text-right">
                            <a
                                href={`/payments/create?booking-id=${booking.id}`}
                                className={buttonVariants({
                                    variant: 'ghost',
                                    size: 'sm',
                                })}
                                target="_blank"
                            >
                                <Plus size={16} />
                            </a>
                        </TableHead>
                    )}
                </TableRow>
                {booking.payments.length > 0 ? (
                    <>
                        <TableRow>
                            <TableHead>Reference Number</TableHead>
                            <TableHead>Payment Provider</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">Amount Paid</TableHead>
                        </TableRow>
                        {booking.payments.map((payment) => (
                            <TableRow key={payment.id}>
                                <TableCell>
                                    <a
                                        href={`/payments/${payment.id}`}
                                        target="_blank"
                                        className="underline"
                                    >
                                        {payment.reference_number}
                                    </a>
                                </TableCell>
                                <TableCell>{payment.payment_provider?.name}</TableCell>
                                <TableCell>
                                    {dayjs(payment.created_at).format('YYYY-MM-DD HH:mm')}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={
                                            paymentStatus.find(
                                                (status) => status.id === payment.status
                                            )?.badgeClass
                                        }
                                    >
                                        {
                                            paymentStatus.find(
                                                (status) => status.id === payment.status
                                            )?.label
                                        }
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {priceDisplay(Number(payment.amount))}
                                </TableCell>
                                <TableCell
                                    className={`${
                                        payment.status !==
                                        paymentStatus.find((status) => status.label === 'Paid')?.id
                                            ? 'text-gray-400'
                                            : ''
                                    } text-right`}
                                >
                                    {priceDisplay(Number(payment.amount_paid))}
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={4}></TableCell>
                            <TableCell className="text-right font-bold">Total Paid</TableCell>
                            <TableCell className="text-right">
                                {priceDisplay(Number(booking.total_paid))}
                            </TableCell>
                        </TableRow>
                    </>
                ) : (
                    <TableRow>
                        <TableCell colSpan={6}>No payments yet</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
