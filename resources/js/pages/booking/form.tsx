import Header from '@/components/custom/page/header';
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
import { Textarea } from '@/components/ui/textarea';
import { bookingStatus } from '@/constants';
import { Layout, Room } from '@/types';
import { BookingForm } from '@/types/form';
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
    layouts,
}: {
    data: Partial<BookingForm>;
    setData: (key: keyof BookingForm, value: BookingForm[keyof BookingForm]) => void;
    processing: boolean;
    errors: Record<string, string>;
    submit: FormEventHandler;
    rooms: Room[];
    layouts: Layout[];
}) {
    const isPending =
        bookingStatus.find((status) => status.id === data.status)?.label === 'Pending';

    const [selectedRoom, setSelectedRoom] = useState<string | undefined>(
        data.room_id?.toString() || undefined
    );

    const [selectedLayout, setSelectedLayout] = useState<string | undefined>(
        data.layout_id?.toString() || undefined
    );

    const [selectedQty, setSelectedQty] = useState<string | undefined>(
        data.qty?.toString() || undefined
    );

    const [selectedStart, setSelectedStart] = useState<string | undefined>(
        data.start_time?.toString() || undefined
    );

    const [selectedEnd, setSelectedEnd] = useState<string | undefined>(
        data.end_time?.toString() || undefined
    );

    return (
        <form className="flex flex-col gap-6" onSubmit={submit}>
            <Header title={`${data.id ? 'Edit' : 'Create'} Booking`} />
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-4 grid gap-2">
                    <Label htmlFor="customer_name">Customer Name</Label>
                    <Input
                        id="customer_name"
                        type="text"
                        required
                        autoFocus
                        value={data.customer_name}
                        onChange={(e) => setData('customer_name', e.target.value)}
                        disabled={processing}
                        placeholder="Customer Name"
                    />
                    <InputError message={errors.customer_name} className="mt-2" />
                </div>
                <div className="col-span-4 grid gap-2">
                    <Label htmlFor="customer_email">Customer Email</Label>
                    <Input
                        id="customer_email"
                        type="email"
                        required
                        value={data.customer_email}
                        onChange={(e) => setData('customer_email', e.target.value)}
                        disabled={processing}
                        placeholder="Customer Email"
                    />
                    <InputError message={errors.customer_email} className="mt-2" />
                </div>
                <div className="col-span-4 grid gap-2">
                    <Label htmlFor="customer_phone">Customer Phone</Label>
                    <Input
                        id="customer_phone"
                        type="text"
                        required
                        value={data.customer_phone}
                        onChange={(e) => setData('customer_phone', e.target.value)}
                        disabled={processing}
                        placeholder="Customer Phone"
                    />
                    <InputError message={errors.customer_phone} className="mt-2" />
                </div>
                <div className="col-span-4 grid gap-2">
                    <Label htmlFor="room_id">Room</Label>
                    <Select
                        value={selectedRoom}
                        onValueChange={(value) => {
                            setSelectedRoom(value);
                            setData('room_id', parseInt(value));
                        }}
                        required
                        disabled={processing || isPending}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a room" />
                        </SelectTrigger>
                        <SelectContent>
                            {rooms.map((room) => (
                                <SelectItem key={room.id} value={room.id.toString()}>
                                    {room.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.room_id} className="mt-2" />
                </div>
                <div className="col-span-4 grid gap-2">
                    <Label htmlFor="qty">Qty</Label>
                    <Select
                        value={selectedQty}
                        onValueChange={(value) => {
                            setSelectedQty(value);
                            setData('qty', parseInt(value));
                        }}
                        required
                        disabled={processing || isPending}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select qty" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from(
                                {
                                    length:
                                        (selectedRoom &&
                                            rooms.find((room) => room.id === parseInt(selectedRoom))
                                                ?.qty) ||
                                        0,
                                },
                                (_, i) => (
                                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                                        {i + 1}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.qty} className="mt-2" />
                </div>
                <div className="col-span-4 grid gap-2">
                    <Label htmlFor="layout_id">Layout</Label>
                    <Select
                        value={selectedLayout}
                        onValueChange={(value) => {
                            setSelectedLayout(value);
                            setData('layout_id', parseInt(value));
                        }}
                        required
                        disabled={processing}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a layout" />
                        </SelectTrigger>
                        <SelectContent>
                            {layouts.map((layout) => (
                                <SelectItem key={layout.id} value={layout.id.toString()}>
                                    {layout.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.layout_id} className="mt-2" />
                </div>
                <div className="col-span-12 grid gap-2">
                    <Label htmlFor="note">Notes</Label>
                    <Textarea
                        id="note"
                        value={data.note || ''}
                        onChange={(e) => setData('note', e.target.value)}
                        disabled={processing}
                        placeholder="Notes"
                    />
                </div>
                <div className="col-span-4 grid gap-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                        id="start_date"
                        type="date"
                        required
                        value={data.start_date}
                        onChange={(e) => setData('start_date', e.target.value)}
                        disabled={processing || isPending}
                    />
                    <InputError message={errors.start_date} className="mt-2" />
                </div>
                <div className="col-span-4 grid gap-2">
                    <Label htmlFor="start_time">Start Time</Label>
                    <Select
                        value={selectedStart}
                        onValueChange={(value) => {
                            setSelectedStart(value);
                            setData('start_time', value);
                        }}
                        required
                        disabled={processing || isPending}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a start time" />
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
                    <InputError message={errors.start_time} className="mt-2" />
                </div>
                <div className="col-span-4 grid gap-2">
                    <Label htmlFor="end_time">End Time</Label>
                    <Select
                        value={selectedEnd}
                        onValueChange={(value) => {
                            setSelectedEnd(value);
                            setData('end_time', value);
                        }}
                        required
                        disabled={processing || isPending}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a end time" />
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
                    <InputError message={errors.end_time} className="mt-2" />
                </div>
                {isPending && (
                    <div className="col-span-4 grid gap-2">
                        <Label htmlFor="expires_at">Expires At</Label>
                        <Input
                            id="expires_at"
                            type="datetime-local"
                            value={data.expires_at}
                            onChange={(e) => setData('expires_at', e.target.value)}
                            disabled={processing}
                            min={new Date().toISOString().slice(0, 16)}
                            max={
                                data.start_date
                                    ? new Date(data.start_date).toISOString().slice(0, 16)
                                    : new Date().toISOString().slice(0, 16)
                            }
                        />
                        <InputError message={errors.expires_at} className="mt-2" />
                    </div>
                )}
                <div className="col-span-12 grid gap-2">
                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Save
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={`/bookings/${data.id || ''}`}>Cancel</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
