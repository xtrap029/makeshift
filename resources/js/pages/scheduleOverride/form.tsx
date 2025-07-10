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
    const [selectedRooms, setSelectedRooms] = useState<string[]>(
        data.rooms?.map((room) => room.toString()) || []
    );

    return (
        <form className="flex flex-col gap-6" onSubmit={submit}>
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
                <div className="col-span-12 grid gap-2">
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
                <div className="flex gap-2">
                    <Button type="submit" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Save
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/overrides">Cancel</Link>
                    </Button>
                </div>
            </div>
        </form>
    );
}
