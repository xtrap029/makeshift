import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { Amenity, BreadcrumbItem, Room } from '@/types';
import { RoomForm } from '@/types/form';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Rooms', href: '/rooms' },
    { title: 'Edit', href: '/rooms/edit' },
];

export default function Edit({ room, amenities }: { room: Room; amenities: Amenity[] }) {
    const { errors } = usePage().props;
    const { data, setData, processing } = useForm<Partial<RoomForm>>({
        name: room.name,
        price: room.price,
        is_active: room.is_active,
        description: room.description,
        is_private: room.is_private,
        sqm: room.sqm,
        qty: room.qty,
        cap: room.cap,
        amenities: room.amenities.map((amenity) => amenity.id),
        image: null,
    });

    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
        room.amenities?.map((amenity) => amenity.id.toString()) || []
    );

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        router.post(route('rooms.update', { room: room.id }), {
            _method: 'put',
            ...data,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rooms - Edit" />
            <div className="p-4">
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        <div className="col-span-9 grid gap-2">
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
                            <Label htmlFor="image">
                                {!room.image && 'Image'}
                                {room.image && (
                                    <a
                                        href={`/storage/${room.image?.name}`}
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
                                required={!room.image}
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
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Save changes
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/rooms">Cancel</Link>
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
