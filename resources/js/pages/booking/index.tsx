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
import { bookingStatus as bookingStatusConstants } from '@/constants';
import AppLayout from '@/layouts/app-layout';
import { Booking, Layout, Room, type BreadcrumbItem } from '@/types';
import { PaginatedData } from '@/types/pagination';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { Eye, SlidersHorizontal } from 'lucide-react';

import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { Calendar, Event, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
const localizer = momentLocalizer(moment);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Bookings', href: '/bookings' },
];

interface CustomEvent extends Event {
    id: number;
    status: number;
}

export default function Index({
    bookings,
    rooms,
    layouts,
    filters,
}: {
    bookings: PaginatedData<Booking>;
    rooms: Room[];
    layouts: Layout[];
    filters: {
        date_from: string | undefined;
        date_to: string | undefined;
        rooms: number[];
        layouts: number[];
        status: string | undefined;
    };
}) {
    const [isCalendarView, setIsCalendarView] = useState(false);
    const [calendarBookings, setCalendarBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());

    const events: CustomEvent[] = calendarBookings.map((booking) => {
        const startDate = new Date(booking.start_date + ' ' + booking.start_time);
        const endDate = new Date(booking.start_date + ' ' + booking.end_time);

        return {
            id: booking.id,
            title: `${booking.start_time.slice(0, 2)}-${booking.end_time.slice(0, 2)} ${booking.room.name}`,
            start: startDate,
            end: endDate,
            description: booking.customer_name,
            status: booking.status,
        };
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [resetToken, setResetToken] = useState(0);
    const [filterData, setFilterData] = useState<{
        date_from: string | undefined;
        date_to: string | undefined;
        rooms: number[];
        layouts: number[];
        status: string | undefined;
    }>({
        date_from: filters.date_from || undefined,
        date_to: filters.date_to || undefined,
        rooms: filters.rooms || [],
        layouts: filters.layouts || [],
        status: filters.status || undefined,
    });

    const applyFilters = () => {
        router.get(route('bookings.index'), filterData, {
            preserveState: true,
            replace: true,
        });
    };

    const fetchCalendarData = useCallback(async (date: Date) => {
        setLoading(true);
        try {
            const response = await axios.get(route('bookings.calendar'), {
                params: {
                    month: date.getMonth() + 1,
                    year: date.getFullYear(),
                },
            });

            setCalendarBookings(response.data);
        } catch (error) {
            console.error('Failed to fetch calendar data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isCalendarView && calendarBookings.length === 0) {
            fetchCalendarData(currentDate);
        }
    }, [isCalendarView, calendarBookings.length, fetchCalendarData, currentDate]);

    const handleSelectEvent = (event: CustomEvent) => {
        router.visit(route('bookings.show', { booking: event.id }));
    };

    const handleNavigate = (newDate: Date) => {
        setCurrentDate(newDate);
        setCalendarBookings([]);
        fetchCalendarData(newDate);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bookings - List" />
            <div className="p-4">
                <Header title="Bookings">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => setIsFilterOpen(true)}
                        >
                            <SlidersHorizontal className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setIsCalendarView(!isCalendarView)}
                            className="cursor-pointer"
                        >
                            View in {isCalendarView ? 'Table' : 'Calendar'} format
                        </Button>
                        <Link
                            className={buttonVariants({ variant: 'default' })}
                            href="/bookings/create"
                        >
                            Create
                        </Link>
                    </div>
                </Header>
                {isCalendarView && (
                    <div className="mt-4 rounded-lg border p-4">
                        {loading ? (
                            <div className="flex h-[700px] items-center justify-center">
                                <div className="text-center">
                                    <div className="mb-2 text-lg font-medium">Loading...</div>
                                </div>
                            </div>
                        ) : (
                            <Calendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                onSelectEvent={handleSelectEvent}
                                onNavigate={handleNavigate}
                                date={currentDate}
                                style={{ height: 700 }}
                                views={['month']}
                                eventPropGetter={(event: CustomEvent) => ({
                                    className: bookingStatusConstants.find(
                                        (status) => status.id === event.status
                                    )?.calendarClass,
                                })}
                            />
                        )}
                    </div>
                )}
                {!isCalendarView && (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Room</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookings.data.map((booking) => (
                                    <TableRow key={booking.id}>
                                        <TableCell>{booking.booking_id}</TableCell>
                                        <TableCell>{booking.customer_name}</TableCell>
                                        <TableCell>
                                            <a
                                                href={`/rooms/${booking.room.id}`}
                                                target="_blank"
                                                className="underline"
                                            >
                                                {booking.room.name}
                                            </a>
                                        </TableCell>
                                        <TableCell>{booking.start_date}</TableCell>
                                        <TableCell>
                                            {booking.start_time.slice(0, 5)} -{' '}
                                            {booking.end_time.slice(0, 5)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    bookingStatusConstants.find(
                                                        (status) => status.id === booking.status
                                                    )?.badgeClass
                                                }
                                            >
                                                {
                                                    bookingStatusConstants.find(
                                                        (status) => status.id === booking.status
                                                    )?.label
                                                }
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="flex justify-end gap-2">
                                            <Link
                                                className={buttonVariants({ variant: 'ghost' })}
                                                href={`/bookings/${booking.id}`}
                                            >
                                                <Eye />
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Pagination links={bookings.links} />
                    </>
                )}
            </div>
            <FilterDialog
                title="Filter Bookings"
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                onApply={applyFilters}
                onClear={() => {
                    setFilterData({
                        date_from: undefined,
                        date_to: undefined,
                        rooms: [],
                        layouts: [],
                        status: undefined,
                    });
                    setResetToken((n) => n + 1);
                }}
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
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                            {bookingStatusConstants.map((status) => (
                                <SelectItem key={status.id} value={status.id.toString()}>
                                    {status.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-row gap-2">
                    <div className="flex flex-wrap gap-2">
                        <Label htmlFor="date_from">Date From</Label>
                        <Input
                            id="date_from"
                            type="date"
                            value={filterData.date_from || ''}
                            onChange={(e) =>
                                setFilterData({ ...filterData, date_from: e.target.value })
                            }
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Label htmlFor="date_to">Date To</Label>
                        <Input
                            id="date_to"
                            type="date"
                            value={filterData.date_to || ''}
                            onChange={(e) =>
                                setFilterData({ ...filterData, date_to: e.target.value })
                            }
                        />
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Label htmlFor="rooms">Rooms</Label>
                    <MultiSelect
                        key={`rooms-${resetToken}`}
                        options={rooms.map((room) => ({
                            value: room.id.toString(),
                            label: room.name,
                        }))}
                        onValueChange={(tags) => {
                            setFilterData({
                                ...filterData,
                                rooms: tags.map(Number),
                            });
                        }}
                        defaultValue={filterData.rooms.map(String)}
                        placeholder="Select rooms"
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
