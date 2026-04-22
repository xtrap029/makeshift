import FilterDialog from '@/components/custom/filter-dialog';
import Header from '@/components/custom/page/header';
import Pagination from '@/components/custom/pagination';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import AppLayout from '@/layouts/app-layout';
import { ScheduleOverride, type BreadcrumbItem } from '@/types';
import { PaginatedData } from '@/types/pagination';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, SlidersHorizontal } from 'lucide-react';

import moment from 'moment';
import { useState } from 'react';
import { Calendar, Event, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
const localizer = momentLocalizer(moment);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Overrides', href: '/overrides' },
];

interface CustomEvent extends Event {
    id: number;
    is_open: boolean;
}

export default function Index({
    scheduleOverrides,
    calendarOverrides,
    filters,
}: {
    scheduleOverrides: PaginatedData<ScheduleOverride>;
    calendarOverrides: ScheduleOverride[];
    filters: {
        status?: string;
        date_from?: string;
        date_to?: string;
        note?: string;
    };
}) {
    const [isCalendarView, setIsCalendarView] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [resetToken, setResetToken] = useState(0);
    const [filterData, setFilterData] = useState({
        status: filters.status || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        note: filters.note || '',
    });

    const applyFilters = () => {
        router.get(route('overrides.index'), filterData, {
            preserveState: true,
            replace: true,
        });
        setIsFilterOpen(false);
    };

    const events: CustomEvent[] = calendarOverrides.map((o) => ({
        id: o.id,
        title: o.note,
        start: new Date(o.date + ' ' + (o.time_start ?? '00:00:00')),
        end: new Date(o.date + ' ' + (o.time_end ?? '23:59:59')),
        description: o.note,
        is_open: o.is_open,
    }));

    const handleSelectEvent = (event: CustomEvent) => {
        router.visit(route('overrides.edit', { override: event.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Overrides - List" />
            <div className="p-4">
                <Header title="Overrides">
                    <div className="flex gap-2">
                        {!isCalendarView && (
                            <Button
                                variant="outline"
                                className="cursor-pointer"
                                onClick={() => setIsFilterOpen(true)}
                            >
                                <SlidersHorizontal className="size-4" />
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            onClick={() => setIsCalendarView(!isCalendarView)}
                            className="cursor-pointer"
                        >
                            View in {isCalendarView ? 'Table' : 'Calendar'} format
                        </Button>
                        <Link
                            className={buttonVariants({ variant: 'default' })}
                            href="/overrides/create"
                        >
                            Create
                        </Link>
                    </div>
                </Header>

                {isCalendarView && (
                    <div className="mt-4 rounded-lg border p-4">
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            onSelectEvent={handleSelectEvent}
                            style={{ height: 700 }}
                            popup
                            eventPropGetter={(event: CustomEvent) => ({
                                className: event.is_open
                                    ? '!bg-emerald-100 !border-emerald-700 !text-emerald-700'
                                    : '!bg-rose-100 !border-rose-700 !text-rose-700',
                            })}
                        />
                    </div>
                )}

                {!isCalendarView && (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Note</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {scheduleOverrides.data.map((override) => (
                                    <TableRow key={override.id}>
                                        <TableCell>{override.date}</TableCell>
                                        <TableCell>
                                            {override.time_start && override.time_end
                                                ? `${override.time_start.slice(0, 5)} – ${override.time_end.slice(0, 5)}`
                                                : '—'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    override.is_open
                                                        ? 'border-emerald-700 text-emerald-700'
                                                        : 'border-rose-700 text-rose-700'
                                                }
                                            >
                                                {override.is_open ? 'Open' : 'Closed'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{override.note || '—'}</TableCell>
                                        <TableCell className="flex justify-end gap-2">
                                            <Link
                                                className={buttonVariants({ variant: 'ghost' })}
                                                href={`/overrides/${override.id}/edit`}
                                            >
                                                <Pencil />
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Pagination links={scheduleOverrides.links} />
                    </>
                )}
            </div>

            <FilterDialog
                title="Filter Overrides"
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                onApply={applyFilters}
                onClear={() => {
                    setFilterData({ status: '', date_from: '', date_to: '', note: '' });
                    setResetToken((n) => n + 1);
                }}
            >
                <div className="flex flex-wrap gap-2">
                    <Label>Status</Label>
                    <Select
                        key={`status-${resetToken}`}
                        value={filterData.status}
                        onValueChange={(value) => setFilterData({ ...filterData, status: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Open</SelectItem>
                            <SelectItem value="0">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-row gap-2">
                    <div className="flex flex-wrap gap-2">
                        <Label>Date From</Label>
                        <Input
                            key={`date_from-${resetToken}`}
                            type="date"
                            value={filterData.date_from}
                            onChange={(e) => setFilterData({ ...filterData, date_from: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Label>Date To</Label>
                        <Input
                            key={`date_to-${resetToken}`}
                            type="date"
                            value={filterData.date_to}
                            onChange={(e) => setFilterData({ ...filterData, date_to: e.target.value })}
                        />
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Label>Note</Label>
                    <Input
                        key={`note-${resetToken}`}
                        type="text"
                        placeholder="Search note..."
                        value={filterData.note}
                        onChange={(e) => setFilterData({ ...filterData, note: e.target.value })}
                    />
                </div>
            </FilterDialog>
        </AppLayout>
    );
}
