import Header from '@/components/custom/page/header';
import Pagination from '@/components/custom/pagination';
import WeekSchedule from '@/components/custom/week-schedule';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { useDelete } from '@/hooks/use-delete';
import AppLayout from '@/layouts/app-layout';
import { Schedule, type BreadcrumbItem } from '@/types';
import { PaginatedData } from '@/types/pagination';
import { Head, Link } from '@inertiajs/react';
import { Pencil, Trash } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Schedules', href: '/schedules' },
];

export default function Index({ schedules }: { schedules: PaginatedData<Schedule> }) {
    const { destroy, processing } = useDelete();
    const [is24Hour, setIs24Hour] = useState(true);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedules - List" />
            <div className="p-4">
                <Header title="Schedules">
                    <div className="flex gap-2">
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
        </AppLayout>
    );
}
