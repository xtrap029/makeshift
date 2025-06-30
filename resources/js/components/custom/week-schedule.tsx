import { Schedule } from '@/types';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';

const days = [
    { label: 'Sunday', key: 'sun' },
    { label: 'Monday', key: 'mon' },
    { label: 'Tuesday', key: 'tue' },
    { label: 'Wednesday', key: 'wed' },
    { label: 'Thursday', key: 'thu' },
    { label: 'Friday', key: 'fri' },
    { label: 'Saturday', key: 'sat' },
];

function formatTime(time: string, is24Hour: boolean) {
    if (is24Hour) return time.split(':')[0] + ':' + time.split(':')[1];
    const [hourStr, minute] = time.split(':');
    const hour = Number(hourStr);
    const suffix = hour < 12 ? 'AM' : 'PM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute} ${suffix}`;
}

function formatSchedule(start?: string, end?: string, is24Hour = false) {
    if (!start || !end) return 'Closed';
    return `${formatTime(start, is24Hour)} - ${formatTime(end, is24Hour)}`;
}

export default function WeekSchedule({
    schedule,
    is24Hour,
}: {
    schedule: Schedule;
    is24Hour: boolean;
}) {
    return (
        <div className="grid grid-cols-7 gap-4">
            {schedule &&
                days.map(({ label, key }) => (
                    <Card key={key} className="relative overflow-hidden">
                        {!schedule[`${key}_start` as keyof typeof schedule] ||
                        !schedule[`${key}_end` as keyof typeof schedule] ? (
                            <div className="absolute inset-0 z-10 bg-black/5" />
                        ) : null}
                        <CardHeader>
                            <CardTitle>{label}</CardTitle>
                            <CardDescription className="text-xs">
                                {formatSchedule(
                                    schedule[`${key}_start` as keyof typeof schedule] as string,
                                    schedule[`${key}_end` as keyof typeof schedule] as string,
                                    is24Hour
                                )}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ))}
        </div>
    );
}
