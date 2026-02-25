import { SidebarInset } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface AppContentCustomerProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
    fullWidth?: boolean;
}

export function AppContentCustomer({
    variant = 'header',
    children,
    fullWidth = false,
    ...props
}: AppContentCustomerProps) {
    if (variant === 'sidebar') {
        return <SidebarInset {...props}>{children}</SidebarInset>;
    }

    return (
        <main
            className={cn("mx-auto flex h-full w-full flex-1 flex-col gap-4 rounded-xl px-4 pb-20", {
                "max-w-7xl": !fullWidth,
            })}
            {...props}
        >
            {children}
        </main>
    );
}
