import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import AppLayoutHeaderCustomer from '@/layouts/app/app-header-layout-customer';
import { Room } from '@/types';
import { WebsiteAppearanceForm } from '@/types/form';
import { priceDisplay } from '@/utils/formatters';
import { Head, router } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronsRight, SquareDashed, Users } from 'lucide-react';

export default function Index({
    websiteAppearance,
    roomSlider,
}: {
    websiteAppearance: WebsiteAppearanceForm;
    roomSlider: Room[];
}) {
    return (
        <AppLayoutHeaderCustomer page="Welcome">
            <Head title="Home" />
            <div className="flex flex-col items-center">
                <div className="grid w-full grid-cols-2 gap-10">
                    <div className="col-span-2 md:col-span-1">
                        <h2 className="text-xl">Featured Space</h2>
                        <div className="relative">
                            <Badge
                                variant="secondary"
                                className="absolute top-0 right-0 mt-4 mr-3 animate-pulse"
                                onClick={() =>
                                    router.visit(
                                        route(
                                            'spaces.show',
                                            websiteAppearance.homeFeaturedRoom?.name
                                        ) + `?date=${encodeURIComponent(new Date().toISOString())}`
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
                    <div className="col-span-2 md:col-span-2">
                        <h2 className="text-xl">{websiteAppearance.homeWhoTitle}</h2>
                        <p className="mt-3">{websiteAppearance.homeWhoDescription}</p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <h2 className="text-xl">{websiteAppearance.homeYoutubeText}</h2>
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
                    <div className="col-span-2 md:col-span-1">
                        <h2 className="text-xl">More Spaces</h2>
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
                                            className="absolute top-0 right-0 mt-4 mr-3 animate-pulse"
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
                                                    {room.price
                                                        ? priceDisplay(Number(room.price))
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
                    <div className="col-span-2 md:col-span-1">
                        <h2 className="text-xl">{websiteAppearance.homeMapText}</h2>
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
        </AppLayoutHeaderCustomer>
    );
}
