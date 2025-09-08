import { usePage } from '@inertiajs/react';
import AppLogoIcon from './app-logo-icon';

export default function AppLogoCustomer() {
    const { websiteSettings } = usePage().props as unknown as {
        websiteSettings: {
            siteDescription: string | null;
        };
    };

    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">MakeShift</span>
                <span className="text-xs">{websiteSettings.siteDescription}</span>
            </div>
        </>
    );
}
