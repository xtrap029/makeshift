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
import { Download, Layers, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Mails', href: '/logs/mail' },
];

interface GroupedLog {
    subject: string;
    count: number;
    last_sent: string;
}

export default function Index({
    mailLogs,
    groupedLogs,
    filters,
    isGrouped,
}: {
    mailLogs: PaginatedData<MailLog> | null;
    groupedLogs: GroupedLog[] | null;
    filters: {
        subject?: string;
        date_from?: string;
        date_to?: string;
        group_by?: string;
    };
    isGrouped: boolean;
}) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterData, setFilterData] = useState({
        subject: filters.subject || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    const applyFilters = () => {
        router.get(
            route('logs.mail'),
            { ...filterData, group_by: filters.group_by },
            { preserveState: true, replace: true },
        );
        setIsFilterOpen(false);
    };

    const toggleGroupBy = () => {
        const newGroupBy = isGrouped ? undefined : 'subject';
        router.get(
            route('logs.mail'),
            { ...filterData, group_by: newGroupBy },
            { preserveState: true, replace: true },
        );
    };

    const buildExportUrl = () => {
        const params = new URLSearchParams();
        if (filterData.subject) params.set('subject', filterData.subject);
        if (filterData.date_from) params.set('date_from', filterData.date_from);
        if (filterData.date_to) params.set('date_to', filterData.date_to);
        const qs = params.toString();
        return `/logs/mail/export${qs ? '?' + qs : ''}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mails - List" />
            <div className="p-4">
                <Header title="Mails">
                    <div className="flex gap-2">
                        <a href={buildExportUrl()} download>
                            <Button variant="outline" className="cursor-pointer">
                                <Download className="mr-1 size-4" />
                                Export Emails
                            </Button>
                        </a>
                        <Button
                            variant={isGrouped ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={toggleGroupBy}
                            title="Group by Subject"
                        >
                            <Layers className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => setIsFilterOpen(true)}
                        >
                            <SlidersHorizontal className="size-4" />
                        </Button>
                    </div>
                </Header>

                {isGrouped ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Subject</TableHead>
                                <TableHead>Count</TableHead>
                                <TableHead>Last Sent</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {groupedLogs?.map((log, i) => (
                                <TableRow key={i}>
                                    <TableCell className="pl-3">{log.subject}</TableCell>
                                    <TableCell>{log.count}</TableCell>
                                    <TableCell>
                                        {dayjs(log.last_sent).format('YYYY-MM-DD HH:mm')}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>To</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mailLogs?.data.map((mailLog) => (
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
                        {mailLogs && <Pagination links={mailLogs.links} />}
                    </>
                )}
            </div>
            <FilterDialog
                title="Filter Mails"
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                onApply={applyFilters}
                onClear={() => {
                    setFilterData({ subject: '', date_from: '', date_to: '' });
                }}
            >
                <div className="flex flex-wrap gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                        id="subject"
                        type="text"
                        value={filterData.subject}
                        onChange={(e) => setFilterData({ ...filterData, subject: e.target.value })}
                    />
                </div>
                <div className="flex flex-row gap-2">
                    <div className="flex flex-wrap gap-2">
                        <Label htmlFor="date_from">Date From</Label>
                        <Input
                            id="date_from"
                            type="date"
                            value={filterData.date_from}
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
                            value={filterData.date_to}
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
