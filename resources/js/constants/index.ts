export const bookingStatus = [
    {
        id: 1,
        label: 'Inquiry',
        badgeClass: 'text-white bg-gray-500',
        calendarClass: 'bg-gray-500',
        calendarTextClass: '!bg-gray-100 !border-gray-700 !text-gray-700',
    },
    {
        id: 2,
        label: 'Pending',
        badgeClass: 'text-white bg-yellow-500',
        calendarClass: '!bg-yellow-100 !border-yellow-700 !text-yellow-700',
    },
    {
        id: 3,
        label: 'Confirmed',
        badgeClass: 'text-white bg-green-500',
        calendarClass: '!bg-emerald-100 !border-emarald-700 !text-emerald-700',
    },
    {
        id: 4,
        label: 'Canceled',
        badgeClass: 'text-white bg-red-500',
        calendarClass: '!bg-rose-100 !border-rose-700 !text-rose-700',
    },
] as const;

export const paymentStatus = [
    {
        id: 1,
        label: 'Pending',
        badgeClass: 'text-white bg-yellow-500',
    },
    {
        id: 2,
        label: 'Paid',
        badgeClass: 'text-white bg-green-500',
    },
    {
        id: 3,
        label: 'Failed',
        badgeClass: 'text-white bg-red-500',
    },
    {
        id: 4,
        label: 'Expired',
        badgeClass: 'text-white bg-red-500',
    },
    {
        id: 5,
        label: 'Canceled',
        badgeClass: 'text-white bg-red-500',
    },
    {
        id: 6,
        label: 'Refunded',
        badgeClass: 'text-white bg-red-500',
    },
] as const;
