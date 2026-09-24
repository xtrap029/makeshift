import { bookingStatus, paymentStatus } from '@/constants';
import { Payment } from '@/types';

/**
 * Whether the "Set as Paid" shortcut applies. Mirrors PaymentController::setPaid(),
 * which re-checks both conditions — this only decides whether to show the button.
 */
export function canSetPaid(payment: Payment): boolean {
    const isPendingPayment =
        paymentStatus.find((status) => status.id === payment.status)?.label === 'Pending';

    const isPendingBooking =
        bookingStatus.find((status) => status.id === payment.booking?.status)?.label === 'Pending';

    return isPendingPayment && isPendingBooking;
}
