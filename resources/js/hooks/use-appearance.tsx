import { router } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

const prefersDark = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Public site pages all render from components under `unauth/` (mirrors the
// `Unauth\*` controller namespace on the backend). Dark mode is an admin-only
// preference and must never leak into the customer-facing site — this is one
// SPA instance, so the `<html>` class otherwise persists across client-side
// navigation between admin and public pages.
//
// Tracked manually (not read live from Inertia) because `router` exposes no
// public "current page" accessor — this is seeded once from the SSR'd
// `data-page` payload and kept in sync via the `navigate` event.
let currentComponent = '';

const readInitialComponent = () => {
    if (typeof document === 'undefined') {
        return '';
    }

    try {
        const raw = document.getElementById('app')?.getAttribute('data-page');
        return raw ? (JSON.parse(raw).component ?? '') : '';
    } catch {
        return '';
    }
};

const isPublicPage = () => currentComponent.startsWith('unauth/');

const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const applyTheme = (appearance: Appearance) => {
    const isDark =
        !isPublicPage() && (appearance === 'dark' || (appearance === 'system' && prefersDark()));

    document.documentElement.classList.toggle('dark', isDark);
};

const mediaQuery = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.matchMedia('(prefers-color-scheme: dark)');
};

const handleSystemThemeChange = () => {
    const currentAppearance = localStorage.getItem('appearance') as Appearance;
    applyTheme(currentAppearance || 'system');
};

export function initializeTheme() {
    currentComponent = readInitialComponent();

    const savedAppearance = (localStorage.getItem('appearance') as Appearance) || 'light';

    applyTheme(savedAppearance);

    // Add the event listener for system theme changes...
    mediaQuery()?.addEventListener('change', handleSystemThemeChange);

    // Re-evaluate on every client-side navigation — this is one SPA instance,
    // so moving between an admin page and a public page never reloads the
    // document; without this the `dark` class would just stick around.
    router.on('navigate', (event) => {
        currentComponent = event.detail.page.component;

        const currentAppearance = (localStorage.getItem('appearance') as Appearance) || 'light';
        applyTheme(currentAppearance);
    });
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>('system');

    const updateAppearance = useCallback((mode: Appearance) => {
        setAppearance(mode);

        // Store in localStorage for client-side persistence...
        localStorage.setItem('appearance', mode);

        // Store in cookie for SSR...
        setCookie('appearance', mode);

        applyTheme(mode);
    }, []);

    useEffect(() => {
        const savedAppearance = localStorage.getItem('appearance') as Appearance | null;
        updateAppearance(savedAppearance || 'system');

        return () => mediaQuery()?.removeEventListener('change', handleSystemThemeChange);
    }, [updateAppearance]);

    return { appearance, updateAppearance } as const;
}
