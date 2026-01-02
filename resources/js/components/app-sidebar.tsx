import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    Building,
    Calendar,
    CalendarCheck,
    CalendarSync,
    ConciergeBell,
    CreditCard,
    Database,
    LayoutGrid,
    Mail,
    Puzzle,
    User,
    Wallet,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Spaces',
        href: '',
        items: [
            {
                title: 'Rooms',
                href: '/rooms',
                icon: Building,
            },
            {
                title: 'Amenities',
                href: '/amenities',
                icon: ConciergeBell,
            },
            {
                title: 'Layouts',
                href: '/layouts',
                icon: Puzzle,
            },
        ],
    },
    {
        title: 'Availability',
        href: '',
        items: [
            {
                title: 'Schedules',
                href: '/schedules',
                icon: Calendar,
            },
            {
                title: 'Overrides',
                href: '/overrides',
                icon: CalendarSync,
            },
        ],
    },
    {
        title: 'Transactions',
        href: '',
        items: [
            {
                title: 'Bookings',
                href: '/bookings',
                icon: CalendarCheck,
            },
            // {
            //     title: 'Booking Logs',
            //     href: '/booking-logs',
            //     icon: FileClock,
            // },
            {
                title: 'Payments',
                href: '/payments',
                icon: CreditCard,
            },
            {
                title: 'Payment Providers',
                href: '/payment-providers',
                icon: Wallet,
            },
        ],
    },
    {
        title: 'Logs',
        href: '',
        items: [
            {
                title: 'Mails',
                href: '/logs/mail',
                icon: Mail,
            },
        ],
    },
    {
        title: 'People',
        href: '',
        items: [
            {
                title: 'Users',
                href: '/users',
                icon: User,
            },
        ],
    },
    {
        title: 'Tools',
        href: '',
        items: [
            {
                title: 'Database',
                href: '/database',
                icon: Database,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" preserveState={false} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
