import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import React, { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: '',
        icon: null,
    },
    {
        title: 'Profile',
        href: '/settings/profile',
        icon: null,
    },
    {
        title: 'Password',
        href: '/settings/password',
        icon: null,
    },
    {
        title: 'Appearance',
        href: '/settings/appearance',
        icon: null,
    },
    {
        title: '',
        href: '',
        icon: null,
    },
    {
        title: 'Website',
        href: '',
        icon: null,
    },
    {
        title: 'Appearance',
        href: '/settings/website/appearance',
        icon: null,
    },
    {
        title: '',
        href: '',
        icon: null,
    },
    {
        title: 'Email',
        href: '',
        icon: null,
    },
    {
        title: 'Appearance',
        href: '/settings/email/appearance',
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="px-4 py-6">
            <Heading title="Settings" description="Manage your profile and account settings" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => (
                            <React.Fragment key={index}>
                                {item.href === '' && item.title !== '' && (
                                    <Label className="mb-2 ml-3 text-xs font-bold">
                                        {item.title}
                                    </Label>
                                )}
                                {item.href === '' && item.title === '' && <br />}
                                {item.href && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        asChild
                                        className={cn('w-full justify-start', {
                                            'bg-muted': currentPath === item.href,
                                            'text-muted-foreground': currentPath !== item.href,
                                        })}
                                    >
                                        <Link href={item.href} prefetch>
                                            {item.title}
                                        </Link>
                                    </Button>
                                )}
                            </React.Fragment>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
