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
import { paymentStatus } from '@/constants';
import { Booking, PaymentProvider } from '@/types';
import { PaymentForm } from '@/types/form';
import { Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Form({
    data,
    setData,
    processing,
    errors,
    bookings,
    payment_providers,
    submit,
}: {
    data: Partial<PaymentForm>;
    setData: (key: keyof PaymentForm, value: PaymentForm[keyof PaymentForm]) => void;
    processing: boolean;
    errors: Record<string, string>;
    submit: FormEventHandler;
    bookings: Booking[];
    payment_providers: PaymentProvider[];
}) {
    const [selectedBooking, setSelectedBooking] = useState<string | undefined>(
        data.booking_id?.toString() || undefined
    );

    const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<string | undefined>(
        data.payment_provider_id?.toString() || undefined
    );

    // const [withAttachment, setWithAttachment] = useState<boolean>(data.with_attachment || false);

    const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('attachment', file);
        }
    };

    return (
        <form className="flex flex-col gap-6" onSubmit={submit}>
            <Header title={`${data.id ? 'Edit' : 'Create'} Payment`} />
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-4 grid gap-2">
                    <Label htmlFor="booking_id">Booking</Label>
                    <Select
                        value={selectedBooking}
                        onValueChange={(value) => {
                            setSelectedBooking(value);
                            setData('booking_id', parseInt(value));
                        }}
                        required
                        disabled={processing}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a booking" />
                        </SelectTrigger>
                        <SelectContent>
                            {bookings.map((booking) => (
                                <SelectItem key={booking.id} value={booking.id.toString()}>
                                    {booking.id} - {booking.room.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.booking_id} className="mt-2" />
                </div>
                <div className="col-span-4 grid gap-2">
                    <Label htmlFor="payment_provider_id">Payment Provider</Label>
                    <Select
                        value={selectedPaymentProvider}
                        onValueChange={(value) => {
                            setSelectedPaymentProvider(value);
                            setData('payment_provider_id', parseInt(value));
                        }}
                        required
                        disabled={processing}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a payment provider" />
                        </SelectTrigger>
                        <SelectContent>
                            {payment_providers.map((payment_provider) => (
                                <SelectItem
                                    key={payment_provider.id}
                                    value={payment_provider.id.toString()}
                                >
                                    {payment_provider.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.payment_provider_id} className="mt-2" />
                </div>
                <div className="col-span-4 grid gap-2">
                    <Label htmlFor="reference_number">Reference Number</Label>
                    <Input
                        id="reference_number"
                        type="text"
                        required
                        value={data.reference_number}
                        onChange={(e) => setData('reference_number', e.target.value)}
                        disabled={processing}
                        placeholder="Reference Number"
                    />
                    <InputError message={errors.reference_number} className="mt-2" />
                </div>
                <div className="col-span-4 grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                        id="amount"
                        type="number"
                        required
                        value={data.amount}
                        onChange={(e) => setData('amount', parseInt(e.target.value))}
                        disabled={processing}
                        placeholder="Amount"
                    />
                    <InputError message={errors.amount} className="mt-2" />
                </div>
                <div className="col-span-4 grid gap-2">
                    <Label htmlFor="amount_paid">Amount Paid</Label>
                    <Input
                        id="amount_paid"
                        type="number"
                        value={data.amount_paid}
                        onChange={(e) => setData('amount_paid', parseInt(e.target.value))}
                        disabled={processing}
                        placeholder="Amount Paid"
                    />
                    <InputError message={errors.amount_paid} className="mt-2" />
                </div>
                <div className="col-span-4 grid gap-2">
                    <Label htmlFor="paid_at">Paid At</Label>
                    <Input
                        id="paid_at"
                        type="datetime-local"
                        value={data.paid_at}
                        onChange={(e) => setData('paid_at', e.target.value)}
                        disabled={processing}
                    />
                    <InputError message={errors.paid_at} className="mt-2" />
                </div>
                <div className="col-span-12 grid gap-2">
                    <Label htmlFor="note">Notes</Label>
                    <Textarea
                        id="note"
                        value={data.note}
                        onChange={(e) => setData('note', e.target.value)}
                        disabled={processing}
                        placeholder="Notes"
                    />
                </div>
                <div className="col-span-4 grid gap-2">
                    <Label htmlFor="with_attachment">With Attachment</Label>
                    <Select
                        value={data.with_attachment ? 'yes' : 'no'}
                        onValueChange={(value) => {
                            setData('with_attachment', value === 'yes');
                        }}
                        required
                        disabled={processing}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="With Attachment" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.with_attachment} className="mt-2" />
                </div>
                <div className="col-span-4 grid gap-2">
                    <Label htmlFor="attachment">
                        {!data.attachment_name && 'Attachment'}
                        {data.attachment_name && (
                            <a
                                href={`/storage/${data.attachment_name}`}
                                target="_blank"
                                className="text-blue-300 underline"
                            >
                                Replace Attachment
                            </a>
                        )}
                    </Label>
                    <Input
                        id="attachment"
                        type="file"
                        onChange={handleAttachmentChange}
                        accept="image/png, image/jpeg, image/jpg, application/pdf"
                        required={data.with_attachment && !data.attachment_name}
                    />
                    <InputError message={errors.attachment} className="mt-2" />
                </div>
                {data.id && (
                    <div className="col-span-4 grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={data.status?.toString()}
                            onValueChange={(value) => {
                                setData('status', parseInt(value));
                            }}
                            required
                            disabled={processing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                {paymentStatus.map((status) => (
                                    <SelectItem key={status.id} value={status.id.toString()}>
                                        {status.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} className="mt-2" />
                    </div>
                )}
                <div className="col-span-12 flex gap-2">
                    <Button type="submit" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Save
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={`/payments/${data.id || ''}`}>Cancel</Link>
                    </Button>
                </div>
            </div>
        </form>
    );
}
