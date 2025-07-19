export const bookingStatus = [
    {
        label: 'Draft',
        badgeClass: 'text-white bg-gray-500',
    },
    {
        label: 'Pending',
        badgeClass: 'text-white bg-yellow-500',
    },
    {
        label: 'Confirmed',
        badgeClass: 'text-white bg-green-500',
    },
    {
        label: 'Cancelled',
        badgeClass: 'text-white bg-red-500',
    },
    {
        label: 'Expired',
        badgeClass: 'text-white bg-red-500',
    },
] as const;
