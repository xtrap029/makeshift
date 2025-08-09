import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScheduleForm } from '@/types/form';
import { Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Form({
    data,
    setData,
    processing,
    errors,
    submit,
}: {
    data: Partial<ScheduleForm>;
    setData: (key: keyof ScheduleForm, value: ScheduleForm[keyof ScheduleForm]) => void;
    processing: boolean;
    errors: Record<string, string>;
    submit: FormEventHandler;
}) {
    const [selectedTimes, setSelectedTimes] = useState<{
        sun_start: string | undefined;
        sun_end: string | undefined;
        mon_start: string | undefined;
        mon_end: string | undefined;
        tue_start: string | undefined;
        tue_end: string | undefined;
        wed_start: string | undefined;
        wed_end: string | undefined;
        thu_start: string | undefined;
        thu_end: string | undefined;
        fri_start: string | undefined;
        fri_end: string | undefined;
        sat_start: string | undefined;
        sat_end: string | undefined;
    }>({
        sun_start: data.sun_start?.toString() || undefined,
        sun_end: data.sun_end?.toString() || undefined,
        mon_start: data.mon_start?.toString() || undefined,
        mon_end: data.mon_end?.toString() || undefined,
        tue_start: data.tue_start?.toString() || undefined,
        tue_end: data.tue_end?.toString() || undefined,
        wed_start: data.wed_start?.toString() || undefined,
        wed_end: data.wed_end?.toString() || undefined,
        thu_start: data.thu_start?.toString() || undefined,
        thu_end: data.thu_end?.toString() || undefined,
        fri_start: data.fri_start?.toString() || undefined,
        fri_end: data.fri_end?.toString() || undefined,
        sat_start: data.sat_start?.toString() || undefined,
        sat_end: data.sat_end?.toString() || undefined,
    });

    return (
        <form className="flex flex-col gap-6" onSubmit={submit}>
            <div className="grid grid-cols-16 gap-6">
                <div className="col-span-14 grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        required
                        autoFocus
                        autoComplete="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        disabled={processing}
                        placeholder="Name"
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>
                <div className="col-span-2 grid gap-2">
                    <Label htmlFor="is_active">Active</Label>
                    <Switch
                        id="is_active"
                        checked={data.is_active}
                        onCheckedChange={(checked) => setData('is_active', checked)}
                        disabled={processing}
                    />
                    <InputError message={errors.is_active} className="mt-2" />
                </div>
                <div className="col-span-8 grid gap-2">
                    <Label htmlFor="max_date">Max Date</Label>
                    <Input
                        id="max_date"
                        type="date"
                        value={data.max_date}
                        onChange={(e) => setData('max_date', e.target.value)}
                        disabled={processing}
                        placeholder="Max Date"
                    />
                    <InputError message={errors.max_date} className="mt-2" />
                </div>
                <div className="col-span-8 grid gap-2">
                    <Label htmlFor="max_day">Max Days</Label>
                    <Input
                        id="max_day"
                        type="number"
                        value={data.max_day}
                        onChange={(e) => setData('max_day', e.target.value)}
                        disabled={processing}
                        placeholder="Max Day"
                    />
                    <InputError message={errors.max_day} className="mt-2" />
                </div>
                <div className="col-span-2 grid gap-2">
                    <Label></Label>
                    <Label className="mt-2">Start</Label>
                    <Label className="mt-2">End</Label>
                </div>
                <div className="col-span-2 grid gap-2 text-center">
                    <Label htmlFor="sun_start">Sunday</Label>
                    <div className="flex flex-col gap-2">
                        <Select
                            value={selectedTimes.sun_start}
                            onValueChange={(value) => {
                                setSelectedTimes({
                                    ...selectedTimes,
                                    sun_start: value === 'null' ? undefined : value,
                                });
                                setData('sun_start', value);
                            }}
                            disabled={processing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Start Time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="null">None</SelectItem>
                                {Array.from({ length: 24 }, (_, i) => (
                                    <SelectItem
                                        key={i}
                                        value={i.toString().padStart(2, '0') + ':00:00'}
                                    >
                                        {i.toString().padStart(2, '0')}:00
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.sun_start} className="mt-2" />
                        <Select
                            value={selectedTimes.sun_end}
                            onValueChange={(value) => {
                                setSelectedTimes({
                                    ...selectedTimes,
                                    sun_end: value === 'null' ? undefined : value,
                                });
                                setData('sun_end', value);
                            }}
                            disabled={processing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="End Time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="null">None</SelectItem>
                                {Array.from({ length: 24 }, (_, i) => (
                                    <SelectItem
                                        key={i}
                                        value={i.toString().padStart(2, '0') + ':00:00'}
                                    >
                                        {i.toString().padStart(2, '0')}:00
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.sun_end} className="mt-2" />
                    </div>
                </div>
                <div className="col-span-2 grid gap-2 text-center">
                    <Label htmlFor="mon_start">Monday</Label>
                    <div className="flex flex-col gap-2">
                        <Select
                            value={selectedTimes.mon_start}
                            onValueChange={(value) => {
                                setSelectedTimes({
                                    ...selectedTimes,
                                    mon_start: value === 'null' ? undefined : value,
                                });
                                setData('mon_start', value);
                            }}
                            disabled={processing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Start Time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="null">None</SelectItem>
                                {Array.from({ length: 24 }, (_, i) => (
                                    <SelectItem
                                        key={i}
                                        value={i.toString().padStart(2, '0') + ':00:00'}
                                    >
                                        {i.toString().padStart(2, '0')}:00
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.mon_start} className="mt-2" />
                        <Select
                            value={selectedTimes.mon_end}
                            onValueChange={(value) => {
                                setSelectedTimes({
                                    ...selectedTimes,
                                    mon_end: value === 'null' ? undefined : value,
                                });
                                setData('mon_end', value);
                            }}
                            disabled={processing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="End Time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="null">None</SelectItem>
                                {Array.from({ length: 24 }, (_, i) => (
                                    <SelectItem
                                        key={i}
                                        value={i.toString().padStart(2, '0') + ':00:00'}
                                    >
                                        {i.toString().padStart(2, '0')}:00
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.mon_end} className="mt-2" />
                    </div>
                </div>
                <div className="col-span-2 grid gap-2 text-center">
                    <Label htmlFor="tue_start">Tuesday</Label>
                    <div className="flex flex-col gap-2">
                        <Select
                            value={selectedTimes.tue_start}
                            onValueChange={(value) => {
                                setSelectedTimes({
                                    ...selectedTimes,
                                    tue_start: value === 'null' ? undefined : value,
                                });
                                setData('tue_start', value);
                            }}
                            disabled={processing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Start Time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="null">None</SelectItem>
                                {Array.from({ length: 24 }, (_, i) => (
                                    <SelectItem
                                        key={i}
                                        value={i.toString().padStart(2, '0') + ':00:00'}
                                    >
                                        {i.toString().padStart(2, '0')}:00
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.tue_start} className="mt-2" />
                        <Select
                            value={selectedTimes.tue_end}
                            onValueChange={(value) => {
                                setSelectedTimes({
                                    ...selectedTimes,
                                    tue_end: value === 'null' ? undefined : value,
                                });
                                setData('tue_end', value);
                            }}
                            disabled={processing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="End Time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="null">None</SelectItem>
                                {Array.from({ length: 24 }, (_, i) => (
                                    <SelectItem
                                        key={i}
                                        value={i.toString().padStart(2, '0') + ':00:00'}
                                    >
                                        {i.toString().padStart(2, '0')}:00
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.tue_end} className="mt-2" />
                    </div>
                </div>
                <div className="col-span-2 grid gap-2 text-center">
                    <Label htmlFor="wed_start">Wednesday</Label>
                    <div className="flex flex-col gap-2">
                        <Select
                            value={selectedTimes.wed_start}
                            onValueChange={(value) => {
                                setSelectedTimes({
                                    ...selectedTimes,
                                    wed_start: value === 'null' ? undefined : value,
                                });
                                setData('wed_start', value);
                            }}
                            disabled={processing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Start Time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="null">None</SelectItem>
                                {Array.from({ length: 24 }, (_, i) => (
                                    <SelectItem
                                        key={i}
                                        value={i.toString().padStart(2, '0') + ':00:00'}
                                    >
                                        {i.toString().padStart(2, '0')}:00
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.wed_start} className="mt-2" />
                        <Select
                            value={selectedTimes.wed_end}
                            onValueChange={(value) => {
                                setSelectedTimes({
                                    ...selectedTimes,
                                    wed_end: value === 'null' ? undefined : value,
                                });
                                setData('wed_end', value);
                            }}
                            disabled={processing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="End Time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="null">None</SelectItem>
                                {Array.from({ length: 24 }, (_, i) => (
                                    <SelectItem
                                        key={i}
                                        value={i.toString().padStart(2, '0') + ':00:00'}
                                    >
                                        {i.toString().padStart(2, '0')}:00
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.wed_end} className="mt-2" />
                    </div>
                </div>
                <div className="col-span-2 grid gap-2 text-center">
                    <Label htmlFor="thu_start">Thursday</Label>
                    <div className="flex flex-col gap-2">
                        <Select
                            value={selectedTimes.thu_start}
                            onValueChange={(value) => {
                                setSelectedTimes({
                                    ...selectedTimes,
                                    thu_start: value === 'null' ? undefined : value,
                                });
                                setData('thu_start', value);
                            }}
                            disabled={processing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Start Time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="null">None</SelectItem>
                                {Array.from({ length: 24 }, (_, i) => (
                                    <SelectItem
                                        key={i}
                                        value={i.toString().padStart(2, '0') + ':00:00'}
                                    >
                                        {i.toString().padStart(2, '0')}:00
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.thu_start} className="mt-2" />
                        <Select
                            value={selectedTimes.thu_end}
                            onValueChange={(value) => {
                                setSelectedTimes({
                                    ...selectedTimes,
                                    thu_end: value === 'null' ? undefined : value,
                                });
                                setData('thu_end', value);
                            }}
                            disabled={processing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="End Time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="null">None</SelectItem>
                                {Array.from({ length: 24 }, (_, i) => (
                                    <SelectItem
                                        key={i}
                                        value={i.toString().padStart(2, '0') + ':00:00'}
                                    >
                                        {i.toString().padStart(2, '0')}:00
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.thu_end} className="mt-2" />
                    </div>
                </div>
                <div className="col-span-2 grid gap-2 text-center">
                    <Label htmlFor="fri_start">Friday</Label>
                    <div className="flex flex-col gap-2">
                        <Select
                            value={selectedTimes.fri_start}
                            onValueChange={(value) => {
                                setSelectedTimes({
                                    ...selectedTimes,
                                    fri_start: value === 'null' ? undefined : value,
                                });
                                setData('fri_start', value);
                            }}
                            disabled={processing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Start Time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="null">None</SelectItem>
                                {Array.from({ length: 24 }, (_, i) => (
                                    <SelectItem
                                        key={i}
                                        value={i.toString().padStart(2, '0') + ':00:00'}
                                    >
                                        {i.toString().padStart(2, '0')}:00
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.fri_start} className="mt-2" />
                        <Select
                            value={selectedTimes.fri_end}
                            onValueChange={(value) => {
                                setSelectedTimes({
                                    ...selectedTimes,
                                    fri_end: value === 'null' ? undefined : value,
                                });
                                setData('fri_end', value);
                            }}
                            disabled={processing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="End Time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="null">None</SelectItem>
                                {Array.from({ length: 24 }, (_, i) => (
                                    <SelectItem
                                        key={i}
                                        value={i.toString().padStart(2, '0') + ':00:00'}
                                    >
                                        {i.toString().padStart(2, '0')}:00
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.fri_end} className="mt-2" />
                    </div>
                </div>
                <div className="col-span-2 grid gap-2 text-center">
                    <Label htmlFor="sat_start">Saturday</Label>
                    <div className="flex flex-col gap-2">
                        <Select
                            value={selectedTimes.sat_start}
                            onValueChange={(value) => {
                                setSelectedTimes({
                                    ...selectedTimes,
                                    sat_start: value === 'null' ? undefined : value,
                                });
                                setData('sat_start', value);
                            }}
                            disabled={processing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Start Time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="null">None</SelectItem>
                                {Array.from({ length: 24 }, (_, i) => (
                                    <SelectItem
                                        key={i}
                                        value={i.toString().padStart(2, '0') + ':00:00'}
                                    >
                                        {i.toString().padStart(2, '0')}:00
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.sat_start} className="mt-2" />
                        <Select
                            value={selectedTimes.sat_end}
                            onValueChange={(value) => {
                                setSelectedTimes({
                                    ...selectedTimes,
                                    sat_end: value === 'null' ? undefined : value,
                                });
                                setData('sat_end', value);
                            }}
                            disabled={processing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="End Time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="null">None</SelectItem>
                                {Array.from({ length: 24 }, (_, i) => (
                                    <SelectItem
                                        key={i}
                                        value={i.toString().padStart(2, '0') + ':00:00'}
                                    >
                                        {i.toString().padStart(2, '0')}:00
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.sat_end} className="mt-2" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button type="submit" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Save
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/schedules">Cancel</Link>
                    </Button>
                </div>
            </div>
        </form>
    );
}
