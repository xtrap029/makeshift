/**
 * Desktop-notification permission, and the facts the help dialog needs to tell
 * staff how to fix it. Shared by the header bell, its dialog, and the one-time
 * "Get notified?" prompt so they can never disagree about the current state.
 *
 * Note what a web page can NOT see: operating-system notification settings. If
 * macOS or Windows is hiding a browser's notifications, the browser still reports
 * permission as "granted". Only sending a real test notification reveals that.
 */

export type NotificationStatus =
    | 'unsupported' // browser has no Notification API
    | 'insecure' // plain http:// (localhost excepted) — the API is disabled
    | 'default' // never asked
    | 'granted'
    | 'denied';

export type OSName = 'mac' | 'windows' | 'other';

// Fired after we request permission. Permission changes made in the browser's own
// site settings are picked up via the Permissions API and on window focus.
const PERMISSION_EVENT = 'makeshift:notification-permission';

export function notificationStatus(): NotificationStatus {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
    if (!window.isSecureContext) return 'insecure';
    return Notification.permission;
}

/** Ask for permission. Must be called from a click — browsers ignore it otherwise. */
export async function requestDesktopPermission(): Promise<NotificationStatus> {
    if (notificationStatus() === 'default') {
        await Notification.requestPermission();
    }
    window.dispatchEvent(new Event(PERMISSION_EVENT));
    return notificationStatus();
}

/** Call `onChange` whenever the permission may have changed. Returns an unsubscribe. */
export function subscribeToNotificationStatus(onChange: () => void): () => void {
    let permissionStatus: PermissionStatus | null = null;

    window.addEventListener(PERMISSION_EVENT, onChange);
    // Staff fix a block in the browser's site settings, then come back to the tab.
    window.addEventListener('focus', onChange);

    navigator.permissions
        ?.query({ name: 'notifications' as PermissionName })
        .then((status) => {
            permissionStatus = status;
            status.addEventListener('change', onChange);
        })
        .catch(() => {
            // Safari and older browsers: focus + our own event still cover it.
        });

    return () => {
        window.removeEventListener(PERMISSION_EVENT, onChange);
        window.removeEventListener('focus', onChange);
        permissionStatus?.removeEventListener('change', onChange);
    };
}

/** Send a real desktop notification so staff can confirm the whole chain works. */
export function sendTestNotification(): boolean {
    if (notificationStatus() !== 'granted') return false;
    new Notification('Test from MakeShift', {
        body: 'If you can see this, desktop notifications are working.',
        icon: '/favicon.ico',
        tag: 'makeshift-test',
    });
    return true;
}

export function detectOS(): OSName {
    if (typeof navigator === 'undefined') return 'other';
    const ua = navigator.userAgent;
    if (ua.includes('Mac')) return 'mac';
    if (ua.includes('Win')) return 'windows';
    return 'other';
}
