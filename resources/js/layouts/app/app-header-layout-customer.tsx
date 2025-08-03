import { AppContentCustomer } from '@/components/app-content-customer';
// import AppLogoCustomer from '@/components/app-logo-customer';
import AppLogoIcon from '@/components/app-logo-icon';
import { AppShell } from '@/components/app-shell';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { CoffeeIcon, HomeIcon, QrCodeIcon } from 'lucide-react';
import { useEffect, useState, type PropsWithChildren } from 'react';

export default function AppHeaderLayoutCustomer({
    page,
    children,
}: PropsWithChildren<{ page: string }>) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AppShell>
            <header
                className={`bg-makeshift-primary sticky top-0 z-50 w-full text-white transition-all duration-300 ${
                    scrolled ? 'pt-2' : 'pt-6'
                }`}
            >
                <div className="flex max-w-screen-xl items-center justify-between px-4 transition-all duration-300">
                    <div
                        className={`flex aspect-square items-center justify-center rounded-md transition-all duration-300 ${
                            scrolled ? 'size-4' : 'text-makeshift-primary size-8 bg-white'
                        }`}
                    >
                        <AppLogoIcon
                            className={`fill-current transition-all duration-300 ${
                                scrolled ? 'size-4' : 'size-6'
                            }`}
                        />
                    </div>
                    <div className="ml-2 grid flex-1 text-left text-sm">
                        <span
                            className={`truncate leading-none font-semibold transition-all duration-300 ${
                                scrolled ? '' : 'mb-0.5'
                            }`}
                        >
                            MakeShift
                        </span>
                        <span
                            className={`text-xs transition-all duration-300 ${
                                scrolled ? 'hidden' : ''
                            }`}
                        >
                            Your office, reimagined.
                        </span>
                    </div>
                </div>
                <h1
                    className={`max-w-screen-xl px-4 font-extrabold transition-all duration-300 ${
                        scrolled ? 'pt-4 pb-2 text-3xl' : 'pt-8 pb-4 text-5xl'
                    }`}
                >
                    {page.charAt(0).toUpperCase() + page.slice(1)}
                </h1>
            </header>
            <div className="bg-makeshift-primary">
                <div className="h-5 rounded-t-2xl bg-white"></div>
            </div>
            <AppContentCustomer>{children}</AppContentCustomer>
            <div className="fixed right-0 bottom-0 left-0 border-t-2 border-gray-200 bg-white px-4 py-6">
                <div className="flex items-center justify-around">
                    <Link href="/">
                        <CoffeeIcon className="size-8" />
                    </Link>
                    <Link href="/">
                        <HomeIcon
                            className={cn('size-8', {
                                'text-makeshift-primary': route().current('home'),
                            })}
                        />
                    </Link>
                    <Link href="/">
                        <QrCodeIcon className="size-8" />
                    </Link>
                </div>
            </div>
        </AppShell>
    );
}
