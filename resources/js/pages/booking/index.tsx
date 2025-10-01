import Header from '@/components/custom/page/header';
import Pagination from '@/components/custom/pagination';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
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
import { Booking, type BreadcrumbItem } from '@/types';
import { PaginatedData } from '@/types/pagination';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { Eye } from 'lucide-react';

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

export default function Index({ bookings }: { bookings: PaginatedData<Booking> }) {
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
                            onClick={() => setIsCalendarView(!isCalendarView)}
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
        </AppLayout>
    );
}
