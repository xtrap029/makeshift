import FilterDialog from '@/components/custom/filter-dialog';
import Header from '@/components/custom/page/header';
import Pagination from '@/components/custom/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { ucwords } from '@/lib/utils';
import { Audit, type BreadcrumbItem, User } from '@/types';
import { PaginatedData } from '@/types/pagination';
import { Head, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Eye, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

dayjs.extend(relativeTime);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Audits', href: '/logs/audit' },
];

const AUDITABLE_TYPES = [
    'Amenity',
    'Booking',
    'Layout',
    'Payment',
    'PaymentProvider',
    'Room',
    'Schedule',
    'ScheduleOverride',
    'Settings',
    'User',
];

const AUDITABLE_IGNORED_FIELDS = ['updated_at'];

const EVENT_TYPES = ['created', 'updated', 'deleted'];

const getEventBadgeClass = (event: string): string => {
    switch (event.toLowerCase()) {
        case 'created':
            return 'text-white bg-green-500';
        case 'updated':
            return 'text-white bg-blue-500';
        case 'deleted':
            return 'text-white bg-red-500';
        default:
            return 'text-white bg-gray-500';
    }
};

export default function Index({
    audits,
    users,
    filters,
}: {
    audits: PaginatedData<Audit>;
    users: User[];
    filters: {
        auditable_type: string | undefined;
        event: string | undefined;
        user_id: string | undefined;
        date_from: string | undefined;
        date_to: string | undefined;
    };
}) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterData, setFilterData] = useState<{
        auditable_type: string | undefined;
        event: string | undefined;
        user_id: string | undefined;
        date_from: string | undefined;
        date_to: string | undefined;
    }>({
        auditable_type: filters.auditable_type || undefined,
        event: filters.event || undefined,
        user_id: filters.user_id || undefined,
        date_from: filters.date_from || undefined,
        date_to: filters.date_to || undefined,
    });

    const [isAuditDialogOpen, setIsAuditDialogOpen] = useState(false);
    const [audit, setAudit] = useState<Audit | null>(null);

    const applyFilters = () => {
        router.get(route('logs.audit'), filterData, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Audits - List" />
            <div className="p-4">
                <Header title="Audits">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => setIsFilterOpen(true)}
                        >
                            <SlidersHorizontal className="size-4" />
                        </Button>
                    </div>
                </Header>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Event</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {audits.data.map((audit) => (
                            <TableRow key={audit.id}>
                                <TableCell className="pl-3">{audit.auditable_type}</TableCell>
                                <TableCell>{audit.auditable_id}</TableCell>
                                <TableCell>{audit.user?.name || '-'}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={getEventBadgeClass(audit.event)}
                                    >
                                        {ucwords(audit.event)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{dayjs(audit.created_at).fromNow()}</span>
                                        <span className="text-muted-foreground text-xs">
                                            {dayjs(audit.created_at).format(
                                                'MMM DD, YYYY at HH:mm'
                                            )}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setIsAuditDialogOpen(true);
                                            setAudit(audit);
                                        }}
                                    >
                                        <Eye className="size-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination links={audits.links} />
            </div>
            <FilterDialog
                title="Filter Audits"
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                onApply={applyFilters}
                onClear={() => {
                    setFilterData({
                        auditable_type: undefined,
                        event: undefined,
                        user_id: undefined,
                        date_from: undefined,
                        date_to: undefined,
                    });
                }}
            >
                <div className="flex flex-row gap-2">
                    <div className="flex flex-wrap gap-2">
                        <Label htmlFor="auditable_type">Auditable Type</Label>
                        <Select
                            value={filterData.auditable_type || ''}
                            onValueChange={(value) =>
                                setFilterData({ ...filterData, auditable_type: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a auditable type" />
                            </SelectTrigger>
                            <SelectContent>
                                {AUDITABLE_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Label htmlFor="event">Event Type</Label>
                        <Select
                            value={filterData.event || ''}
                            onValueChange={(value) =>
                                setFilterData({ ...filterData, event: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select an event type" />
                            </SelectTrigger>
                            <SelectContent>
                                {EVENT_TYPES.map((event) => (
                                    <SelectItem key={event} value={event}>
                                        {ucwords(event)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Label htmlFor="user_id">User</Label>
                    <Select
                        value={filterData.user_id || ''}
                        onValueChange={(value) => setFilterData({ ...filterData, user_id: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                        <SelectContent>
                            {users.map((user) => (
                                <SelectItem key={user.id} value={user.id.toString()}>
                                    {user.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-row gap-2">
                    <div className="flex flex-wrap gap-2">
                        <Label htmlFor="date_from">Date From</Label>
                        <Input
                            id="date_from"
                            type="date"
                            value={filterData.date_from || ''}
                            onChange={(e) =>
                                setFilterData({ ...filterData, date_from: e.target.value })
                            }
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Label htmlFor="date_to">Date To</Label>
                        <Input
                            id="date_to"
                            type="date"
                            value={filterData.date_to || ''}
                            onChange={(e) =>
                                setFilterData({ ...filterData, date_to: e.target.value })
                            }
                        />
                    </div>
                </div>
            </FilterDialog>
            <Dialog open={isAuditDialogOpen} onOpenChange={setIsAuditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Audit Details</DialogTitle>
                    </DialogHeader>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Field</TableHead>
                                <TableHead>Old Value</TableHead>
                                <TableHead>New Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(() => {
                                const event = audit?.event?.toLowerCase();

                                // Don't show values for deleted events
                                if (event === 'deleted') {
                                    return (
                                        <TableRow>
                                            <TableCell
                                                colSpan={3}
                                                className="text-muted-foreground text-center"
                                            >
                                                No values to display for deleted events
                                            </TableCell>
                                        </TableRow>
                                    );
                                }

                                const oldValues = audit?.old_values || {};
                                const newValues = audit?.new_values || {};

                                // For updated events, only get keys that exist in both old and new values
                                let keysToProcess: string[];
                                if (event === 'updated') {
                                    // Only show fields that exist in both old and new values
                                    const oldKeys = new Set(Object.keys(oldValues));
                                    const newKeys = new Set(Object.keys(newValues));
                                    keysToProcess = Array.from(oldKeys).filter((key) =>
                                        newKeys.has(key)
                                    );
                                } else {
                                    // For created/deleted, get all unique keys
                                    keysToProcess = Array.from(
                                        new Set([
                                            ...Object.keys(oldValues),
                                            ...Object.keys(newValues),
                                        ])
                                    );
                                }

                                // Filter out ignored fields and map to rows
                                return keysToProcess
                                    .filter((key) => !AUDITABLE_IGNORED_FIELDS.includes(key))
                                    .map((key) => {
                                        const oldValue = oldValues[key];
                                        const newValue = newValues[key];

                                        // For created events, only show if there's a new value
                                        if (event === 'created' && !newValue) {
                                            return null;
                                        }

                                        // For updated events, only show dirty fields (where values changed)
                                        if (event === 'updated') {
                                            // Normalize values for comparison (handle null, undefined, objects)
                                            const normalizedOld =
                                                oldValue === null || oldValue === undefined
                                                    ? null
                                                    : typeof oldValue === 'object'
                                                      ? JSON.stringify(oldValue)
                                                      : String(oldValue);
                                            const normalizedNew =
                                                newValue === null || newValue === undefined
                                                    ? null
                                                    : typeof newValue === 'object'
                                                      ? JSON.stringify(newValue)
                                                      : String(newValue);

                                            // Skip if values are the same (not dirty)
                                            if (normalizedOld === normalizedNew) {
                                                return null;
                                            }
                                        }

                                        return (
                                            <TableRow key={key}>
                                                <TableCell>
                                                    {ucwords(key.replace(/_/g, ' '))}
                                                </TableCell>
                                                <TableCell>
                                                    {oldValue !== null && oldValue !== undefined
                                                        ? typeof oldValue === 'object'
                                                            ? JSON.stringify(oldValue)
                                                            : String(oldValue)
                                                        : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {newValue !== null && newValue !== undefined
                                                        ? typeof newValue === 'object'
                                                            ? JSON.stringify(newValue)
                                                            : String(newValue)
                                                        : '-'}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                    .filter((row) => row !== null);
                            })()}
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
