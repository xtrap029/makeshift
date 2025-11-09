import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { type ReactNode } from 'react';

type FilterDialogProps = {
    title: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onApply: () => void;
    onClear: () => void;
    processing?: boolean;
    children: ReactNode;
};

export default function FilterDialog({
    title,
    open,
    onOpenChange,
    onApply,
    onClear,
    processing = false,
    children,
}: FilterDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogDescription className="flex flex-col gap-2" asChild>
                        <div>
                            <DialogTitle>{title}</DialogTitle>
                            <div className="flex flex-col gap-4 py-3">{children}</div>
                            <div className="flex justify-between">
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => onOpenChange(false)}
                                        className="cursor-pointer"
                                        disabled={processing}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="cursor-pointer"
                                        onClick={onClear}
                                        disabled={processing}
                                    >
                                        Clear All
                                    </Button>
                                </div>
                                <Button
                                    variant="default"
                                    className="cursor-pointer"
                                    disabled={processing}
                                    onClick={onApply}
                                >
                                    Apply Filters
                                </Button>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
