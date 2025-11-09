import { Input } from '@/components/custom/makeshift/input';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formValidation } from '@/constants/form';
import AppLayoutHeaderCustomer from '@/layouts/app/app-header-layout-customer';
import { WebsiteAppearanceForm } from '@/types/form';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import z from 'zod';

const validationSchema = z.object({
    email: z
        .email('Invalid email address')
        .max(
            formValidation.email.max,
            `Email must be less than ${formValidation.email.max} characters`
        ),
});

export default function Index({ contact }: { contact: WebsiteAppearanceForm }) {
    const { data, setData, processing, errors, post } = useForm<{ email: string }>({
        email: '',
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
        post(route('contactus.resend'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setData('email', '');
            },
        });
    };

    return (
        <AppLayoutHeaderCustomer page="Contact Us">
            <Head title="Contact Us" />
            <form onSubmit={handleSubmit}>
                <div className="flex w-auto flex-col gap-3 py-6">
                    <div className="grid grid-cols-3 gap-5">
                        <div className="col-span-3 flex flex-col gap-3 md:col-span-1">
                            <div className="col-span-3 flex w-full flex-col gap-3 md:col-span-1">
                                <h2 className="text-foreground text-xl">Your reservations?</h2>
                                <p className="text-muted-foreground text-sm">
                                    No worries! We'll send you your active reservations. Just
                                    provide your email below.
                                </p>
                                <div className="flex flex-row gap-3">
                                    <div className="flex-1">
                                        <Input
                                            id="email"
                                            type="text"
                                            autoFocus
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
                                    <Button
                                        variant="makeshiftDefault"
                                        size="makeshiftXl"
                                        disabled={processing}
                                        type="submit"
                                        className="md:w-fit"
                                    >
                                        Send
                                    </Button>
                                </div>
                            </div>
                            <Separator className="col-span-3 my-4" />
                            <h2 className="text-foreground text-xl">Stay in touch</h2>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-foreground text-md">Email</h3>
                                <p className="text-muted-foreground text-sm">
                                    <a href={`mailto:${contact.siteEmail}`}>{contact.siteEmail}</a>
                                </p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-foreground text-md">Phone</h3>
                                <p className="text-muted-foreground text-sm">
                                    <a href={`tel:${contact.sitePhone}`}>{contact.sitePhone}</a>
                                </p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-foreground text-md">Address</h3>
                                <p className="text-muted-foreground text-sm">
                                    {contact.siteAddress}
                                </p>
                            </div>
                        </div>
                        <Card className="shadow-l col-span-3 w-full overflow-hidden rounded-2xl p-0 md:col-span-2">
                            <CardContent className="p-0">
                                <iframe
                                    title="Google Map"
                                    src={contact.siteGoogleMap}
                                    className="h-102 w-full border-0"
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </AppLayoutHeaderCustomer>
    );
}
