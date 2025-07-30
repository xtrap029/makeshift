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
import { Switch } from '@/components/ui/switch';
import { Amenity, Layout, Schedule } from '@/types';
import { RoomForm } from '@/types/form';
import { Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Form({
    data,
    setData,
    processing,
    errors,
    amenities,
    layouts,
    schedules,
    submit,
}: {
    data: Partial<RoomForm>;
    setData: (key: keyof RoomForm, value: RoomForm[keyof RoomForm]) => void;
    processing: boolean;
    errors: Record<string, string>;
    submit: FormEventHandler;
    amenities: Amenity[];
    layouts: Layout[];
    schedules: Schedule[];
}) {
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
        data.amenities?.map((amenity) => amenity.toString()) || []
    );

    const [selectedLayouts, setSelectedLayouts] = useState<string[]>(
        data.layouts?.map((layout) => layout.toString()) || []
    );

    const [selectedSchedule, setSelectedSchedule] = useState<string | undefined>(
        data.schedule_id?.toString() || undefined
    );

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
        }
    };

    return (
        <form className="flex flex-col gap-6" onSubmit={submit}>
            <Header title={`${data.id ? 'Edit' : 'Create'} Room`} />
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-6 grid gap-2">
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
                <div className="col-span-3 grid gap-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                        id="price"
                        type="number"
                        required
                        value={data.price}
                        onChange={(e) => setData('price', parseInt(e.target.value))}
                        disabled={processing}
                        placeholder="Price"
                    />
                    <InputError message={errors.price} className="mt-2" />
                </div>
                <div className="col-span-3 grid gap-2">
                    <Label htmlFor="image">
                        {!data.image_name && 'Image'}
                        {data.image_name && (
                            <a
                                href={`/storage/${data.image_name}`}
                                target="_blank"
                                className="text-blue-300 underline"
                            >
                                Replace Image
                            </a>
                        )}
                    </Label>
                    <Input
                        id="image"
                        type="file"
                        required={!data.image_name}
                        onChange={handleImageChange}
                        accept="image/png, image/jpeg, image/jpg"
                    />
                    <InputError message={errors.image} className="mt-2" />
                </div>
                <div className="col-span-9 grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                        id="description"
                        type="text"
                        required
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        disabled={processing}
                        placeholder="Description"
                    />
                    <InputError message={errors.description} className="mt-2" />
                </div>
                <div className="col-span-3 grid gap-2">
                    <Label htmlFor="schedule_id">Schedule</Label>
                    <Select
                        value={selectedSchedule}
                        onValueChange={(value) => {
                            setSelectedSchedule(value);
                            setData('schedule_id', parseInt(value));
                        }}
                        disabled={processing}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a schedule" />
                        </SelectTrigger>
                        <SelectContent>
                            {schedules.map((schedule) => (
                                <SelectItem key={schedule.id} value={schedule.id.toString()}>
                                    {schedule.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.schedule_id} className="mt-2" />
                </div>
                <div className="col-span-3 grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="is_active">Active</Label>
                        <Switch
                            id="is_active"
                            checked={data.is_active}
                            onCheckedChange={(checked) => setData('is_active', checked)}
                            disabled={processing}
                        />
                        <InputError message={errors.is_active} className="mt-2" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="is_private">Private</Label>
                        <Switch
                            id="is_private"
                            checked={data.is_private}
                            onCheckedChange={(checked) => setData('is_private', checked)}
                            disabled={processing}
                        />
                        <InputError message={errors.is_private} className="mt-2" />
                    </div>
                </div>
                <div className="col-span-3 grid gap-2">
                    <Label htmlFor="sqm">SQM</Label>
                    <Input
                        id="sqm"
                        type="number"
                        required
                        value={data.sqm}
                        onChange={(e) => setData('sqm', parseInt(e.target.value))}
                        disabled={processing}
                        placeholder="Square Meters"
                    />
                    <InputError message={errors.sqm} className="mt-2" />
                </div>
                <div className="col-span-3 grid gap-2">
                    <Label htmlFor="qty">Qty.</Label>
                    <Input
                        id="qty"
                        type="number"
                        required
                        value={data.qty}
                        onChange={(e) => setData('qty', parseInt(e.target.value))}
                        disabled={processing}
                        placeholder="Quantity"
                    />
                    <InputError message={errors.qty} className="mt-2" />
                </div>
                <div className="col-span-3 grid gap-2">
                    <Label htmlFor="cap">Cap.</Label>
                    <Input
                        id="cap"
                        type="number"
                        required
                        value={data.cap}
                        onChange={(e) => setData('cap', parseInt(e.target.value))}
                        disabled={processing}
                        placeholder="Capacity"
                    />
                    <InputError message={errors.cap} className="mt-2" />
                </div>
                <div className="col-span-12 grid gap-2">
                    <Label htmlFor="amenities">Amenities</Label>
                    <MultiSelect
                        options={amenities.map((amenity) => ({
                            value: amenity.id.toString(),
                            label: amenity.name,
                        }))}
                        onValueChange={(tags) => {
                            setSelectedAmenities(tags);
                            setData('amenities', tags.map(Number));
                        }}
                        defaultValue={selectedAmenities}
                        placeholder="Select amenities"
                        variant="inverted"
                    />
                    <InputError message={errors.amenities} className="mt-2" />
                </div>
                <div className="col-span-12 grid gap-2">
                    <Label htmlFor="layouts">Layouts</Label>
                    <MultiSelect
                        options={layouts.map((layout) => ({
                            value: layout.id.toString(),
                            label: layout.name,
                        }))}
                        onValueChange={(tags) => {
                            setSelectedLayouts(tags);
                            setData('layouts', tags.map(Number));
                        }}
                        defaultValue={selectedLayouts}
                        placeholder="Select layouts"
                        variant="inverted"
                    />
                    <InputError message={errors.layouts} className="mt-2" />
                </div>
                <div className="flex gap-2">
                    <Button type="submit" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Save
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={`/rooms/${data.id || ''}`}>Cancel</Link>
                    </Button>
                </div>
            </div>
        </form>
    );
}
