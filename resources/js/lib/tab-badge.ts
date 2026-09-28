/**
 * Facebook-style "you have new inquiries" signal on the browser tab: a red dot
 * drawn over the favicon, plus a "(3) " prefix in the page title.
 *
 * Module-level state, because the title callback in app.tsx runs outside React
 * and Inertia re-titles the page on every navigation.
 */

const FAVICON_URL = '/favicon.ico';
const BADGE_LINK_ID = 'makeshift-badge-favicon';
const COUNT_PREFIX = /^\(\d+\+?\)\s/;

let count = 0;
let baseIcon: HTMLImageElement | null = null;
let baseIconFailed = false;

/** Prefix used by the Inertia title callback so the count survives navigation. */
export function withBadge(title: string): string {
    return count > 0 ? `(${count > 99 ? '99+' : count}) ${title}` : title;
}

/** Re-apply the prefix to the current title without waiting for a navigation. */
function refreshTitle(): void {
    document.title = withBadge(document.title.replace(COUNT_PREFIX, ''));
}

function faviconLink(): HTMLLinkElement {
    let link = document.getElementById(BADGE_LINK_ID) as HTMLLinkElement | null;
    if (!link) {
        // The blade has no <link rel="icon"> (browsers fetch /favicon.ico
        // implicitly), so this becomes the one the browser uses.
        link = document.createElement('link');
        link.id = BADGE_LINK_ID;
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    return link;
}

function loadBaseIcon(): Promise<HTMLImageElement | null> {
    if (baseIcon || baseIconFailed) return Promise.resolve(baseIcon);

    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            baseIcon = img;
            resolve(img);
        };
        // Admins can upload .ico/.png/.jpg; if it won't decode, fall back to a
        // bare dot rather than showing nothing.
        img.onerror = () => {
            baseIconFailed = true;
            resolve(null);
        };
        img.src = FAVICON_URL;
    });
}

async function drawBadgedFavicon(): Promise<void> {
    const size = 32;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const icon = await loadBaseIcon();
    if (icon) ctx.drawImage(icon, 0, 0, size, size);

    // Red dot, top-right, with a white ring so it reads on any favicon colour.
    const r = 8;
    const cx = size - r - 1;
    const cy = r + 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 1.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();

    faviconLink().href = canvas.toDataURL('image/png');
}

/** Show or clear the tab badge for the given number of unseen inquiries. */
export function setTabBadge(next: number): void {
    const changed = next !== count;
    count = Math.max(0, next);

    refreshTitle();

    if (!changed) return;

    if (count > 0) {
        void drawBadgedFavicon();
    } else {
        faviconLink().href = FAVICON_URL;
    }
}
