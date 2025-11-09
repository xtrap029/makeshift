import FilterDialog from '@/components/custom/filter-dialog';
import Header from '@/components/custom/page/header';
import Pagination from '@/components/custom/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { MailLog, type BreadcrumbItem } from '@/types';
import { PaginatedData } from '@/types/pagination';
import { Head, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Mails', href: '/logs/mail' },
];

export default function Index({
    mailLogs,
    filters,
}: {
    mailLogs: PaginatedData<MailLog>;
    filters: {
        subject: string | undefined;
        date_from: string | undefined;
        date_to: string | undefined;
    };
}) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterData, setFilterData] = useState<{
        subject: string | undefined;
        date_from: string | undefined;
        date_to: string | undefined;
    }>({
        subject: filters.subject || undefined,
        date_from: filters.date_from || undefined,
        date_to: filters.date_to || undefined,
    });

    const applyFilters = () => {
        router.get(route('logs.mail'), filterData, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mails - List" />
            <div className="p-4">
                <Header title="Mails">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => setIsFilterOpen(true)}
                        >
                            <SlidersHorizontal className="size-4" />
                        </Button>
                    </div>
                </Header>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>To</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mailLogs.data.map((mailLog) => (
                            <TableRow key={mailLog.id}>
                                <TableCell className="pl-3">{mailLog.to}</TableCell>
                                <TableCell>{mailLog.subject}</TableCell>
                                <TableCell>
                                    {dayjs(mailLog.created_at).format('YYYY-MM-DD HH:mm')}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination links={mailLogs.links} />
            </div>
            <FilterDialog
                title="Filter Mails"
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                onApply={applyFilters}
                onClear={() => {
                    setFilterData({
                        subject: undefined,
                        date_from: undefined,
                        date_to: undefined,
                    });
                }}
            >
                <div className="flex flex-wrap gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                        id="subject"
                        type="text"
                        value={filterData.subject || ''}
                        onChange={(e) => setFilterData({ ...filterData, subject: e.target.value })}
                    />
                </div>
                <div className="flex flex-row gap-2">
                    <div className="flex flex-wrap gap-2">
                        <Label htmlFor="date_from">Date From</Label>
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
                        <Label htmlFor="date_to">Date To</Label>
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
            </FilterDialog>
        </AppLayout>
    );
}
