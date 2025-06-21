import { Button, buttonVariants } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { User, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Pencil, Trash } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/users' },
];

type IndexProps = {
    users: User[];
};

export default function Index({ users }: IndexProps) {
    const { processing, delete: deleteUser } = useForm();

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            deleteUser(route('users.destroy', { id }), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users List" />
            <div className="p-4">
                <div className="flex justify-end">
                    <Link className={buttonVariants({ variant: 'default' })} href="/users/create">
                        Create User
                    </Link>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell className="flex justify-end gap-2">
                                    <Link
                                        className={buttonVariants({ variant: 'ghost' })}
                                        href={`/users/${user.id}/edit`}
                                    >
                                        <Pencil />
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        className="cursor-pointer"
                                        onClick={() => handleDelete(user.id, user.name)}
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
