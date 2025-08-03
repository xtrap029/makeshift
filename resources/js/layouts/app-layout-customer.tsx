import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
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

interface AppLayoutCustomerProps {
    children: ReactNode;
}

export default ({ children, ...props }: AppLayoutCustomerProps) => {
    const { flash } = usePage<FlashProps>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        } else if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <AppLayoutTemplate {...props}>
            <Toaster richColors position="top-right" />
            {children}
        </AppLayoutTemplate>
    );
};
