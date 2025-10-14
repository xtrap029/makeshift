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
    const isHome = usePage().url === '/';
    const { websiteSettings } = usePage().props;
    const [scrolled, setScrolled] = useState(false);
    const [scrolledBanner, setScrolledBanner] = useState(!isHome);
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
            if (isHome) {
                setScrolledBanner(window.scrollY > 450);
            } else {
                setScrolledBanner(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHome]);

    const header = () => {
        return (
            <>
                <div
                    className={`text-makeshift-primary flex aspect-square items-center justify-center rounded-md transition-all duration-300 ${
                        scrolledBanner ? 'size-8 bg-white' : 'size-12'
                    }`}
                >
                    <AppLogoIcon />
                </div>
                <div
                    className={`ml-2 grid flex-1 text-left text-sm ${
                        scrolledBanner ? '' : 'rounded-md p-2 text-white'
                    }`}
                >
                    <span
                        className={`truncate leading-none font-semibold transition-all duration-300 ${
                            scrolledBanner
                                ? 'mb-0.5'
                                : 'text-lg [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]'
                        }`}
                    >
                        MakeShift
                    </span>
                    <span
                        className={`transition-all duration-300 ${
                            scrolledBanner
                                ? 'text-xs'
                                : 'text-md [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]'
                        }`}
                    >
                        {websiteSettings.siteDescription}
                    </span>
                </div>
            </>
        );
    };

    return (
        <AppShell>
            <Toaster richColors position="top-right" />
            {isHome && (
                <div
                    className="h-[400px] bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(/home-banner.jpg)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    <div className="m-auto flex max-w-screen-xl items-center justify-between px-4 pt-4 transition-all duration-300">
                        {header()}
                    </div>
                </div>
            )}
            <header
                className={`bg-makeshift-coral sticky top-0 z-50 w-full pt-2 pt-6 text-white transition-all duration-300 ${
                    scrolled ? 'drop-shadow-[0_5px_5px_rgba(0,0,0,0.50)]' : ''
                } ${scrolledBanner ? 'max-h-40 opacity-100' : 'z-[-1] max-h-0 opacity-0'}`}
            >
                <div className="m-auto flex max-w-screen-xl items-center justify-between px-4 transition-all duration-300">
                    {header()}
                </div>
                <h1
                    className={`text-makeshift-header m-auto max-w-screen-xl pt-6 pr-[70px] pb-3 pl-4 text-4xl font-extrabold transition-all duration-300`}
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
            <div className={`${scrolledBanner ? 'bg-makeshift-coral' : 'mt-[-40px]'}`}>
                <div className="bg-makeshift-white -mb-1 h-5 rounded-t-2xl md:rounded-t-none"></div>
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
                                'text-makeshift-coral':
                                    route().current('spaces') ||
                                    route().current('spaces.show') ||
                                    route().current('reservation.inquire'),
                            })}
                        />
                        <div
                            className={cn('ml-2 hidden text-xl font-bold md:block', {
                                'text-makeshift-coral':
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
                                'text-makeshift-coral': route().current('home'),
                            })}
                        />
                        <div
                            className={cn('ml-2 hidden text-xl font-bold md:block', {
                                'text-makeshift-coral': route().current('home'),
                            })}
                        >
                            Home
                        </div>
                    </Link>
                    <Link href="/contact-us" className="flex items-center gap-2">
                        <MessageCircleIcon
                            className={cn('size-8', {
                                'text-makeshift-coral': route().current('contactus'),
                            })}
                        />
                        <div
                            className={cn('ml-2 hidden text-xl font-bold md:block', {
                                'text-makeshift-coral': route().current('contactus'),
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
