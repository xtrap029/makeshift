import { Countdown } from '@/components/custom';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { bookingStatus as bookingStatusConstants } from '@/constants';
import AppLayout from '@/layouts/app-layout';
import { Booking, User, type BreadcrumbItem } from '@/types';
import { PaginatedData } from '@/types/pagination';
import { Head, router } from '@inertiajs/react';
import { Scanner } from '@yudiel/react-qr-scanner';
import axios from 'axios';
import { Eye, Scan, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({
    todaysBookings,
    lastLoginUsers,
    latestBookings,
}: {
    todaysBookings: PaginatedData<Booking>;
    lastLoginUsers: User[];
    latestBookings: Booking[];
}) {
    const [voucherCode, setVoucherCode] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [verifiedBooking, setVerifiedBooking] = useState<Booking | null>(null);

    const handleClearVoucherCode = () => {
        setVoucherCode('');
        setVerifiedBooking(null);
        setIsScanning(false);
        router.visit(window.location.pathname, {
            replace: true,
            preserveScroll: true,
            preserveState: true,
        });
    };

    const renderCountdown = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start > new Date()) {
            return (
                <span className="text-md">
                    Starts in <br />
                    <b className="text-green-600">
                        <Countdown deadline={startDate} />
                    </b>
                </span>
            );
        }
        if (start < new Date() && end > new Date()) {
            return (
                <span className="text-md">
                    Ends in <br />
                    <b className="text-orange-400">
                        <Countdown deadline={endDate} />
                    </b>
                </span>
            );
        }
        if (end < new Date()) {
            return <span className="text-md">Ended</span>;
        }
        return <>N/A </>;
    };

    const handleVerifyBooking = async (voucherCode: string) => {
        try {
            setVerifiedBooking(null);
            const { data } = await axios.post('/api/bookings/verify', { voucherCode });

            if (data.verifiedBooking) {
                setVerifiedBooking(data.verifiedBooking);
            } else {
                toast.error('No confirmed booking found');
            }
        } catch (err) {
            console.error('API verify failed', err);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card className="col-span-2">
                        <CardHeader>
                            <CardTitle>Today's Bookings</CardTitle>
                            <CardDescription>List of bookings for today</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {todaysBookings.data.length === 0 && (
                                <p className="text-center text-sm">No bookings found</p>
                            )}
                            {todaysBookings.data.length > 0 && (
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Booking</TableHead>
                                            <TableHead>Room</TableHead>
                                            <TableHead>Booking</TableHead>
                                            <TableHead className="border-l pl-10">
                                                Monitor
                                            </TableHead>
                                            <TableHead>Time</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {todaysBookings.data.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center">
                                                    No bookings found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {todaysBookings.data.length > 0 &&
                                            todaysBookings.data.map((booking) => (
                                                <TableRow key={booking.id}>
                                                    <TableCell>
                                                        {booking.booking_id}
                                                        <br />
                                                        <span className="text-sm text-gray-500">
                                                            {booking.customer_name}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <a
                                                            href={`/rooms/${booking.room.id}`}
                                                            target="_blank"
                                                            className="underline"
                                                        >
                                                            {booking.room.name}
                                                        </a>
                                                        <br />
                                                        <span className="text-sm text-gray-500">
                                                            {booking.layout?.name}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="align-top">
                                                        <Badge
                                                            variant="outline"
                                                            className={
                                                                bookingStatusConstants.find(
                                                                    (status) =>
                                                                        status.id === booking.status
                                                                )?.badgeClass
                                                            }
                                                        >
                                                            {
                                                                bookingStatusConstants.find(
                                                                    (status) =>
                                                                        status.id === booking.status
                                                                )?.label
                                                            }
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="border-l pl-10">
                                                        {renderCountdown(
                                                            booking.start_date +
                                                                ' ' +
                                                                booking.start_time,
                                                            booking.start_date +
                                                                ' ' +
                                                                booking.end_time
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="align-top">
                                                        {booking.start_time.slice(0, 5)} -{' '}
                                                        {booking.end_time.slice(0, 5)}
                                                        <br />
                                                        <span className="text-sm text-gray-500">
                                                            {booking.total_hours}{' '}
                                                            {booking.total_hours === 1
                                                                ? 'hour'
                                                                : 'hours'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="flex justify-end gap-2">
                                                        <a
                                                            href={`/bookings/${booking.id}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={buttonVariants({
                                                                variant: 'ghost',
                                                            })}
                                                        >
                                                            <Eye />
                                                        </a>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Verify Booking</CardTitle>
                            <CardDescription>Scan Voucher or QR code to check-in</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <Input
                                    type="text"
                                    placeholder="Enter voucher code"
                                    value={voucherCode}
                                    disabled={verifiedBooking !== null}
                                    onChange={(e) => setVoucherCode(e.target.value)}
                                />
                                {verifiedBooking && (
                                    <p className="text-center text-xs text-green-500">
                                        Booking found: {verifiedBooking.booking_id}
                                    </p>
                                )}
                                <div className="flex gap-2">
                                    {verifiedBooking ? (
                                        <a
                                            href={`/bookings/${verifiedBooking.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1"
                                        >
                                            <Button variant="success" className="w-full">
                                                Click here to view booking
                                            </Button>
                                        </a>
                                    ) : (
                                        <Button
                                            className="flex-1"
                                            onClick={() => handleVerifyBooking(voucherCode)}
                                        >
                                            Submit
                                        </Button>
                                    )}
                                    <Button variant="outline" onClick={handleClearVoucherCode}>
                                        Clear
                                    </Button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                {isScanning && (
                                    <Scanner
                                        onScan={(result) => {
                                            setVoucherCode(result[0].rawValue);
                                            handleVerifyBooking(result[0].rawValue);
                                        }}
                                        formats={['qr_code']}
                                    />
                                )}
                                <Button
                                    variant="outline"
                                    className="h-12 rounded-full text-lg shadow-md"
                                    onClick={() => setIsScanning(!isScanning)}
                                >
                                    {isScanning ? <X /> : <Scan />}
                                    {isScanning ? 'Stop scanning' : 'Scan QR code'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card className="col-span-2">
                        <CardHeader>
                            <CardTitle>Latest Bookings</CardTitle>
                            <CardDescription>List of latest bookings</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Booking</TableHead>
                                        <TableHead>Room</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Created At</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {latestBookings.map((booking) => (
                                        <TableRow key={booking.id}>
                                            <TableCell>
                                                <a
                                                    href={`/bookings/${booking.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="underline"
                                                >
                                                    {booking.booking_id}
                                                </a>
                                            </TableCell>
                                            <TableCell>
                                                <a
                                                    href={`/rooms/${booking.room.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="underline"
                                                >
                                                    {booking.room.name}
                                                </a>
                                            </TableCell>
                                            <TableCell>{booking.start_date}</TableCell>
                                            <TableCell>
                                                {booking.start_time.slice(0, 5)} -{' '}
                                                {booking.end_time.slice(0, 5)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        bookingStatusConstants.find(
                                                            (status) => status.id === booking.status
                                                        )?.badgeClass
                                                    }
                                                >
                                                    {
                                                        bookingStatusConstants.find(
                                                            (status) => status.id === booking.status
                                                        )?.label
                                                    }
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {booking.created_at_formatted}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Last Login Users</CardTitle>
                            <CardDescription>List of users who logged in last</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="text-right">Last Login</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lastLoginUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell className="text-right">
                                                {user.login_at}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
