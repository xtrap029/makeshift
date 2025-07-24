export const bookingStatus = [
    {
        id: 1,
        label: 'Draft',
        badgeClass: 'text-white bg-gray-500',
    },
    {
        id: 2,
        label: 'Pending',
        badgeClass: 'text-white bg-yellow-500',
    },
    {
        id: 3,
        label: 'Confirmed',
        badgeClass: 'text-white bg-green-500',
    },
    {
        id: 4,
        label: 'Cancelled',
        badgeClass: 'text-white bg-red-500',
    },
    {
        id: 5,
        label: 'Expired',
        badgeClass: 'text-white bg-red-500',
    },
] as const;
