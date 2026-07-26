import RichText from '@/components/custom/richText';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import AppLayoutHeaderCustomer from '@/layouts/app/app-header-layout-customer';
import { Announcement, Room } from '@/types';
import { WebsiteAppearanceForm } from '@/types/form';
import { priceDisplay } from '@/utils/formatters';
import { Head, router } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronsRight, SquareDashed, Users } from 'lucide-react';

export default function Index({
    websiteAppearance,
    roomSlider,
    announcements,
}: {
    websiteAppearance: WebsiteAppearanceForm;
    roomSlider: Room[];
    announcements: Announcement[];
}) {
    return (
        <AppLayoutHeaderCustomer page="Welcome" fullWidth={true}>
            <Head title="Home" />
            <div className="-mx-4 flex flex-col items-center">
                {announcements.length > 0 && (
                    <div className="w-full pt-3 pb-8">
                        {announcements.length === 1 && (
                            <div className="w-full max-w-7xl m-auto px-4">
                                <AnnouncementImage announcement={announcements[0]} />
                            </div>
                        )}
                        {announcements.length > 1 && (
                            <Carousel
                                opts={{ align: 'start', loop: true }}
                                plugins={[Autoplay({ delay: 4000 })]}
                                orientation="horizontal"
                                className="w-full max-w-7xl m-auto px-4"
                            >
                                <CarouselContent className="ml-0">
                                    {announcements.map((announcement) => (
                                        <CarouselItem
                                            key={announcement.id}
                                            className="basis-full pl-0"
                                        >
                                            <AnnouncementImage announcement={announcement} />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                            </Carousel>
                        )}
                    </div>
                )}
                <div className="w-full bg-makeshift-black py-3">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 max-w-7xl m-auto">
                        <div className="px-4 py-6 text-white md:col-span-1">
                            <h2 className="text-makeshift-header text-2xl">Featured Space</h2>
                            <div className="relative">
                                <Badge
                                    variant="secondary"
                                    className="absolute top-0 right-0 mt-4 mr-3 animate-pulse cursor-pointer"
                                    onClick={() =>
                                        router.visit(
                                            route(
                                                'spaces.show',
                                                websiteAppearance.homeFeaturedRoom?.name
                                            ) +
                                                `?date=${encodeURIComponent(new Date().toISOString())}`
                                        )
                                    }
                                >
                                    <ChevronsRight />
                                    More Info
                                </Badge>
                                <img
                                    src={`/storage/${websiteAppearance.homeFeaturedRoom?.image?.name}`}
                                    alt={websiteAppearance.homeFeaturedRoom?.name}
                                    className="mt-3 h-[220px] w-full rounded-2xl border-0 object-cover shadow-lg"
                                />
                            </div>
                            <p className="mt-3">{websiteAppearance.homeFeaturedDescription}</p>
                        </div>
                        <div className="bg-makeshift-black px-4 pt-6 pb-4 text-white md:col-span-1">
                            <h2 className="text-makeshift-header text-2xl">
                                {websiteAppearance.homeWhoTitle}
                            </h2>
                            <div className="mt-3">
                                <RichText html={websiteAppearance.homeWhoDescription ?? ''} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 w-full max-w-7xl m-auto">
                    <div className="px-4 py-6 md:col-span-1">
                        <h2 className="text-makeshift-header text-2xl">
                            {websiteAppearance.homeYoutubeText}
                        </h2>
                        <Card className="mt-3 w-full overflow-hidden rounded-2xl p-0 shadow-lg">
                            <CardContent className="p-0">
                                <iframe
                                    src={`https://www.youtube.com/embed/${websiteAppearance.homeYoutubeLink}?rel=0&modestbranding=1&showinfo=0&controls=0`}
                                    title="Youtube"
                                    className="h-[220px] w-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                ></iframe>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="px-4 pt-6 pb-4 md:col-span-1">
                        <h2 className="text-makeshift-header text-2xl">More Spaces</h2>
                        <Carousel
                            opts={{
                                align: 'start',
                                loop: true,
                            }}
                            plugins={[Autoplay({ delay: 3000 })]}
                            orientation="horizontal"
                            className="mt-3 w-full"
                        >
                            <CarouselContent className="-mt-1">
                                {roomSlider.map((room) => (
                                    <CarouselItem
                                        key={room.id}
                                        className="relative pt-1 md:basis-1/2"
                                    >
                                        <Badge
                                            variant="secondary"
                                            className="absolute top-0 right-0 mt-4 mr-3 animate-pulse cursor-pointer"
                                            onClick={() =>
                                                router.visit(
                                                    route('spaces.show', room.name) +
                                                        `?date=${encodeURIComponent(new Date().toISOString())}`
                                                )
                                            }
                                        >
                                            <ChevronsRight />
                                            More Info
                                        </Badge>
                                        <img
                                            src={`/storage/${room.image?.name}`}
                                            alt={room.image?.caption || room.image?.name}
                                            className="h-[220px] w-full rounded-2xl object-cover"
                                        />
                                        <div className="mx-3">
                                            <h2 className="text-md mt-3 font-bold">
                                                {room.name}
                                                <span className="right-0 float-right text-sm font-normal">
                                                    {room.discount && !room.discount.upcoming && (
                                                        <span className="text-muted-foreground mr-1 line-through">
                                                            {priceDisplay(Number(room.price))}
                                                        </span>
                                                    )}
                                                    {room.price
                                                        ? priceDisplay(
                                                              Number(
                                                                  room.discount &&
                                                                      !room.discount.upcoming
                                                                      ? room.discount
                                                                            .discounted_price
                                                                      : room.price
                                                              )
                                                          )
                                                        : ''}
                                                </span>
                                            </h2>
                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Users className="size-4" />
                                                    <div>{room.cap} pax</div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <SquareDashed className="size-4" />
                                                    <div>{room.sqm} sqm</div>
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                    </div>
                </div>
                <div className="w-full bg-makeshift-black py-3">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 max-w-7xl m-auto">
                        <div className="px-4 py-6 text-white col-span-1">
                            <h2 className="text-makeshift-header text-2xl">
                                {websiteAppearance.homeMapText}
                            </h2>
                            <Card className="mt-3 w-full overflow-hidden rounded-2xl p-0 shadow-lg">
                                <CardContent className="p-0">
                                    <iframe
                                        title="Map"
                                        src={websiteAppearance.homeMapLink}
                                        className="h-[220px] w-full border-0"
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayoutHeaderCustomer>
    );
}

function AnnouncementImage({ announcement }: { announcement: Announcement }) {
    const image = (
        <div className="relative">
            {announcement.link_url && (
                <Badge
                    variant="secondary"
                    className="absolute top-0 right-0 mt-4 mr-3 animate-pulse cursor-pointer"
                >
                    <ChevronsRight />
                    More Info
                </Badge>
            )}
            <img
                src={`/storage/${announcement.image}`}
                alt="Announcement"
                className="h-[280px] w-full rounded-2xl object-cover shadow-lg md:h-[360px]"
            />
        </div>
    );

    if (announcement.link_url) {
        return (
            <a href={announcement.link_url} target="_blank" rel="noopener noreferrer">
                {image}
            </a>
        );
    }

    return image;
}
