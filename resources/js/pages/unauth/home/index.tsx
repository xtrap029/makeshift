import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayoutHeaderCustomer from '@/layouts/app/app-header-layout-customer';
import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <AppLayoutHeaderCustomer page="Welcome">
            <Head title="Home" />
            <div className="flex flex-col items-center">
                <div className="grid w-full grid-cols-2 gap-4">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative col-span-2 aspect-video h-50 w-full overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/30" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video h-50 w-full overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/30" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video h-50 w-full overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/30" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative col-span-2 aspect-video h-50 w-full overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/30" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video h-50 w-full overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/30" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video h-50 w-full overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/30" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video h-50 w-full overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/30" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video h-50 w-full overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/30" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video h-50 w-full overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/30" />
                    </div>
                </div>
            </div>
        </AppLayoutHeaderCustomer>
    );
}
