import FilterDialog from '@/components/custom/filter-dialog';
import Header from '@/components/custom/page/header';
import Pagination from '@/components/custom/pagination';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDelete } from '@/hooks/use-delete';
import AppLayout from '@/layouts/app-layout';
import { Discount, Room, type BreadcrumbItem } from '@/types';
import { PaginatedData } from '@/types/pagination';
import { priceDisplay } from '@/utils/formatters';
import { Head, Link, router } from '@inertiajs/react';
import { Check, Pencil, SlidersHorizontal, Trash, TriangleAlert } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Discounts', href: '/discounts' },
];

type Filters = {
    name: string | undefined;
    rooms: number[];
    type: string | undefined;
    status: string | undefined;
};

const dateRange = (from: string, to: string) => `${from} → ${to}`;

export default function Index({
    discounts,
    rooms,
    filters,
}: {
    discounts: PaginatedData<Discount>;
    rooms: Room[];
    filters: Filters;
}) {
    const { destroy, processing } = useDelete();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [resetToken, setResetToken] = useState(0);
    const [filterData, setFilterData] = useState<Filters>({
        name: filters.name || undefined,
        rooms: filters.rooms || [],
        type: filters.type || undefined,
        status: filters.status || undefined,
    });

    const applyFilters = () => {
        router.get(route('discounts.index'), filterData, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Discounts - List" />
            <div className="p-4">
                <Header title="Discounts">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            disabled={processing}
                            className="cursor-pointer"
                            onClick={() => setIsFilterOpen(true)}
                        >
                            <SlidersHorizontal className="size-4" />
                        </Button>
                        <Link
                            className={buttonVariants({ variant: 'default' })}
                            href="/discounts/create"
                            disabled={processing}
                        >
                            Create
                        </Link>
                    </div>
                </Header>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Discount</TableHead>
                            <TableHead>Rooms</TableHead>
                            <TableHead>Reservation Dates</TableHead>
                            <TableHead>Booking Period</TableHead>
                            <TableHead className="text-center">Priority</TableHead>
                            <TableHead className="text-center">Active</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {discounts.data.map((discount) => (
                            <TableRow key={discount.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {discount.name}
                                        {discount.overlaps && discount.overlaps.length > 0 && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <TriangleAlert className="size-4 text-amber-500" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Overlaps with{' '}
                                                        {discount.overlaps.join(', ')}. The lowest
                                                        priority number wins.
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </div>
                                    {discount.description && (
                                        <div className="text-muted-foreground text-xs">
                                            {discount.description}
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {Number(discount.type) === 2
                                        ? `${Number(discount.value)}%`
                                        : priceDisplay(Number(discount.value))}
                                    <span className="text-muted-foreground"> /hr</span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {discount.rooms?.slice(0, 1).map((room) => (
                                            <Badge key={room.id} variant="outline">
                                                {room.name}
                                            </Badge>
                                        ))}
                                        {discount.rooms && discount.rooms.length > 1 && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Badge
                                                            variant="outline"
                                                            className="cursor-default"
                                                        >
                                                            +{discount.rooms.length - 1} more
                                                        </Badge>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {discount.rooms
                                                            .slice(1)
                                                            .map((room) => room.name)
                                                            .join(', ')}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm">
                                    {dateRange(discount.reserve_from, discount.reserve_to)}
                                </TableCell>
                                <TableCell className="text-sm">
                                    {dateRange(discount.book_from, discount.book_to)}
                                </TableCell>
                                <TableCell className="text-center">{discount.priority}</TableCell>
                                <TableCell className="text-center">
                                    {discount.is_active ? (
                                        <Check className="mx-auto text-green-500" />
                                    ) : (
                                        ''
                                    )}
                                </TableCell>
                                <TableCell className="flex justify-end gap-2">
                                    <Link
                                        className={buttonVariants({ variant: 'ghost' })}
                                        href={`/discounts/${discount.id}/edit`}
                                        disabled={processing}
                                    >
                                        <Pencil />
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        onClick={() =>
                                            destroy('discounts.destroy', discount.id, discount.name)
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
                <Pagination links={discounts.links} />
            </div>
            <FilterDialog
                title="Filter Discounts"
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                onApply={applyFilters}
                onClear={() => {
                    setFilterData({
                        name: undefined,
                        rooms: [],
                        type: undefined,
                        status: undefined,
                    });
                    setResetToken((n) => n + 1);
                }}
                processing={processing}
            >
                <div className="flex flex-wrap gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        key={`name-${resetToken}`}
                        id="name"
                        type="text"
                        value={filterData.name || ''}
                        onChange={(e) => setFilterData({ ...filterData, name: e.target.value })}
                        disabled={processing}
                        placeholder="Search name"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                        key={`status-${resetToken}`}
                        value={filterData.status || ''}
                        onValueChange={(value) => setFilterData({ ...filterData, status: value })}
                        disabled={processing}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Active</SelectItem>
                            <SelectItem value="0">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                        key={`type-${resetToken}`}
                        value={filterData.type || ''}
                        onValueChange={(value) => setFilterData({ ...filterData, type: value })}
                        disabled={processing}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Fixed Amount</SelectItem>
                            <SelectItem value="2">Percentage</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Label htmlFor="rooms">Rooms</Label>
                    <MultiSelect
                        key={`rooms-${resetToken}`}
                        options={rooms.map((room) => ({
                            value: room.id.toString(),
                            label: room.name,
                        }))}
                        onValueChange={(tags) =>
                            setFilterData({ ...filterData, rooms: tags.map(Number) })
                        }
                        defaultValue={filterData.rooms.map(String)}
                        placeholder="Select rooms"
                        variant="inverted"
                    />
                </div>
            </FilterDialog>
        </AppLayout>
    );
}
