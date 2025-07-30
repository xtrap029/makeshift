import Header from '@/components/custom/page/header';
import Pagination from '@/components/custom/pagination';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { paymentStatus as paymentStatusConstants } from '@/constants';
import AppLayout from '@/layouts/app-layout';
import { Payment, type BreadcrumbItem } from '@/types';
import { PaginatedData } from '@/types/pagination';
import { priceDisplay } from '@/utils/formatters';
import { Head, Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import { Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Payments', href: '/payments' },
];

export default function Index({ payments }: { payments: PaginatedData<Payment> }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payments - List" />
            <div className="p-4">
                <Header title="Payments">
                    <Link
                        className={buttonVariants({ variant: 'default' })}
                        href="/payments/create"
                    >
                        Create
                    </Link>
                </Header>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Reference Number</TableHead>
                            <TableHead>Payment Provider</TableHead>
                            <TableHead>Booking</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.data.map((payment) => (
                            <TableRow key={payment.id}>
                                <TableCell>{payment.id}</TableCell>
                                <TableCell>{payment.reference_number}</TableCell>
                                <TableCell>{payment.payment_provider?.name}</TableCell>
                                <TableCell>
                                    <a
                                        href={`/bookings/${payment.booking.id}`}
                                        target="_blank"
                                        className="underline"
                                    >
                                        #{payment.booking?.id} - {payment.booking?.room?.name}
                                    </a>
                                </TableCell>
                                <TableCell>
                                    {dayjs(payment.created_at).format('YYYY-MM-DD HH:mm')}
                                </TableCell>
                                <TableCell>{priceDisplay(Number(payment.amount))}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={
                                            paymentStatusConstants.find(
                                                (status) => status.id === payment.status
                                            )?.badgeClass
                                        }
                                    >
                                        {
                                            paymentStatusConstants.find(
                                                (status) => status.id === payment.status
                                            )?.label
                                        }
                                    </Badge>
                                </TableCell>
                                <TableCell className="flex justify-end gap-2">
                                    <Link
                                        className={buttonVariants({ variant: 'ghost' })}
                                        href={`/payments/${payment.id}`}
                                    >
                                        <Eye />
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination links={payments.links} />
            </div>
        </AppLayout>
    );
}
