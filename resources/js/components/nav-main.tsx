import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarMenu>
                {items.map((item, index) => (
                    <div key={index}>
                        {item.items && (
                            <>
                                <SidebarGroupLabel className="mt-5">{item.title}</SidebarGroupLabel>
                                <SidebarMenu>
                                    {item.items.map((subItem) => (
                                        <SidebarMenuItem key={subItem.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={
                                                    subItem.href === page.url ||
                                                    (page.url.startsWith(subItem.href) &&
                                                        subItem.href !== page.url)
                                                }
                                                tooltip={{ children: subItem.title }}
                                            >
                                                <Link
                                                    href={subItem.href}
                                                    preserveState={false}
                                                    // prefetch
                                                >
                                                    {subItem.icon && <subItem.icon />}
                                                    <span>{subItem.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                            {!!subItem.badge && (
                                                <SidebarMenuBadge className="bg-primary text-primary-foreground peer-hover/menu-button:text-primary-foreground peer-data-[active=true]/menu-button:text-primary-foreground">
                                                    {subItem.badge}
                                                </SidebarMenuBadge>
                                            )}
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </>
                        )}
                        {!item.items && (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={item.href === page.url}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link
                                        href={item.href}
                                        preserveState={false}
                                        // prefetch
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                    </div>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
