import FilterDialog from '@/components/custom/filter-dialog';
import Header from '@/components/custom/page/header';
import Pagination from '@/components/custom/pagination';
import WeekSchedule from '@/components/custom/week-schedule';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useDelete } from '@/hooks/use-delete';
import AppLayout from '@/layouts/app-layout';
import { Schedule, type BreadcrumbItem } from '@/types';
import { PaginatedData } from '@/types/pagination';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, SlidersHorizontal, Trash } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Schedules', href: '/schedules' },
];

export default function Index({
    schedules,
    filters,
}: {
    schedules: PaginatedData<Schedule>;
    filters: { status: string | undefined };
}) {
    const { destroy, processing } = useDelete();
    const [is24Hour, setIs24Hour] = useState(true);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [resetToken, setResetToken] = useState(0);
    const [filterData, setFilterData] = useState<{
        status: string | undefined;
    }>({
        status: filters.status || undefined,
    });

    const applyFilters = () => {
        router.get(route('schedules.index'), filterData, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedules - List" />
            <div className="p-4">
                <Header title="Schedules">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            disabled={processing}
                            className="cursor-pointer"
                            onClick={() => setIsFilterOpen(true)}
                        >
                            <SlidersHorizontal className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setIs24Hour(!is24Hour)}
                            disabled={processing}
                        >
                            View in {is24Hour ? '12 Hour' : '24 Hour'} format
                        </Button>
                        <Link
                            className={buttonVariants({ variant: 'default' })}
                            href="/schedules/create"
                            disabled={processing}
                        >
                            Create
                        </Link>
                    </div>
                </Header>
                <div className="mb-10 flex flex-col gap-8">
                    {schedules.data.map((schedule) => (
                        <div key={schedule.id} className="flex flex-col gap-2">
                            <div className="flex justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl font-bold">{schedule.name}</h1>
                                    <div className="flex gap-2 self-center">
                                        <Badge variant="outline" className="text-sm">
                                            {schedule.max_day} days
                                        </Badge>
                                        <Badge variant="outline" className="text-sm">
                                            {schedule.max_date}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        className={buttonVariants({ variant: 'ghost' })}
                                        href={`/schedules/${schedule.id}/edit`}
                                        disabled={processing}
                                    >
                                        <Pencil />
                                    </Link>
                                    <button
                                        className={buttonVariants({ variant: 'ghost' })}
                                        onClick={() =>
                                            destroy(
                                                'schedules.destroy',
                                                schedule.id,
                                                schedule.name,
                                                {
                                                    confirmMessage: `Are you sure you want to delete ${schedule.name}? Deleting will disassociate this schedule from all rooms.`,
                                                }
                                            )
                                        }
                                        disabled={processing}
                                    >
                                        <Trash />
                                    </button>
                                </div>
                            </div>
                            <WeekSchedule schedule={schedule} is24Hour={is24Hour} />
                        </div>
                    ))}
                </div>
                <Pagination links={schedules.links} />
            </div>
            <FilterDialog
                title="Filter Schedules"
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                onApply={applyFilters}
                onClear={() => {
                    setFilterData({
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
            </FilterDialog>
        </AppLayout>
    );
}
