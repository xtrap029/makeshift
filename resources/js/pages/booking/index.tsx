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
import { Eye } from 'lucide-react';

import moment from 'moment';
import { useState } from 'react';
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
    const events: CustomEvent[] = bookings.data.map((booking) => ({
        id: booking.id,
        title: `${booking.start_time.slice(0, 2)}-${booking.end_time.slice(0, 2)} ${booking.room.name}`,
        start: new Date(booking.start_date + ' ' + booking.start_time),
        end: new Date(booking.start_date + ' ' + booking.end_time),
        description: booking.customer_name,
        status: booking.status,
    }));

    const [isCalendarView, setIsCalendarView] = useState(false);

    const handleSelectEvent = (event: CustomEvent) => {
        router.visit(route('bookings.show', { booking: event.id }));
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
                <div className="mt-4 rounded-lg border p-4">
                    {isCalendarView && (
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            onSelectEvent={handleSelectEvent}
                            style={{ height: 700 }}
                            popup
                            eventPropGetter={(event: CustomEvent) => ({
                                className: bookingStatusConstants.find(
                                    (status) => status.id === event.status
                                )?.calendarClass,
                            })}
                        />
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
                                            <TableCell>{booking.id}</TableCell>
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
            </div>
        </AppLayout>
    );
}
