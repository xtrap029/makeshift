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
import { Layout, type BreadcrumbItem } from '@/types';
import { PaginatedData } from '@/types/pagination';
import { Head, Link } from '@inertiajs/react';
import { Pencil, Trash } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Layouts', href: '/layouts' },
];

export default function Index({ layouts }: { layouts: PaginatedData<Layout> }) {
    const { destroy, processing } = useDelete();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Layouts - List" />
            <div className="p-4">
                <Header title="Layouts">
                    <Link
                        className={buttonVariants({ variant: 'default' })}
                        href="/layouts/create"
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
                        {layouts.data.map((layout) => (
                            <TableRow key={layout.id}>
                                <TableCell>{layout.name}</TableCell>
                                <TableCell>{layout.description}</TableCell>
                                <TableCell className="flex justify-end gap-2">
                                    <Link
                                        className={buttonVariants({ variant: 'ghost' })}
                                        href={`/layouts/${layout.id}/edit`}
                                        disabled={processing}
                                    >
                                        <Pencil />
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        onClick={() =>
                                            destroy('layouts.destroy', layout.id, layout.name)
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
                <Pagination links={layouts.links} />
            </div>
        </AppLayout>
    );
}
