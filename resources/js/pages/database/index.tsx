import Header from '@/components/custom/page/header';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Download } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Database', href: '/database' },
];

type BackupFile = {
    name: string;
    size: number;
    lastModified: string;
    downloadUrl: string;
};

export default function Index({ backups }: { backups: BackupFile[] }) {
    const [processing, setProcessing] = useState(false);

    const handleManualBackup = () => {
        setProcessing(true);
        router.post(
            '/database/backups',
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            }
        );
    };

    const formattedBackups = useMemo(
        () =>
            backups.map((backup) => ({
                ...backup,
                formattedDate: new Date(backup.lastModified).toLocaleString(),
                formattedSize: formatSize(backup.size),
            })),
        [backups]
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Database - List" />
            <div className="p-4">
                <Header title="Database">
                    <div className="flex gap-2">
                        <Button
                            className="cursor-pointer"
                            onClick={handleManualBackup}
                            disabled={processing}
                        >
                            {processing ? 'Backing up...' : 'Manual Backup'}
                        </Button>
                    </div>
                </Header>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {formattedBackups.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={3}
                                    className="text-muted-foreground text-center text-sm"
                                >
                                    No backups found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            formattedBackups.map((backup) => (
                                <TableRow key={backup.name}>
                                    <TableCell>{backup.formattedDate}</TableCell>
                                    <TableCell>{backup.formattedSize}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            className="cursor-pointer"
                                            onClick={() => {
                                                window.location.href = backup.downloadUrl;
                                            }}
                                        >
                                            <Download />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}

function formatSize(bytes: number): string {
    if (bytes === 0) {
        return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, index);

    return `${size.toFixed(size >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}
