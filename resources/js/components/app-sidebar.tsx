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
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Building,
    Calendar,
    CalendarCheck,
    CalendarSync,
    ConciergeBell,
    CreditCard,
    Database,
    History,
    LayoutGrid,
    Mail,
    Megaphone,
    Percent,
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
            {
                title: 'Discounts',
                href: '/discounts',
                icon: Percent,
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
            {
                title: 'Sources',
                href: '/sources',
                icon: Megaphone,
            },
        ],
    },
    {
        title: 'Logs',
        href: '',
        items: [
            {
                title: 'Audits',
                href: '/logs/audit',
                icon: History,
            },
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
    const { inquiryCount } = usePage<SharedData>().props;

    // Badge the Bookings entry with the number of open inquiries so staff can
    // see at a glance whether anything is waiting on them.
    const navItems = mainNavItems.map((group) => ({
        ...group,
        items: group.items?.map((item) =>
            item.href === '/bookings' ? { ...item, badge: inquiryCount } : item
        ),
    }));

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
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
