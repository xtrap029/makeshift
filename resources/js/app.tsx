import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { withBadge } from './lib/tab-badge';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    // withBadge prefixes "(n) " while there are unseen new inquiries, so the count
    // survives Inertia re-titling the page on every navigation.
    title: (title) => withBadge(`${title} - ${appName}`),
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
