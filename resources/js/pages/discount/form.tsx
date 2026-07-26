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
import { Room } from '@/types';
import { DiscountForm } from '@/types/form';
import { priceDisplay } from '@/utils/formatters';
import { Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const DISCOUNT_TYPE_FIXED = 1;
const DISCOUNT_TYPE_PERCENTAGE = 2;

export default function Form({
    data,
    setData,
    processing,
    errors,
    submit,
    rooms,
}: {
    data: Partial<DiscountForm>;
    setData: (key: keyof DiscountForm, value: DiscountForm[keyof DiscountForm]) => void;
    processing: boolean;
    errors: Record<string, string>;
    submit: FormEventHandler;
    rooms: Room[];
}) {
    const [selectedRooms, setSelectedRooms] = useState<string[]>(
        data.rooms?.map((room) => room.toString()) || []
    );

    const isPercentage = Number(data.type) === DISCOUNT_TYPE_PERCENTAGE;

    // Preview against the cheapest selected room so staff can sanity-check the value.
    const sampleRoom = rooms.find((room) => data.rooms?.includes(room.id));
    const sampleRate = sampleRoom
        ? isPercentage
            ? Number(sampleRoom.price) * (1 - Number(data.value || 0) / 100)
            : Math.max(0, Number(sampleRoom.price) - Number(data.value || 0))
        : null;

    return (
        <form className="flex flex-col gap-6" onSubmit={submit}>
            <Header title={`${data.id ? 'Edit' : 'Create'} Discount`} />
            <div className="grid grid-cols-12 items-start gap-6">
                <div className="col-span-12 grid gap-2 md:col-span-6">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        required
                        autoFocus
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        disabled={processing}
                        placeholder="e.g. Summer Promo"
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>
                <div className="col-span-12 grid gap-2 md:col-span-6">
                    <Label htmlFor="description">Description</Label>
                    <Input
                        id="description"
                        type="text"
                        value={data.description ?? ''}
                        onChange={(e) => setData('description', e.target.value)}
                        disabled={processing}
                        placeholder="Optional internal note"
                    />
                    <InputError message={errors.description} className="mt-2" />
                </div>

                <div className="col-span-6 grid gap-2 md:col-span-3">
                    <Label htmlFor="type">Discount Type</Label>
                    <Select
                        value={data.type?.toString()}
                        onValueChange={(value) => setData('type', Number(value))}
                        disabled={processing}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={DISCOUNT_TYPE_FIXED.toString()}>
                                Fixed Amount
                            </SelectItem>
                            <SelectItem value={DISCOUNT_TYPE_PERCENTAGE.toString()}>
                                Percentage
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.type} className="mt-2" />
                </div>
                <div className="col-span-6 grid gap-2 md:col-span-3">
                    <Label htmlFor="value">{isPercentage ? 'Percentage (%)' : 'Amount off'}</Label>
                    <Input
                        id="value"
                        type="number"
                        step="0.01"
                        min="0"
                        max={isPercentage ? 100 : undefined}
                        required
                        value={data.value ?? ''}
                        onChange={(e) => setData('value', e.target.value)}
                        disabled={processing}
                        placeholder={isPercentage ? '10' : '50'}
                    />
                    <p className="text-muted-foreground text-xs">
                        Applied <strong>per hour</strong> off the room rate.
                        {sampleRoom && sampleRate !== null && (
                            <>
                                {' '}
                                {sampleRoom.name}: {priceDisplay(Number(sampleRoom.price))} &rarr;{' '}
                                <strong>{priceDisplay(Math.max(0, sampleRate))}</strong>/hr
                            </>
                        )}
                    </p>
                    <InputError message={errors.value} className="mt-2" />
                </div>
                <div className="col-span-6 grid gap-2 md:col-span-3">
                    <Label htmlFor="priority">Priority</Label>
                    <Input
                        id="priority"
                        type="number"
                        min="0"
                        required
                        value={data.priority ?? 0}
                        onChange={(e) => setData('priority', e.target.value)}
                        disabled={processing}
                    />
                    <p className="text-muted-foreground text-xs">
                        Lower number = higher priority. When several discounts cover the same
                        room, the one with the lowest number wins.
                    </p>
                    <InputError message={errors.priority} className="mt-2" />
                </div>
                <div className="col-span-6 grid gap-2 md:col-span-3">
                    <Label htmlFor="is_active">Status</Label>
                    <Select
                        value={data.is_active ? '1' : '0'}
                        onValueChange={(value) => setData('is_active', value === '1')}
                        disabled={processing}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Active</SelectItem>
                            <SelectItem value="0">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.is_active} className="mt-2" />
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

                <div className="col-span-12 grid grid-cols-2 gap-6 rounded-lg border p-4 md:col-span-6">
                    <div className="col-span-2">
                        <div className="font-medium">Reservation dates</div>
                        <p className="text-muted-foreground text-xs">
                            Which booking dates the discount covers.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="reserve_from">From</Label>
                        <Input
                            id="reserve_from"
                            type="date"
                            required
                            value={data.reserve_from ?? ''}
                            onChange={(e) => setData('reserve_from', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.reserve_from} className="mt-2" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="reserve_to">To</Label>
                        <Input
                            id="reserve_to"
                            type="date"
                            required
                            value={data.reserve_to ?? ''}
                            onChange={(e) => setData('reserve_to', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.reserve_to} className="mt-2" />
                    </div>
                </div>

                <div className="col-span-12 grid grid-cols-2 gap-6 rounded-lg border p-4 md:col-span-6">
                    <div className="col-span-2">
                        <div className="font-medium">Booking period</div>
                        <p className="text-muted-foreground text-xs">
                            When the inquiry must be submitted.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="book_from">From</Label>
                        <Input
                            id="book_from"
                            type="date"
                            required
                            value={data.book_from ?? ''}
                            onChange={(e) => setData('book_from', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.book_from} className="mt-2" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="book_to">To</Label>
                        <Input
                            id="book_to"
                            type="date"
                            required
                            value={data.book_to ?? ''}
                            onChange={(e) => setData('book_to', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.book_to} className="mt-2" />
                    </div>
                </div>

                <div className="col-span-12 flex gap-2">
                    <Button type="submit" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Save
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/discounts">Cancel</Link>
                    </Button>
                </div>
            </div>
        </form>
    );
}
