import { Input } from '@/components/custom/makeshift/input';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formValidation } from '@/constants/form';
import AppLayoutHeaderCustomer from '@/layouts/app/app-header-layout-customer';
import { Room } from '@/types';
import { InquiryForm } from '@/types/form';
import { priceDisplay } from '@/utils/formatters';
import { Head, router, useForm } from '@inertiajs/react';
import dayjs from 'dayjs';
import { SquareDashed, Users } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

const validationSchema = z.object({
    name: z
        .string()
        .min(formValidation.name.min, `Name must be at least ${formValidation.name.min} characters`)
        .max(
            formValidation.name.max,
            `Name must be less than ${formValidation.name.max} characters`
        ),
    email: z
        .email('Invalid email address')
        .max(
            formValidation.email.max,
            `Email must be less than ${formValidation.email.max} characters`
        ),
    phone: z
        .string()
        .min(
            formValidation.phone.min,
            `Phone number must be at least ${formValidation.phone.min} characters`
        ),
    note: z
        .string()
        .max(
            formValidation.note.max,
            `Note must be less than ${formValidation.note.max} characters`
        )
        .optional(),
});

export default function Inquire({ inquiry, room }: { inquiry: InquiryForm; room: Room }) {
    const { data, setData, processing, errors, post } = useForm<Partial<InquiryForm>>({
        name: '',
        email: '',
        phone: '',
        date: inquiry.date,
        start_time: inquiry.start_time,
        end_time: inquiry.end_time,
        layout: inquiry.layout,
        note: '',
    });

    const [zodErrors, setZodErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = validationSchema.safeParse(data);

        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach((err) => {
                if (err.path[0]) {
                    newErrors[err.path[0].toString()] = err.message;
                }
            });
            setZodErrors(newErrors);
            return;
        }

        setZodErrors({});
        post(route('reservation.inquire.post', { roomName: room.name }), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayoutHeaderCustomer
            page="Inquire"
            rightIcon="arrow-left"
            rightIconHref={`/spaces/${room.name}`}
        >
            <Head title="Inquire" />
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-3 gap-6 text-sm">
                    <div className="text-foreground col-span-3 flex flex-col gap-2 rounded-2xl border bg-gray-100 p-4 text-center md:col-span-1">
                        <h2 className="text-lg font-bold">{room.name}</h2>
                        <div className="mt-2 flex flex-row items-center gap-4">
                            <div className="flex flex-1 items-center justify-center gap-1">
                                <Users className="size-4" />
                                <div>{room.cap} pax</div>
                            </div>
                            <div className="flex flex-1 items-center justify-center gap-1">
                                <SquareDashed className="size-4" />
                                <div>{room.sqm} sqm</div>
                            </div>
                        </div>
                        <div className="mt-2 flex flex-row gap-2 border-t border-gray-200 pt-3">
                            <div className="flex flex-1 flex-col gap-2">
                                <div className="text-muted-foreground">Date</div>
                                <div className="text-sm">
                                    {dayjs(inquiry.date).format('DD MMM YYYY')}
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col gap-2">
                                <div className="text-muted-foreground">Time</div>
                                <div className="text-sm">
                                    {inquiry.start_time} - {inquiry.end_time}
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col gap-2">
                                <div className="text-muted-foreground">Layout</div>
                                <div className="text-sm">{inquiry.layout}</div>
                            </div>
                        </div>
                        <div className="mt-2 border-t border-gray-200 pt-3">
                            <div className="text-makeshift-primary text-2xl font-bold">
                                {priceDisplay(
                                    inquiry.end_time && inquiry.start_time
                                        ? room.price *
                                              (Number(inquiry.end_time.split(':')[0]) -
                                                  Number(inquiry.start_time.split(':')[0]))
                                        : 0
                                )}
                            </div>
                            <div className="text-muted-foreground">Total Price</div>
                        </div>
                    </div>
                    <div className="col-span-3 grid grid-cols-2 gap-4 md:col-span-2">
                        <div className="col-span-2">
                            <div className="text-muted-foreground mb-2 ml-3">Full Name</div>
                            <Input
                                id="name"
                                type="text"
                                autoFocus
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Enter Full Name"
                                disabled={processing}
                            />
                            <InputError message={zodErrors.name || errors.name} className="ml-3" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <div className="text-muted-foreground mb-2 ml-3">Email</div>
                            <Input
                                id="email"
                                type="email"
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Enter Email"
                                disabled={processing}
                            />
                            <InputError
                                message={zodErrors.email || errors.email}
                                className="ml-3"
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <div className="text-muted-foreground mb-2 ml-3">Phone</div>
                            <Input
                                id="phone"
                                type="tel"
                                autoComplete="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="Enter Phone Number"
                                disabled={processing}
                            />
                            <InputError
                                message={zodErrors.phone || errors.phone}
                                className="ml-3"
                            />
                        </div>
                        <div className="col-span-2">
                            <div className="text-muted-foreground mb-2 ml-3">Note</div>
                            <Textarea
                                id="note"
                                rows={4}
                                value={data.note}
                                onChange={(e) => setData('note', e.target.value)}
                                placeholder="Enter Note"
                                className="rounded-2xl"
                                disabled={processing}
                            />
                            <InputError message={zodErrors.note || errors.note} className="ml-3" />
                        </div>
                        <div className="col-span-2 flex flex-col gap-2 md:flex-row md:justify-end">
                            <Button
                                variant="makeshiftDefault"
                                size="makeshiftXl"
                                className="md:order-2"
                                disabled={processing}
                                type="submit"
                            >
                                Submit Inquiry
                            </Button>
                            <Button
                                variant="makeshiftOutline"
                                size="makeshiftXl"
                                onClick={() => router.visit(`/spaces/${room.name}`)}
                                className="md:order-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </AppLayoutHeaderCustomer>
    );
}
