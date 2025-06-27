import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Room {
    id: number;
    name: string;
    price: number;
    is_active: boolean;
    description: string;
    is_private: boolean;
    sqm: number;
    qty: number;
    cap: number;
    amenities: Amenity[];
    image: File | null;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
    owner_id?: number;
    updated_id?: number;
}

export interface Amenity {
    id: number;
    name: string;
    description: string;
    icon: string;
    created_at?: string;
    updated_at?: string;
    owner_id?: number;
    updated_id?: number;
}
