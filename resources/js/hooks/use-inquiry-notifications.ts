import { notificationStatus, requestDesktopPermission } from '@/lib/desktop-notifications';
import { setTabBadge } from '@/lib/tab-badge';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useEffect } from 'react';
import { toast } from 'sonner';

type InquirySummary = {
    id: number;
    booking_id: string;
    customer_name: string;
    room: string | null;
    start_date: string;
    created_at: string;
};

type InquiryPoll = { unseen_count: number; latest: InquirySummary[] };

const POLL_MS = 30_000;
// Highest booking id already announced. In localStorage (not memory) because the
// admin layout remounts on every Inertia navigation, and so that several open
// MakeShift tabs announce each inquiry once rather than once per tab.
const LAST_NOTIFIED_KEY = 'makeshift.inquiries.lastNotifiedId';
const PROMPT_DISMISSED_KEY = 'makeshift.notifications.promptDismissed';

function readNumber(key: string): number | null {
    try {
        const raw = localStorage.getItem(key);
        return raw === null ? null : Number(raw);
    } catch {
        return null;
    }
}

function write(key: string, value: string): void {
    try {
        localStorage.setItem(key, value);
    } catch {
        // Private mode / blocked storage: worst case an inquiry is announced twice.
    }
}

function describe(inquiry: InquirySummary): string {
    return [inquiry.room, inquiry.start_date].filter(Boolean).join(', ');
}

function alertFor(fresh: InquirySummary[]): void {
    const single = fresh.length === 1 ? fresh[0] : null;
    const title = single ? `New inquiry from ${single.customer_name}` : `${fresh.length} new inquiries`;
    const body = single ? describe(single) : 'Open Bookings to review them.';
    const url = single ? `/bookings/${single.id}` : '/bookings';

    const canNotify = notificationStatus() === 'granted';

    // "Looking at MakeShift" means this window has focus — not merely that the
    // tab is visible. visibilityState stays 'visible' when the user switches to
    // another app with the browser still on screen, which would route the alert
    // to an in-page toast nobody sees. Anywhere else → desktop notification.
    const userIsHere = document.visibilityState === 'visible' && document.hasFocus();

    // Always show the in-page toast. When the user is away it waits until they
    // return: the OS can silently drop a desktop notification (macOS notification
    // settings, Focus / Do Not Disturb) and the browser gives no reliable signal
    // that it did — without this the only trace would be the tab dot.
    const toastId = toast(title, {
        description: body,
        duration: userIsHere ? 10_000 : Infinity,
        action: { label: 'View', onClick: () => router.visit(url) },
    });

    // Away from MakeShift → also a desktop notification, the only thing that can
    // reach someone in another tab or app.
    if (!userIsHere && canNotify) {
        const notification = new Notification(title, {
            body,
            icon: '/favicon.ico',
            tag: 'makeshift-new-inquiry', // collapse bursts into one OS notification
        });
        notification.onclick = () => {
            window.focus();
            toast.dismiss(toastId); // already acted on — don't greet them with it too
            router.visit(url);
            notification.close();
        };
    }
}

function offerDesktopNotifications(): void {
    if (notificationStatus() !== 'default') return;
    if (readNumber(PROMPT_DISMISSED_KEY)) return;

    const remember = () => write(PROMPT_DISMISSED_KEY, '1');

    // Browsers only allow the permission prompt from a user gesture, so ask via a
    // button rather than on page load. Fixed id: remounts update, not duplicate.
    // Declining is safe to offer because the header bell can always turn it on.
    toast('Get notified of new inquiries?', {
        id: 'enable-desktop-notifications',
        description:
            'Show a desktop notification when an inquiry arrives, even if MakeShift is in another tab. You can change this anytime from the bell at the top of the page.',
        duration: Infinity,
        closeButton: true,
        action: {
            label: 'Enable',
            onClick: () => {
                remember();
                void requestDesktopPermission();
            },
        },
        cancel: { label: 'Not now', onClick: remember },
        onDismiss: remember,
    });
}

/**
 * Polls for inquiries that arrived since this user last opened Bookings and
 * surfaces them as a tab badge, a toast, or a desktop notification. Polling, not
 * push: the host can't keep a WebSocket server process running.
 *
 * Mounted in the admin layout only, so customers on the public site never poll.
 */
export function useInquiryNotifications(): void {
    useEffect(() => {
        let stopped = false;
        // Holder rather than a later `const`, so poll() can clear the interval
        // without depending on declaration order.
        const interval: { id?: number } = {};

        const poll = async () => {
            if (stopped) return;
            try {
                const { data } = await axios.get<InquiryPoll>('/api/notifications/inquiries');
                setTabBadge(data.unseen_count);

                const newestId = data.latest.reduce((max, i) => Math.max(max, i.id), 0);
                const lastNotified = readNumber(LAST_NOTIFIED_KEY);

                // First run in this browser: remember where we are, announce nothing.
                if (lastNotified === null) {
                    write(LAST_NOTIFIED_KEY, String(newestId));
                    return;
                }

                const fresh = data.latest.filter((i) => i.id > lastNotified);
                if (fresh.length > 0) {
                    write(LAST_NOTIFIED_KEY, String(newestId));
                    alertFor(fresh);
                }
            } catch (error) {
                // Logged out / session expired: stop quietly instead of erroring
                // every 30 seconds.
                const status = axios.isAxiosError(error) ? error.response?.status : undefined;
                if (status === 401 || status === 419) {
                    stopped = true;
                    window.clearInterval(interval.id);
                }
            }
        };

        const onVisible = () => {
            if (document.visibilityState === 'visible') void poll();
        };

        void poll();
        offerDesktopNotifications();
        interval.id = window.setInterval(poll, POLL_MS);
        document.addEventListener('visibilitychange', onVisible);
        window.addEventListener('focus', onVisible);

        return () => {
            stopped = true;
            window.clearInterval(interval.id);
            document.removeEventListener('visibilitychange', onVisible);
            window.removeEventListener('focus', onVisible);
        };
    }, []);
}
