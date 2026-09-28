import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    detectOS,
    notificationStatus,
    requestDesktopPermission,
    sendTestNotification,
    subscribeToNotificationStatus,
    type NotificationStatus,
} from '@/lib/desktop-notifications';
import { Bell, BellOff, ChevronDown } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';

const STATUS_LABEL: Record<NotificationStatus, string> = {
    granted: 'On',
    default: 'Not turned on yet',
    denied: 'Blocked by your browser',
    insecure: 'Unavailable on this address',
    unsupported: 'Not supported by this browser',
};

function useNotificationStatus(): NotificationStatus {
    const [status, setStatus] = useState<NotificationStatus>(() => notificationStatus());
    useEffect(() => subscribeToNotificationStatus(() => setStatus(notificationStatus())), []);
    return status;
}

function Steps({ children }: { children: ReactNode }) {
    return <ol className="text-muted-foreground list-decimal space-y-1 pl-5 text-sm">{children}</ol>;
}

/** Un-blocking the site. Worded to work in any browser rather than naming one. */
function SiteSteps() {
    return (
        <Steps>
            <li>
                Look in the address bar. If there&apos;s a <strong>bell</strong> or notification
                icon, click it and choose <strong>Allow</strong>.
            </li>
            <li>
                Otherwise, click the icon at the left of the web address (usually a lock or a
                slider), find <strong>Notifications</strong> and change it to{' '}
                <strong>Allow</strong>. If it isn&apos;t listed, open <strong>Site settings</strong>{' '}
                from that menu.
            </li>
            <li>Reload this page.</li>
        </Steps>
    );
}

/**
 * The browser-wide switch that stops *every* site from asking. Browser-agnostic:
 * every browser's Settings page has a search box, so we send staff there rather
 * than describing one browser's menus. Only opening Settings differs by computer.
 */
function BrowserSettingsSteps() {
    return (
        <Steps>
            <li>
                Open your browser&apos;s <strong>Settings</strong>:
                <ul className="mt-1 list-disc space-y-0.5 pl-5">
                    <li>
                        <strong>On a Mac:</strong> press <kbd className="rounded border px-1">⌘</kbd>{' '}
                        + <kbd className="rounded border px-1">,</kbd> (Command and comma), or click
                        the browser&apos;s name in the menu bar and choose <strong>Settings</strong>.
                    </li>
                    <li>
                        <strong>On Windows:</strong> click the menu button at the top right of the
                        browser (<strong>⋮</strong>, <strong>⋯</strong> or <strong>☰</strong>) and
                        choose <strong>Settings</strong>.
                    </li>
                </ul>
            </li>
            <li>
                In the search box at the top of Settings, type <strong>notifications</strong>. No
                search box? Look for a <strong>Websites</strong>, <strong>Privacy</strong> or{' '}
                <strong>Site permissions</strong> section instead.
            </li>
            <li>
                Open the <strong>Notifications</strong> setting and make sure sites are{' '}
                <strong>allowed to ask</strong> to send notifications — it shouldn&apos;t be set to
                block all sites.
            </li>
            <li>
                If this website is listed as <strong>not allowed</strong> or{' '}
                <strong>blocked</strong>, change it to <strong>Allow</strong> (or remove it from
                that list).
            </li>
            <li>
                Come back, reload this page, and click <strong>Turn on</strong> again.
            </li>
        </Steps>
    );
}

function MacSteps() {
    return (
        <Steps>
            <li>
                Open <strong>System Settings → Notifications</strong>.
            </li>
            <li>
                Find the browser you&apos;re using in the list and turn on{' '}
                <strong>Allow notifications</strong>.
            </li>
            <li>
                Set the alert style to <strong>Banners</strong> or <strong>Alerts</strong> — not{' '}
                <em>None</em>.
            </li>
            <li>
                Turn off <strong>Focus / Do Not Disturb</strong> in Control Centre (top right of
                the screen).
            </li>
            <li>
                If your browser isn&apos;t in the list, quit and reopen it, then send a test
                notification.
            </li>
        </Steps>
    );
}

function WindowsSteps() {
    return (
        <Steps>
            <li>
                Open <strong>Settings → System → Notifications</strong>.
            </li>
            <li>
                Turn <strong>Notifications</strong> on, and make sure the browser you&apos;re using
                is switched on in the list.
            </li>
            <li>
                Turn off <strong>Do not disturb</strong> (called <strong>Focus assist</strong> on
                older versions of Windows).
            </li>
        </Steps>
    );
}

/** Where the computer can silently hide notifications even when the browser allows them. */
function ComputerSteps() {
    // Both are shown so the tips work wherever staff are; the one matching this
    // computer goes first.
    const sections = [
        { key: 'mac', title: 'On a Mac', steps: <MacSteps /> },
        { key: 'windows', title: 'On Windows', steps: <WindowsSteps /> },
    ];
    if (detectOS() === 'windows') sections.reverse();

    return (
        <div className="flex flex-col gap-3">
            {sections.map((section) => (
                <div key={section.key} className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{section.title}</p>
                    {section.steps}
                </div>
            ))}
        </div>
    );
}

function HelpSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <Collapsible>
            <CollapsibleTrigger className="group flex w-full cursor-pointer items-center justify-between rounded-lg border p-3 text-left text-sm font-medium">
                {title}
                <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-2 pt-3">{children}</CollapsibleContent>
        </Collapsible>
    );
}

/**
 * Header bell: shows whether desktop notifications for new inquiries are on, and
 * opens a dialog that turns them on or walks staff through fixing a block in the
 * browser or the operating system.
 */
export function NotificationBell() {
    const status = useNotificationStatus();
    const [open, setOpen] = useState(false);
    const [testSent, setTestSent] = useState(false);
    const [requesting, setRequesting] = useState(false);
    // Browsers stop showing their "Allow notifications?" request after it has been
    // closed a few times: the click returns at once and permission stays "default".
    // When that happens the only way through is the browser's page settings.
    const [requestUnanswered, setRequestUnanswered] = useState(false);

    const blocked = status === 'denied' || status === 'insecure' || status === 'unsupported';

    const turnOn = async () => {
        setRequesting(true);
        const result = await requestDesktopPermission();
        setRequesting(false);
        setRequestUnanswered(result === 'default');
    };

    const test = () => {
        setTestSent(sendTestNotification());
    };

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="relative cursor-pointer"
                onClick={() => {
                    setTestSent(false);
                    setRequestUnanswered(false);
                    setOpen(true);
                }}
                title={`Notifications: ${STATUS_LABEL[status]}`}
                aria-label={`Notification settings — ${STATUS_LABEL[status]}`}
            >
                {blocked ? <BellOff className="text-muted-foreground" /> : <Bell />}
                {status === 'default' && (
                    <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-amber-500" />
                )}
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Desktop notifications</DialogTitle>
                        <DialogDescription>
                            Get a notification on your computer when a new inquiry arrives, even
                            when MakeShift isn&apos;t the tab you&apos;re looking at.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <span className="text-sm font-medium">Status</span>
                        <span
                            className={
                                'text-sm font-semibold ' +
                                (status === 'granted'
                                    ? 'text-green-600'
                                    : status === 'default'
                                      ? 'text-amber-600'
                                      : 'text-destructive')
                            }
                        >
                            {STATUS_LABEL[status]}
                        </span>
                    </div>

                    {status === 'default' && (
                        <div className="flex flex-col gap-3">
                            <p className="text-sm">
                                Click below, then choose <strong>Allow</strong> when your browser
                                asks.
                            </p>
                            <Button className="cursor-pointer" onClick={turnOn} disabled={requesting}>
                                <Bell /> Turn on desktop notifications
                            </Button>
                            {requestUnanswered && (
                                <div className="flex flex-col gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
                                    <p className="text-sm">
                                        Your browser didn&apos;t show its request, or it was closed.
                                        Allow notifications for this page yourself:
                                    </p>
                                    <SiteSteps />
                                    <p className="text-sm">
                                        Still no luck? Your browser may be set to block every site
                                        — see <em>Check your browser&apos;s settings</em> below.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {status === 'granted' && (
                        <div className="flex flex-col gap-3">
                            <p className="text-sm">
                                Your browser allows them. Send a test to check your computer shows
                                them too.
                            </p>
                            <Button variant="outline" className="cursor-pointer" onClick={test}>
                                Send test notification
                            </Button>
                            {testSent && (
                                <p className="text-muted-foreground text-sm">
                                    Sent. <strong>Didn&apos;t see it?</strong> Your computer is
                                    hiding it — follow the steps under{' '}
                                    <em>Check your computer&apos;s settings</em> below.
                                </p>
                            )}
                        </div>
                    )}

                    {status === 'denied' && (
                        <div className="flex flex-col gap-2">
                            <p className="text-sm">
                                Your browser is blocking notifications for this site, and it
                                won&apos;t let MakeShift ask again. Allow them yourself:
                            </p>
                            <SiteSteps />
                        </div>
                    )}

                    {status === 'insecure' && (
                        <p className="text-sm">
                            Browsers only allow desktop notifications on a secure address
                            (starting with <strong>https://</strong>). This page is on{' '}
                            <strong>{window.location.origin}</strong>. Ask whoever manages the
                            website to serve it over https.
                        </p>
                    )}

                    {status === 'unsupported' && (
                        <p className="text-sm">
                            This browser can&apos;t show desktop notifications. Try an up-to-date
                            browser on a computer.
                        </p>
                    )}

                    {(status === 'default' || status === 'granted' || status === 'denied') && (
                        // Always readable, whatever the current status — a help section that
                        // hides itself once notifications are on can't be found when needed.
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-semibold">Troubleshooting</p>

                            {/* Already shown in full above when blocked or unanswered. */}
                            {status !== 'denied' && !requestUnanswered && (
                                <HelpSection title="Allow notifications for this page">
                                    <p className="text-muted-foreground text-sm">
                                        Use this if notifications get blocked for MakeShift, or the{' '}
                                        <strong>Turn on</strong> button doesn&apos;t show a request:
                                    </p>
                                    <SiteSteps />
                                </HelpSection>
                            )}

                            <HelpSection title="Check your browser's settings">
                                <p className="text-muted-foreground text-sm">
                                    Browsers have a setting that stops every website from asking to
                                    send notifications. If it&apos;s on, MakeShift can&apos;t ask
                                    either:
                                </p>
                                <BrowserSettingsSteps />
                            </HelpSection>

                            <HelpSection title="Check your computer's settings">
                                <p className="text-muted-foreground text-sm">
                                    Even when the browser allows notifications, your computer can
                                    hide them:
                                </p>
                                <ComputerSteps />
                            </HelpSection>
                        </div>
                    )}

                    <p className="text-muted-foreground border-t pt-3 text-xs">
                        The red dot on the tab and the pop-up messages inside MakeShift work either
                        way.
                    </p>
                </DialogContent>
            </Dialog>
        </>
    );
}
