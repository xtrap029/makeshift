import Header from '@/components/custom/page/header';
import { buttonVariants } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { ScheduleOverride, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

import moment from 'moment';
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

export default function Index({ scheduleOverrides }: { scheduleOverrides: ScheduleOverride[] }) {
    const events: CustomEvent[] = scheduleOverrides.map((scheduleOverride) => ({
        id: scheduleOverride.id,
        title: scheduleOverride.note,
        start: new Date(scheduleOverride.date + ' ' + scheduleOverride.time_start),
        end: new Date(scheduleOverride.date + ' ' + scheduleOverride.time_end),
        description: scheduleOverride.note,
        is_open: scheduleOverride.is_open,
    }));

    const handleSelectEvent = (event: CustomEvent) => {
        router.visit(route('overrides.edit', { override: event.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Overrides - List" />
            <div className="p-4">
                <Header title="Overrides">
                    <Link
                        className={buttonVariants({ variant: 'default' })}
                        href="/overrides/create"
                    >
                        Create
                    </Link>
                </Header>
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
                                ? '!bg-emerald-100 !border-emarald-700 !text-emerald-700'
                                : '!bg-rose-100 !border-rose-700 !text-rose-700',
                        })}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
