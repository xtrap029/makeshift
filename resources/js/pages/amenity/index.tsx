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
import AppLayout from '@/layouts/app-layout';
import { Amenity, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Pencil, Trash } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Amenities', href: '/amenities' },
];

type IndexProps = {
    amenities: Amenity[];
};

export default function Index({ amenities }: IndexProps) {
    const { processing, delete: deleteAmenity } = useForm();

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            deleteAmenity(route('amenities.destroy', { id }), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Amenities - List" />
            <div className="p-4">
                <div className="flex justify-end">
                    <Link
                        className={buttonVariants({ variant: 'default' })}
                        href="/amenities/create"
                    >
                        Create
                    </Link>
                </div>
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
                        {amenities.map((amenity) => (
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
                                    >
                                        <Pencil />
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        className="cursor-pointer"
                                        onClick={() => handleDelete(amenity.id, amenity.name)}
                                        disabled={processing}
                                    >
                                        <Trash />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
