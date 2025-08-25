import Header from '@/components/custom/page/header';
import Pagination from '@/components/custom/pagination';
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
import { Head } from '@inertiajs/react';
import dayjs from 'dayjs';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Mails', href: '/logs/mail' },
];

export default function Index({ mailLogs }: { mailLogs: PaginatedData<MailLog> }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mails - List" />
            <div className="p-4">
                <Header title="Mails" />
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
        </AppLayout>
    );
}
