import WeekSchedule from '@/components/custom/week-schedule';
import { Button, buttonVariants } from '@/components/ui/button';
import { useDelete } from '@/hooks/use-delete';
import AppLayout from '@/layouts/app-layout';
import { Schedule, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Check, Pencil, Trash } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Schedules', href: '/schedules' },
];

export default function Index({ schedules }: { schedules: Schedule[] }) {
    const { destroy, processing } = useDelete();
    const [is24Hour, setIs24Hour] = useState(true);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedules - List" />
            <div className="p-4">
                <div className="mb-8 flex justify-between gap-2">
                    <div className="flex">
                        <Button
                            variant="outline"
                            onClick={() => setIs24Hour(!is24Hour)}
                            className="cursor-pointer"
                        >
                            View in {is24Hour ? '12 Hour' : '24 Hour'} format
                        </Button>
                    </div>
                    <div className="flex">
                        <Link
                            className={buttonVariants({ variant: 'default' })}
                            href="/schedules/create"
                        >
                            Create
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col gap-8">
                    {schedules.map((schedule) => (
                        <div key={schedule.id} className="flex flex-col gap-2">
                            <div className="flex justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl font-bold">{schedule.name}</h1>
                                </div>
                                <div className="flex gap-2">
                                    {schedule.is_active ? (
                                        <Check className="mr-2 self-center text-green-500" />
                                    ) : (
                                        ''
                                    )}
                                    <Link
                                        className={buttonVariants({ variant: 'ghost' })}
                                        href={`/schedules/${schedule.id}/edit`}
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
            </div>
        </AppLayout>
    );
}
