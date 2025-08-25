import rocketAnimation from '@/assets/lottie/rocket.json';
import { Button } from '@/components/ui/button';
import AppLayoutHeaderCustomer from '@/layouts/app/app-header-layout-customer';
import { Head, router } from '@inertiajs/react';
import { Player } from '@lottiefiles/react-lottie-player';

export default function Success({ type }: { type: 'inquire' | 'booking' }) {
    return (
        <AppLayoutHeaderCustomer page="Inquire">
            <Head title={type === 'inquire' ? 'Inquiry Submitted' : 'Booking Submitted'} />
            <div className="p-4">
                {type === 'inquire' && (
                    <div className="flex flex-col items-center justify-center text-center">
                        <Player
                            autoplay
                            loop
                            src={rocketAnimation}
                            style={{ height: '300px', width: '300px' }}
                        />
                        <h1 className="text-3xl font-bold text-teal-500">Inquiry Submitted!</h1>
                        <p className="text-muted-foreground text-md">
                            Our team will reach out to you via email as soon as possible.
                        </p>
                        <Button
                            variant="makeshiftDefault"
                            size="makeshiftLg"
                            className="mt-8 mb-2"
                            onClick={() => router.visit('/spaces')}
                        >
                            Explore Spaces
                        </Button>
                        <Button variant="link" onClick={() => router.visit('/')}>
                            <span className="text-muted-foreground text-lg">Back to Home</span>
                        </Button>
                    </div>
                )}
            </div>
        </AppLayoutHeaderCustomer>
    );
}
