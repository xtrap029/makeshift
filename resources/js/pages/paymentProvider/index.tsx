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
import { PaymentProvider, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Check, Pencil, Trash } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Payment Providers', href: '/payment-providers' },
];

export default function Index({ paymentProviders }: { paymentProviders: PaymentProvider[] }) {
    const { destroy, processing } = useDelete();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment Providers - List" />
            <div className="p-4">
                <div className="flex justify-end">
                    <Link
                        className={buttonVariants({ variant: 'default' })}
                        href="/payment-providers/create"
                        disabled={processing}
                    >
                        Create
                    </Link>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-center">Description</TableHead>
                            <TableHead className="text-center">Default</TableHead>
                            <TableHead className="text-center">Type</TableHead>
                            <TableHead className="text-center">Active</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paymentProviders.map((paymentProvider) => (
                            <TableRow key={paymentProvider.id}>
                                <TableCell>{paymentProvider.name}</TableCell>
                                <TableCell className="text-center">
                                    {paymentProvider.description}
                                </TableCell>
                                <TableCell className="text-center">
                                    {paymentProvider.is_default ? (
                                        <Check className="mx-auto text-green-500" />
                                    ) : (
                                        ''
                                    )}
                                </TableCell>
                                <TableCell className="text-center">
                                    {paymentProvider.is_manual ? 'Manual' : 'Online'}
                                </TableCell>
                                <TableCell className="text-center">
                                    {paymentProvider.is_active ? (
                                        <Check className="mx-auto text-green-500" />
                                    ) : (
                                        ''
                                    )}
                                </TableCell>
                                <TableCell className="flex justify-end gap-2">
                                    <Link
                                        className={buttonVariants({ variant: 'ghost' })}
                                        href={`/payment-providers/${paymentProvider.id}/edit`}
                                        disabled={processing}
                                    >
                                        <Pencil />
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        onClick={() =>
                                            destroy(
                                                'paymentProviders.destroy',
                                                paymentProvider.id,
                                                paymentProvider.name
                                            )
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
            </div>
        </AppLayout>
    );
}
