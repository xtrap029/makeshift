import Header from '@/components/custom/page/header';
import Pagination from '@/components/custom/pagination';
import { Button, buttonVariants } from '@/components/ui/button';
import IconDynamic from '@/components/ui/icon-dynamic';
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
import { Amenity, type BreadcrumbItem } from '@/types';
import { PaginatedData } from '@/types/pagination';
import { Head, Link } from '@inertiajs/react';
import { Pencil, Trash } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Amenities', href: '/amenities' },
];

export default function Index({ amenities }: { amenities: PaginatedData<Amenity> }) {
    const { destroy, processing } = useDelete();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Amenities - List" />
            <div className="p-4">
                <Header title="Amenities">
                    <Link
                        className={buttonVariants({ variant: 'default' })}
                        href="/amenities/create"
                        disabled={processing}
                    >
                        Create
                    </Link>
                </Header>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Icon</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {amenities.data.map((amenity) => (
                            <TableRow key={amenity.id}>
                                <TableCell className="pl-3">
                                    {amenity.icon ? (
                                        <IconDynamic name={amenity.icon} className="size-4" />
                                    ) : (
                                        '-'
                                    )}
                                </TableCell>
                                <TableCell>{amenity.name}</TableCell>
                                <TableCell>{amenity.description}</TableCell>
                                <TableCell className="flex justify-end gap-2">
                                    <Link
                                        className={buttonVariants({ variant: 'ghost' })}
                                        href={`/amenities/${amenity.id}/edit`}
                                        disabled={processing}
                                    >
                                        <Pencil />
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        onClick={() =>
                                            destroy('amenities.destroy', amenity.id, amenity.name)
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
                <Pagination links={amenities.links} />
            </div>
        </AppLayout>
    );
}
