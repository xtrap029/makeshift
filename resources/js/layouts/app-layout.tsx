import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { PageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';
import { useEffect, type ReactNode } from 'react';
import { toast } from 'sonner';

interface FlashProps extends PageProps {
    flash: {
        success?: string;
        error?: string;
    };
}

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { flash } = usePage<FlashProps>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        } else if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            <Toaster richColors position="top-right" />
            {children}
        </AppLayoutTemplate>
    );
};
