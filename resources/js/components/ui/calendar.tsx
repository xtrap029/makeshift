import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    components,
    ...props
}: React.ComponentProps<typeof DayPicker>) {
    const defaultClassNames = getDefaultClassNames();

    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn('p-3', className)}
            classNames={{
                months: 'flex flex-col sm:flex-row gap-2 relative',
                month: 'flex flex-col gap-4',
                month_caption: 'flex justify-center pt-1 items-center w-full',
                caption_label: 'text-sm font-medium',
                nav: 'flex items-center justify-between absolute inset-x-0 top-0 z-10',
                button_previous: cn(
                    buttonVariants({ variant: 'outline' }),
                    'size-7 bg-transparent p-0 opacity-70 hover:opacity-100'
                ),
                button_next: cn(
                    buttonVariants({ variant: 'outline' }),
                    'size-7 bg-transparent p-0 opacity-70 hover:opacity-100'
                ),
                month_grid: 'w-full border-collapse',
                weekdays: 'flex',
                weekday: 'text-muted-foreground rounded-md w-10 font-normal text-[0.8rem]',
                week: 'flex w-full mt-1',
                day: cn(
                    'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([data-selected])]:bg-accent',
                    defaultClassNames.day
                ),
                day_button: cn(
                    'h-12 w-10 rounded-md p-0 font-normal text-foreground flex flex-col items-center justify-center gap-0.5 transition-colors',
                    'hover:bg-accent hover:text-accent-foreground'
                ),
                range_start: 'rounded-l-md',
                range_end: 'rounded-r-md',
                selected: '[&>button]:bg-primary [&>button]:text-primary-foreground',
                today: 'bg-accent rounded-md',
                outside: 'text-muted-foreground opacity-50',
                disabled: 'text-muted-foreground opacity-30 pointer-events-none',
                hidden: 'invisible',
                ...classNames,
            }}
            components={{
                Chevron: ({ orientation, ...chevronProps }) =>
                    orientation === 'left' ? (
                        <ChevronLeft className="size-4" {...chevronProps} />
                    ) : (
                        <ChevronRight className="size-4" {...chevronProps} />
                    ),
                ...components,
            }}
            {...props}
        />
    );
}

export { Calendar };
