import Header from '@/components/custom/page/header';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
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
import { useDelete } from '@/hooks/use-delete';
import { Room } from '@/types';
import { ScheduleOverrideForm } from '@/types/form';
import { Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Form({
    data,
    setData,
    processing,
    errors,
    submit,
    rooms,
}: {
    data: Partial<ScheduleOverrideForm>;
    setData: (
        key: keyof ScheduleOverrideForm,
        value: ScheduleOverrideForm[keyof ScheduleOverrideForm]
    ) => void;
    processing: boolean;
    errors: Record<string, string>;
    submit: FormEventHandler;
    rooms: Room[];
}) {
    const { destroy, processing: deleteProcessing } = useDelete();

    const [selectedRooms, setSelectedRooms] = useState<string[]>(
        data.rooms?.map((room) => room.toString()) || []
    );

    const [selectedTimeStart, setSelectedTimeStart] = useState<string | undefined>(
        data.time_start?.toString() || undefined
    );

    const [selectedTimeEnd, setSelectedTimeEnd] = useState<string | undefined>(
        data.time_end?.toString() || undefined
    );

    return (
        <form className="flex flex-col gap-6" onSubmit={submit}>
            <Header title={`${data.id ? 'Edit' : 'Create'} Schedule Override`} />
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8 grid gap-2">
                    <Label htmlFor="note">Note</Label>
                    <Input
                        id="note"
                        type="text"
                        required
                        autoFocus
                        value={data.note}
                        onChange={(e) => setData('note', e.target.value)}
                        disabled={processing}
                        placeholder="Note"
                    />
                    <InputError message={errors.note} className="mt-2" />
                </div>
                <div className="col-span-2 grid gap-2">
                    <Label htmlFor="is_open">Status</Label>
                    <Select
                        value={data.is_open ? 'Open' : 'Closed'}
                        onValueChange={(value) => setData('is_open', value === 'Open')}
                        disabled={processing}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.is_open} className="mt-2" />
                </div>
                <div className="col-span-2 grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                        id="date"
                        type="date"
                        value={data.date}
                        onChange={(e) => setData('date', e.target.value)}
                        disabled={processing}
                        placeholder="Date"
                    />
                    <InputError message={errors.date} className="mt-2" />
                </div>
                <div className="col-span-8 grid gap-2">
                    <Label htmlFor="rooms">Rooms</Label>
                    <MultiSelect
                        options={rooms.map((room) => ({
                            value: room.id.toString(),
                            label: room.name,
                        }))}
                        onValueChange={(tags) => {
                            setSelectedRooms(tags);
                            setData('rooms', tags.map(Number));
                        }}
                        defaultValue={selectedRooms}
                        placeholder="Select rooms"
                        variant="inverted"
                    />
                    <InputError message={errors.rooms} className="mt-2" />
                </div>
                <div className="col-span-2 grid gap-2">
                    <Label htmlFor="time_start">Time Start</Label>
                    <Select
                        value={selectedTimeStart}
                        onValueChange={(value) => {
                            setSelectedTimeStart(value);
                            setData('time_start', value);
                        }}
                        required
                        disabled={processing}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Time Start" />
                        </SelectTrigger>
                        <SelectContent>
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
                    <InputError message={errors.time_start} className="mt-2" />
                </div>
                <div className="col-span-2 grid gap-2">
                    <Label htmlFor="time_end">Time End</Label>
                    <Select
                        value={selectedTimeEnd}
                        onValueChange={(value) => {
                            setSelectedTimeEnd(value);
                            setData('time_end', value);
                        }}
                        required
                        disabled={processing}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Time End" />
                        </SelectTrigger>
                        <SelectContent>
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
                    <InputError message={errors.time_end} className="mt-2" />
                </div>
                <div className="col-span-12 flex justify-between gap-2">
                    <div className="flex flex-1 gap-2">
                        <Button type="submit" disabled={processing || deleteProcessing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Save
                        </Button>
                        <Button variant="outline" disabled={processing || deleteProcessing} asChild>
                            <Link href="/overrides">Cancel</Link>
                        </Button>
                    </div>
                    {data.id && data.note && (
                        <Button
                            variant="destructive"
                            type="button"
                            onClick={() => destroy('overrides.destroy', data.id!, data.note!)}
                            disabled={processing || deleteProcessing}
                        >
                            Delete
                        </Button>
                    )}
                </div>
            </div>
        </form>
    );
}
