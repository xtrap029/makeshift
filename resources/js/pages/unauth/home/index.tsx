import { Card, CardContent } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayoutHeaderCustomer from '@/layouts/app/app-header-layout-customer';
import { WebsiteAppearanceForm } from '@/types/form';
import { Head } from '@inertiajs/react';

export default function Index({ websiteAppearance }: { websiteAppearance: WebsiteAppearanceForm }) {
    return (
        <AppLayoutHeaderCustomer page="Welcome">
            <Head title="Home" />
            <div className="flex flex-col items-center">
                <div className="grid w-full grid-cols-2 gap-10">
                    <div className="col-span-2 md:col-span-1">
                        <h2 className="text-foreground text-xl">
                            {websiteAppearance.homeYoutubeText}
                        </h2>
                        <Card className="shadow-l mt-3 w-full overflow-hidden rounded-2xl p-0">
                            <CardContent className="p-0">
                                <iframe
                                    src={`https://www.youtube.com/embed/${websiteAppearance.homeYoutubeLink}?rel=0&modestbranding=1&showinfo=0&controls=0`}
                                    title="Youtube"
                                    className="h-96 w-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                ></iframe>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <h2 className="text-foreground text-xl">{websiteAppearance.homeMapText}</h2>
                        <Card className="shadow-l mt-3 w-full overflow-hidden rounded-2xl p-0">
                            <CardContent className="p-0">
                                <iframe
                                    title="Map"
                                    src={websiteAppearance.homeMapLink}
                                    className="h-96 w-full border-0"
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </CardContent>
                        </Card>
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
