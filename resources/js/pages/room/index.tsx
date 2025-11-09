import FilterDialog from '@/components/custom/filter-dialog';
import Header from '@/components/custom/page/header';
import Pagination from '@/components/custom/pagination';
import { Button, buttonVariants } from '@/components/ui/button';
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
import { useDelete } from '@/hooks/use-delete';
import AppLayout from '@/layouts/app-layout';
import { Amenity, Layout, Room, Schedule, type BreadcrumbItem } from '@/types';
import { PaginatedData } from '@/types/pagination';
import { priceDisplay } from '@/utils/formatters';
import { Head, Link, router } from '@inertiajs/react';
import { Check, Eye, Pencil, SlidersHorizontal, Trash } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rooms', href: '/rooms' },
];

export default function Index({
    rooms,
    amenities,
    layouts,
    schedules,
    filters,
}: {
    rooms: PaginatedData<Room>;
    amenities: Amenity[];
    layouts: Layout[];
    schedules: Schedule[];
    filters: {
        schedule_id: string | undefined;
        amenities: number[];
        layouts: number[];
        status: string | undefined;
    };
}) {
    const { destroy, processing } = useDelete();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [resetToken, setResetToken] = useState(0);
    const [filterData, setFilterData] = useState<{
        schedule_id: string | undefined;
        amenities: number[];
        layouts: number[];
        status: string | undefined;
    }>({
        schedule_id: filters.schedule_id || undefined,
        amenities: filters.amenities || [],
        layouts: filters.layouts || [],
        status: filters.status || undefined,
    });

    const applyFilters = () => {
        router.get(route('rooms.index'), filterData, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rooms - List" />
            <div className="p-4">
                <Header title="Rooms">
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
                            href="/rooms/create"
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
                            <TableHead>Price</TableHead>
                            <TableHead className="text-center">Schedule</TableHead>
                            <TableHead className="text-center">Active</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rooms.data.map((room) => (
                            <TableRow key={room.id}>
                                <TableCell>{room.name}</TableCell>
                                <TableCell>
                                    {room.price ? priceDisplay(Number(room.price)) : '-'}
                                </TableCell>
                                <TableCell className="text-center">
                                    {room.schedule?.name || '-'}
                                </TableCell>
                                <TableCell className="text-center">
                                    {room.is_active ? (
                                        <Check className="mx-auto text-green-500" />
                                    ) : (
                                        ''
                                    )}
                                </TableCell>
                                <TableCell className="flex justify-end gap-2">
                                    <Link
                                        className={buttonVariants({ variant: 'ghost' })}
                                        href={`/rooms/${room.id}`}
                                        disabled={processing}
                                    >
                                        <Eye />
                                    </Link>
                                    <Link
                                        className={buttonVariants({ variant: 'ghost' })}
                                        href={`/rooms/${room.id}/edit`}
                                        disabled={processing}
                                    >
                                        <Pencil />
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        onClick={() => destroy('rooms.destroy', room.id, room.name)}
                                        disabled={processing}
                                    >
                                        <Trash />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination links={rooms.links} />
            </div>
            <FilterDialog
                title="Filter Rooms"
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                onApply={applyFilters}
                onClear={() => {
                    setFilterData({
                        schedule_id: undefined,
                        amenities: [],
                        layouts: [],
                        status: undefined,
                    });
                    setResetToken((n) => n + 1);
                }}
                processing={processing}
            >
                <div className="flex flex-wrap gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                        key={`status-${resetToken}`}
                        value={filterData.status || ''}
                        onValueChange={(value) => {
                            setFilterData({
                                ...filterData,
                                status: value,
                            });
                        }}
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
                    <Label htmlFor="schedule">Schedule</Label>
                    <Select
                        value={filterData.schedule_id || ''}
                        onValueChange={(value) => {
                            setFilterData({
                                ...filterData,
                                schedule_id: value,
                            });
                        }}
                        disabled={processing}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a schedule" />
                        </SelectTrigger>
                        <SelectContent>
                            {schedules.map((schedule) => (
                                <SelectItem key={schedule.id} value={schedule.id.toString()}>
                                    {schedule.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Label htmlFor="amenities">Amenities</Label>
                    <MultiSelect
                        key={`amenities-${resetToken}`}
                        options={amenities.map((amenity) => ({
                            value: amenity.id.toString(),
                            label: amenity.name,
                        }))}
                        onValueChange={(tags) => {
                            setFilterData({
                                ...filterData,
                                amenities: tags.map(Number),
                            });
                        }}
                        defaultValue={filterData.amenities.map(String)}
                        placeholder="Select amenities"
                        variant="inverted"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <Label htmlFor="layouts">Layouts</Label>
                    <MultiSelect
                        key={`layouts-${resetToken}`}
                        options={layouts.map((layout) => ({
                            value: layout.id.toString(),
                            label: layout.name,
                        }))}
                        onValueChange={(tags) => {
                            setFilterData({
                                ...filterData,
                                layouts: tags.map(Number),
                            });
                        }}
                        defaultValue={filterData.layouts.map(String)}
                        placeholder="Select layouts"
                        variant="inverted"
                    />
                </div>
            </FilterDialog>
        </AppLayout>
    );
}
