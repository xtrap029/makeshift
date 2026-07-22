import Header from '@/components/custom/page/header';
import Pagination from '@/components/custom/pagination';
import { Button, buttonVariants } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useDelete } from '@/hooks/use-delete';
import AppLayout from '@/layouts/app-layout';
import { Source, type BreadcrumbItem } from '@/types';
import { PaginatedData } from '@/types/pagination';
import { Head, Link } from '@inertiajs/react';
import { Pencil, Trash } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Sources', href: '/sources' },
];

export default function Index({ sources }: { sources: PaginatedData<Source> }) {
    const { destroy, processing } = useDelete();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sources - List" />
            <div className="p-4">
                <Header title="Sources">
                    <Link
                        className={buttonVariants({ variant: 'default' })}
                        href="/sources/create"
                        disabled={processing}
                    >
                        Create
                    </Link>
                </Header>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sources.data.map((source) => (
                            <TableRow key={source.id}>
                                <TableCell>{source.name}</TableCell>
                                <TableCell>{source.description}</TableCell>
                                <TableCell className="flex justify-end gap-2">
                                    <Link
                                        className={buttonVariants({ variant: 'ghost' })}
                                        href={`/sources/${source.id}/edit`}
                                        disabled={processing}
                                    >
                                        <Pencil />
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        onClick={() =>
                                            destroy('sources.destroy', source.id, source.name)
                                        }
                                        disabled={processing}
                                    >
                                        <Trash />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination links={sources.links} />
            </div>
        </AppLayout>
    );
}
