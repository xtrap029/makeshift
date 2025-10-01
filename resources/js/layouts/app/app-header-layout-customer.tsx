import { AppContentCustomer } from '@/components/app-content-customer';
import AppLogoIcon from '@/components/app-logo-icon';
import { AppShell } from '@/components/app-shell';
import Animation from '@/components/custom/animation';
import { Button } from '@/components/ui/button';
import IconDynamic from '@/components/ui/icon-dynamic';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { PageProps } from '@inertiajs/core';
import { Link, usePage } from '@inertiajs/react';
import { CoffeeIcon, HomeIcon, MessageCircleIcon } from 'lucide-react';
import { useEffect, useState, type PropsWithChildren } from 'react';
import { toast } from 'sonner';

interface FlashProps extends PageProps {
    flash: {
        success?: string;
        error?: string;
    };
}

export default function AppHeaderLayoutCustomer({
    page,
    rightIcon,
    rightIconHref,
    children,
}: PropsWithChildren<{ page: string; rightIcon?: string; rightIconHref?: string }>) {
    const { websiteSettings } = usePage().props;
    const [scrolled, setScrolled] = useState(false);
    const { flash } = usePage<FlashProps>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        } else if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AppShell>
            <Toaster richColors position="top-right" />
            <header
                className={`bg-makeshift-primary sticky top-0 z-50 w-full pt-2 pt-6 text-white transition-all duration-300 ${
                    scrolled ? 'drop-shadow-[0_5px_5px_rgba(0,0,0,0.50)]' : ''
                }`}
            >
                <div className="m-auto flex max-w-screen-xl items-center justify-between px-4 transition-all duration-300">
                    <div
                        className={`text-makeshift-primary flex aspect-square size-8 items-center justify-center rounded-md bg-white transition-all duration-300`}
                    >
                        <AppLogoIcon
                            className={`size-6 fill-current transition-all duration-300`}
                        />
                    </div>
                    <div className="ml-2 grid flex-1 text-left text-sm">
                        <span
                            className={`mb-0.5 truncate leading-none font-semibold transition-all duration-300`}
                        >
                            MakeShift
                        </span>
                        <span className={`text-xs transition-all duration-300`}>
                            {websiteSettings.siteDescription}
                        </span>
                    </div>
                </div>
                {/* <h1
                    className={`m-auto max-w-screen-xl pr-[70px] pl-4 font-extrabold transition-all duration-300 ${
                        scrolled ? 'pt-4 pb-2 text-4xl' : 'pt-8 pb-4 text-5xl'
                    }`}
                > */}
                <h1
                    className={`m-auto max-w-screen-xl pr-[70px] pb-3 pl-4 text-4xl font-extrabold transition-all duration-300 ${
                        scrolled ? 'pt-2' : 'pt-6'
                    }`}
                >
                    <Animation>{page.charAt(0).toUpperCase() + page.slice(1)}</Animation>
                </h1>
                <div className="relative m-auto max-w-screen-xl">
                    {rightIcon && rightIconHref && (
                        <Animation isVertical>
                            <Link href={rightIconHref}>
                                <Button
                                    className={`text-makeshift-primary absolute right-4 bottom-4 rounded-full bg-white shadow-lg transition-all duration-300 ${
                                        scrolled ? 'size-8' : 'size-10'
                                    }`}
                                    size="icon"
                                >
                                    <IconDynamic name={rightIcon} className="size-5" />
                                </Button>
                            </Link>
                        </Animation>
                    )}
                </div>
            </header>
            <div className="bg-makeshift-primary">
                <div className="-mb-1 h-5 rounded-t-2xl bg-white md:rounded-t-none"></div>
            </div>
            <AppContentCustomer>
                {children}
                <div className="h-[70px]"></div>
            </AppContentCustomer>
            <div className="fixed right-0 bottom-0 left-0 m-auto max-w-screen-xl border-t-2 border-gray-200 bg-white px-4 py-6">
                <div className="flex items-center justify-around">
                    <Link href="/spaces" className="flex items-center gap-2">
                        <CoffeeIcon
                            className={cn('size-8', {
                                'text-makeshift-primary':
                                    route().current('spaces') ||
                                    route().current('spaces.show') ||
                                    route().current('reservation.inquire'),
                            })}
                        />
                        <div
                            className={cn('ml-2 hidden text-xl font-bold md:block', {
                                'text-makeshift-primary':
                                    route().current('spaces') ||
                                    route().current('spaces.show') ||
                                    route().current('reservation.inquire'),
                            })}
                        >
                            Spaces
                        </div>
                    </Link>
                    <Link href="/" className="flex items-center gap-2">
                        <HomeIcon
                            className={cn('size-8', {
                                'text-makeshift-primary': route().current('home'),
                            })}
                        />
                        <div
                            className={cn('ml-2 hidden text-xl font-bold md:block', {
                                'text-makeshift-primary': route().current('home'),
                            })}
                        >
                            Home
                        </div>
                    </Link>
                    <Link href="/contact-us" className="flex items-center gap-2">
                        <MessageCircleIcon
                            className={cn('size-8', {
                                'text-makeshift-primary': route().current('contactus'),
                            })}
                        />
                        <div
                            className={cn('ml-2 hidden text-xl font-bold md:block', {
                                'text-makeshift-primary': route().current('contactus'),
                            })}
                        >
                            Contact Us
                        </div>
                    </Link>
                </div>
            </div>
        </AppShell>
    );
}
