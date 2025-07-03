import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScheduleForm } from '@/types/form';
import { Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

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
                        <Input
                            id="sun_start"
                            type="time"
                            autoComplete="sun_start"
                            value={data.sun_start}
                            onChange={(e) => setData('sun_start', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.sun_start} className="mt-2" />
                        <Input
                            id="sun_end"
                            type="time"
                            value={data.sun_end}
                            onChange={(e) => setData('sun_end', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.sun_end} className="mt-2" />
                    </div>
                </div>
                <div className="col-span-2 grid gap-2 text-center">
                    <Label htmlFor="mon_start">Monday</Label>
                    <div className="flex flex-col gap-2">
                        <Input
                            id="mon_start"
                            type="time"
                            value={data.mon_start}
                            onChange={(e) => setData('mon_start', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.mon_start} className="mt-2" />
                        <Input
                            id="mon_end"
                            type="time"
                            value={data.mon_end}
                            onChange={(e) => setData('mon_end', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.mon_end} className="mt-2" />
                    </div>
                </div>
                <div className="col-span-2 grid gap-2 text-center">
                    <Label htmlFor="tue_start">Tuesday</Label>
                    <div className="flex flex-col gap-2">
                        <Input
                            id="tue_start"
                            type="time"
                            value={data.tue_start}
                            onChange={(e) => setData('tue_start', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.tue_start} className="mt-2" />
                        <Input
                            id="tue_end"
                            type="time"
                            value={data.tue_end}
                            onChange={(e) => setData('tue_end', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.tue_end} className="mt-2" />
                    </div>
                </div>
                <div className="col-span-2 grid gap-2 text-center">
                    <Label htmlFor="wed_start">Wednesday</Label>
                    <div className="flex flex-col gap-2">
                        <Input
                            id="wed_start"
                            type="time"
                            value={data.wed_start}
                            onChange={(e) => setData('wed_start', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.wed_start} className="mt-2" />
                        <Input
                            id="wed_end"
                            type="time"
                            value={data.wed_end}
                            onChange={(e) => setData('wed_end', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.wed_end} className="mt-2" />
                    </div>
                </div>
                <div className="col-span-2 grid gap-2 text-center">
                    <Label htmlFor="thu_start">Thursday</Label>
                    <div className="flex flex-col gap-2">
                        <Input
                            id="thu_start"
                            type="time"
                            value={data.thu_start}
                            onChange={(e) => setData('thu_start', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.thu_start} className="mt-2" />
                        <Input
                            id="thu_end"
                            type="time"
                            value={data.thu_end}
                            onChange={(e) => setData('thu_end', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.thu_end} className="mt-2" />
                    </div>
                </div>
                <div className="col-span-2 grid gap-2 text-center">
                    <Label htmlFor="fri_start">Friday</Label>
                    <div className="flex flex-col gap-2">
                        <Input
                            id="fri_start"
                            type="time"
                            value={data.fri_start}
                            onChange={(e) => setData('fri_start', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.fri_start} className="mt-2" />
                        <Input
                            id="fri_end"
                            type="time"
                            value={data.fri_end}
                            onChange={(e) => setData('fri_end', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.fri_end} className="mt-2" />
                    </div>
                </div>
                <div className="col-span-2 grid gap-2 text-center">
                    <Label htmlFor="sat_start">Saturday</Label>
                    <div className="flex flex-col gap-2">
                        <Input
                            id="sat_start"
                            type="time"
                            value={data.sat_start}
                            onChange={(e) => setData('sat_start', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.sat_start} className="mt-2" />
                        <Input
                            id="sat_end"
                            type="time"
                            value={data.sat_end}
                            onChange={(e) => setData('sat_end', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.sat_end} className="mt-2" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button type="submit" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Save changes
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/schedules">Cancel</Link>
                    </Button>
                </div>
            </div>
        </form>
    );
}
