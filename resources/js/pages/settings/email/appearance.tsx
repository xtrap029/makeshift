import { Head, router, useForm } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import { Wysiwyg } from '@/components/custom/wysiwyg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { EmailAppearanceForm } from '@/types/form';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Settings',
        href: '',
    },
    {
        title: 'Email',
        href: '',
    },
    {
        title: 'Appearance',
        href: '/settings/appearance',
    },
];

export default function Appearance({ emailAppearance }: { emailAppearance: EmailAppearanceForm }) {
    const { data, setData, processing } = useForm<EmailAppearanceForm>({
        bankAccount: emailAppearance.bankAccount,
        supportLink: emailAppearance.supportLink,
        footer1: emailAppearance.footer1,
        footer2: emailAppearance.footer2,
        templateInquiryWhatsNext: emailAppearance.templateInquiryWhatsNext,
        templateAcknowledgedPaymentSteps: emailAppearance.templateAcknowledgedPaymentSteps,
        templateAcknowledgedScreenshot: emailAppearance.templateAcknowledgedScreenshot,
        templateAcknowledgedPaymentDeadline: emailAppearance.templateAcknowledgedPaymentDeadline,
        templateConfirmedArrival: emailAppearance.templateConfirmedArrival,
        templateConfirmedAdditionalInfo: emailAppearance.templateConfirmedAdditionalInfo,
        templateCancelledInquiry: emailAppearance.templateCancelledInquiry,
        templateCancelledMeans: emailAppearance.templateCancelledMeans,
        templateCancelledNextSteps: emailAppearance.templateCancelledNextSteps,
        templateCancelledAlternative: emailAppearance.templateCancelledAlternative,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        router.post(route('settings.email.appearance.update'), {
            _method: 'put',
            ...data,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Email appearance settings" />

            <SettingsLayout>
                <form onSubmit={submit} className="space-y-6">
                    <HeadingSmall
                        title="General Template"
                        description="Update your email's general template settings"
                    />
                    <div className="grid gap-2">
                        <Label htmlFor="supportLink">Support Link</Label>
                        <Input
                            id="supportLink"
                            type="text"
                            value={data.supportLink}
                            onChange={(e) => setData('supportLink', e.target.value)}
                            disabled={processing}
                            placeholder="Support Link"
                        />
                    </div>
                    <br />
                    <HeadingSmall
                        title="Pending Template"
                        description="Update your email's pending mail template settings"
                    />
                    <div className="grid gap-2">
                        <Label htmlFor="bankAccount">Bank Account</Label>
                        <Input
                            id="bankAccount"
                            type="text"
                            value={data.bankAccount}
                            onChange={(e) => setData('bankAccount', e.target.value)}
                            disabled={processing}
                            placeholder="Bank Account"
                            maxLength={30}
                        />
                    </div>
                    <br />
                    <HeadingSmall
                        title="Footer"
                        description="Update your email's footer settings"
                    />
                    <div className="grid gap-2">
                        <Label htmlFor="footer1">Part 1</Label>
                        <Wysiwyg
                            content={data.footer1}
                            onChange={(content) => setData('footer1', content)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="footer2">Part 2</Label>
                        <Wysiwyg
                            content={data.footer2}
                            onChange={(content) => setData('footer2', content)}
                        />
                    </div>
                    <br />
                    <HeadingSmall
                        title="Template: Inquiry"
                        description="Update your email's inquiry template settings"
                    />
                    <div className="grid gap-2">
                        <Label htmlFor="templateInquiryWhatsNext">What Happens Next?</Label>
                        <Wysiwyg
                            content={data.templateInquiryWhatsNext}
                            onChange={(content) => setData('templateInquiryWhatsNext', content)}
                        />
                    </div>
                    <br />
                    <HeadingSmall
                        title="Template: Acknowledged"
                        description="Update your email's acknowledge template settings"
                    />
                    <div className="grid gap-2">
                        <Label htmlFor="templateAcknowledgedPaymentSteps">
                            Payment Steps Required
                        </Label>
                        <Wysiwyg
                            content={data.templateAcknowledgedPaymentSteps}
                            onChange={(content) =>
                                setData('templateAcknowledgedPaymentSteps', content)
                            }
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="templateAcknowledgedScreenshot">
                            Screenshot Requirement
                        </Label>
                        <Wysiwyg
                            content={data.templateAcknowledgedScreenshot}
                            onChange={(content) =>
                                setData('templateAcknowledgedScreenshot', content)
                            }
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="templateAcknowledgedPaymentDeadline">
                            Payment Deadline
                        </Label>
                        <Wysiwyg
                            content={data.templateAcknowledgedPaymentDeadline}
                            onChange={(content) =>
                                setData('templateAcknowledgedPaymentDeadline', content)
                            }
                        />
                    </div>
                    <br />
                    <HeadingSmall
                        title="Template: Confirmed"
                        description="Update your email's confirmed template settings"
                    />
                    <div className="grid gap-2">
                        <Label htmlFor="templateConfirmedArrival">Arrival Instructions</Label>
                        <Wysiwyg
                            content={data.templateConfirmedArrival}
                            onChange={(content) => setData('templateConfirmedArrival', content)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="templateConfirmedAdditionalInfo">
                            Additional Information
                        </Label>
                        <Wysiwyg
                            content={data.templateConfirmedAdditionalInfo}
                            onChange={(content) =>
                                setData('templateConfirmedAdditionalInfo', content)
                            }
                        />
                    </div>
                    <br />
                    <HeadingSmall
                        title="Template: Cancelled"
                        description="Update your email's cancelled template settings"
                    />
                    <div className="grid gap-2">
                        <Label htmlFor="templateCancelledInquiry">Inquiry Cancelled</Label>
                        <Wysiwyg
                            content={data.templateCancelledInquiry}
                            onChange={(content) => setData('templateCancelledInquiry', content)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="templateCancelledMeans">What this means?</Label>
                        <Wysiwyg
                            content={data.templateCancelledMeans}
                            onChange={(content) => setData('templateCancelledMeans', content)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="templateCancelledNextSteps">Next Steps</Label>
                        <Wysiwyg
                            content={data.templateCancelledNextSteps}
                            onChange={(content) => setData('templateCancelledNextSteps', content)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="templateCancelledAlternative">Alternative Options</Label>
                        <Wysiwyg
                            content={data.templateCancelledAlternative}
                            onChange={(content) => setData('templateCancelledAlternative', content)}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save</Button>
                    </div>
                </form>
            </SettingsLayout>
        </AppLayout>
    );
}
