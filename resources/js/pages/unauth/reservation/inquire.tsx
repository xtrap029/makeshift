import { Input } from '@/components/custom/makeshift/input';
import RichText from '@/components/custom/richText';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { formValidation } from '@/constants/form';
import AppLayoutHeaderCustomer from '@/layouts/app/app-header-layout-customer';
import { Room } from '@/types';
import { InquiryForm, LegalAppearanceForm } from '@/types/form';
import { priceDisplay } from '@/utils/formatters';
import { Head, router, useForm } from '@inertiajs/react';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { Search, SquareDashed, Users } from 'lucide-react';
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

export default function Inquire({
    inquiry,
    room,
    legal,
}: {
    inquiry: InquiryForm;
    room: Room;
    legal: LegalAppearanceForm;
}) {
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

    const [legalDialogOpen, setLegalDialogOpen] = useState(false);
    const [selectedLegal, setSelectedLegal] = useState<string | null>(null);

    const [flipped, setFlipped] = useState(false);

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
            <Dialog open={legalDialogOpen} onOpenChange={setLegalDialogOpen}>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedLegal === 'terms'
                                ? 'Terms and Conditions'
                                : selectedLegal === 'privacy'
                                  ? 'Privacy Policy'
                                  : 'House Rules'}
                        </DialogTitle>
                        <DialogDescription
                            className="mt-4 items-center justify-center text-left"
                            asChild
                        >
                            <div>
                                <RichText
                                    html={legal[selectedLegal as keyof LegalAppearanceForm] ?? ''}
                                />
                                <Button
                                    variant="makeshiftOutline"
                                    size="makeshiftXl"
                                    onClick={() => {
                                        setLegalDialogOpen(false);
                                        setSelectedLegal(null);
                                    }}
                                    className="mt-4 w-full"
                                >
                                    Close
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-3 gap-6 text-sm">
                    <div
                        className="perspective col-span-3 h-auto w-full cursor-pointer md:col-span-1"
                        onClick={() => setFlipped(!flipped)}
                    >
                        <motion.div
                            className="relative h-full w-full"
                            animate={{ rotateY: flipped ? 180 : 0 }}
                            transition={{ duration: 0.6 }}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <div className="inset-0 flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-5 backface-hidden">
                                <div className="flex items-center gap-5">
                                    <div className="relative">
                                        <img
                                            src={`/storage/${room.image?.name}`}
                                            alt={room.name}
                                            className="h-25 w-25 rounded-xl object-cover"
                                        />
                                        <span className="absolute right-0 bottom-0 m-1 rounded-full bg-white p-1 shadow-sm">
                                            <Search className="size-4" />
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-xl font-bold">{room.name}</h2>
                                        <div className="text-muted-foreground">
                                            {inquiry.layout} layout
                                        </div>
                                        <div className="mt-3 flex flex-row gap-4">
                                            <div className="flex gap-1">
                                                <Users className="size-4" />
                                                <div>{room.cap} pax</div>
                                            </div>
                                            <div className="flex gap-1">
                                                <SquareDashed className="size-4" />
                                                <div>{room.sqm} sqm</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-2 border-t border-gray-200 pt-3">
                                    <div className="flex flex-1 flex-col gap-2">
                                        <div className="font-bold">Date</div>
                                        <div className="text-sm">
                                            {dayjs(inquiry.date).format('DD MMM YYYY')}
                                        </div>
                                    </div>
                                    <div className="flex flex-1 flex-col gap-2">
                                        <div className="font-bold">Time</div>
                                        <div className="text-sm">
                                            {inquiry.start_time} - {inquiry.end_time}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 border-t border-gray-200 pt-3">
                                    <div className="flex flex-row gap-2">
                                        <div className="flex flex-1 flex-col gap-2">
                                            <div className="font-bold">Computation</div>
                                            <div className="text-sm">
                                                {priceDisplay(Number(room.price))} x{' '}
                                                {inquiry.end_time && inquiry.start_time
                                                    ? Number(inquiry.end_time.split(':')[0]) -
                                                      Number(inquiry.start_time.split(':')[0])
                                                    : 0}{' '}
                                                hours
                                            </div>
                                        </div>
                                        <div className="flex items-end text-right">
                                            {priceDisplay(
                                                inquiry.end_time && inquiry.start_time
                                                    ? room.price *
                                                          (Number(inquiry.end_time.split(':')[0]) -
                                                              Number(
                                                                  inquiry.start_time.split(':')[0]
                                                              ))
                                                    : 0
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-2">
                                        <div className="flex flex-1 flex-col gap-2">
                                            Discount / Promo
                                        </div>
                                        <div className="flex items-end text-right">
                                            {priceDisplay(0)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-row items-center border-t border-gray-200 pt-3">
                                    <div className="font-bold">Total Price</div>
                                    <div className="flex-1 text-right font-bold">
                                        {priceDisplay(
                                            inquiry.end_time && inquiry.start_time
                                                ? room.price *
                                                      (Number(inquiry.end_time.split(':')[0]) -
                                                          Number(inquiry.start_time.split(':')[0]))
                                                : 0
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 rotate-y-180 backface-hidden">
                                <img
                                    src={`/storage/${room.image?.name}`}
                                    alt="Front"
                                    className="h-full w-full rounded-xl object-cover shadow-lg"
                                />
                                <span className="absolute right-0 bottom-0 m-2 flex-col rounded-full bg-white p-2 shadow-sm">
                                    See Inquiry Details
                                </span>
                            </div>
                        </motion.div>
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
                                className="rounded-2xl bg-white"
                                disabled={processing}
                            />
                            <InputError message={zodErrors.note || errors.note} className="ml-3" />
                        </div>
                        <div className="col-span-2 flex flex-col gap-2 md:flex-row md:justify-end">
                            <p className="text-muted-foreground py-3 text-center md:py-0 md:text-left">
                                By clicking ‘Submit Inquiry’, you agree to the{' '}
                                <span
                                    className="text-makeshift-primary underline"
                                    onClick={() => {
                                        setLegalDialogOpen(true);
                                        setSelectedLegal('terms');
                                    }}
                                >
                                    Terms and Conditions
                                </span>
                                ,{' '}
                                <span
                                    className="text-makeshift-primary underline"
                                    onClick={() => {
                                        setLegalDialogOpen(true);
                                        setSelectedLegal('privacy');
                                    }}
                                >
                                    Privacy Policy
                                </span>
                                and{' '}
                                <span
                                    className="text-makeshift-primary underline"
                                    onClick={() => {
                                        setLegalDialogOpen(true);
                                        setSelectedLegal('rules');
                                    }}
                                >
                                    House Rules
                                </span>
                                .
                            </p>
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
                                disabled={processing}
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
