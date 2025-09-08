import { PageProps as InertiaPageProps } from '@inertiajs/core';

declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps {
        websiteSettings: {
            siteDescription: string | null;
        };
    }
}
