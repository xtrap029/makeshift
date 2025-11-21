import FilterDialog from '@/components/custom/filter-dialog';
import Header from '@/components/custom/page/header';
import Pagination from '@/components/custom/pagination';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { Payment, Room, type BreadcrumbItem } from '@/types';
import { PaginatedData } from '@/types/pagination';
import { priceDisplay } from '@/utils/formatters';
import { Head, Link, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { Eye, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Payments', href: '/payments' },
];

export default function Index({
    payments,
    rooms,
    filters,
}: {
    payments: PaginatedData<Payment>;
    rooms: Room[];
    filters: {
        date_from: string | undefined;
        date_to: string | undefined;
        rooms: number[];
        status: string | undefined;
        reference_number: string | undefined;
        note: string | undefined;
    };
}) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [resetToken, setResetToken] = useState(0);
    const [filterData, setFilterData] = useState<{
        date_from: string | undefined;
        date_to: string | undefined;
        rooms: number[];
        status: string | undefined;
        reference_number: string | undefined;
        note: string | undefined;
    }>({
        date_from: filters.date_from || undefined,
        date_to: filters.date_to || undefined,
        rooms: filters.rooms || [],
        status: filters.status || undefined,
        reference_number: filters.reference_number || undefined,
        note: filters.note || undefined,
    });

    const applyFilters = () => {
        router.get(route('payments.index'), filterData, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payments - List" />
            <div className="p-4">
                <Header title="Payments">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => setIsFilterOpen(true)}
                        >
                            <SlidersHorizontal className="size-4" />
                        </Button>
                        <Link
                            className={buttonVariants({ variant: 'default' })}
                            href="/payments/create"
                        >
                            Create
                        </Link>
                    </div>
                </Header>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Reference Number</TableHead>
                            <TableHead>PR/PO ID</TableHead>
                            <TableHead>Booking</TableHead>
                            <TableHead>Room</TableHead>
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
                                <TableCell>
                                    <a
                                        href={`/bookings/${payment.booking.id}`}
                                        target="_blank"
                                        className="underline"
                                    >
                                        #{payment.booking?.booking_id}
                                    </a>
                                </TableCell>
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
            <FilterDialog
                title="Filter Payments"
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                onApply={applyFilters}
                onClear={() => {
                    setFilterData({
                        date_from: undefined,
                        date_to: undefined,
                        rooms: [],
                        status: undefined,
                        reference_number: undefined,
                        note: undefined,
                    });
                    setResetToken((n) => n + 1);
                }}
            >
                <div className="flex flex-wrap gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                        key={`status-${resetToken}`}
                        value={filterData.status || ''}
                        onValueChange={(value) => {
                            setFilterData({
                                ...filterData,
                                status: value,
                            });
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                            {paymentStatusConstants.map((status) => (
                                <SelectItem key={status.id} value={status.id.toString()}>
                                    {status.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-row gap-2">
                    <div className="flex flex-wrap gap-2">
                        <Label htmlFor="date_from">Paid Date From</Label>
                        <Input
                            id="date_from"
                            type="date"
                            value={filterData.date_from || ''}
                            onChange={(e) =>
                                setFilterData({ ...filterData, date_from: e.target.value })
                            }
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Label htmlFor="date_to">Paid Date To</Label>
                        <Input
                            id="date_to"
                            type="date"
                            value={filterData.date_to || ''}
                            onChange={(e) =>
                                setFilterData({ ...filterData, date_to: e.target.value })
                            }
                        />
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Label htmlFor="rooms">Rooms</Label>
                    <MultiSelect
                        key={`rooms-${resetToken}`}
                        options={rooms.map((room) => ({
                            value: room.id.toString(),
                            label: room.name,
                        }))}
                        onValueChange={(tags) => {
                            setFilterData({
                                ...filterData,
                                rooms: tags.map(Number),
                            });
                        }}
                        defaultValue={filterData.rooms.map(String)}
                        placeholder="Select rooms"
                        variant="inverted"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <Label htmlFor="reference_number">Reference Number</Label>
                    <Input
                        id="reference_number"
                        type="text"
                        value={filterData.reference_number || ''}
                        onChange={(e) =>
                            setFilterData({ ...filterData, reference_number: e.target.value })
                        }
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <Label htmlFor="note">Note</Label>
                    <Input
                        id="note"
                        type="text"
                        value={filterData.note || ''}
                        onChange={(e) => setFilterData({ ...filterData, note: e.target.value })}
                    />
                </div>
            </FilterDialog>
        </AppLayout>
    );
}
