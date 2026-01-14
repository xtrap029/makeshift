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
    login_at: string | null;
    [key: string]: unknown; // This allows for additional properties...
}

export interface RoomImage {
    id: number;
    name: string;
    caption: string;
    order: number;
    is_main: boolean;
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
    schedule: Schedule | null;
    amenities: Amenity[];
    layouts: Layout[];
    overrides: ScheduleOverride[];
    image: RoomImage | null;
    images: RoomImage[];
    bookings: Booking[];
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

export interface Layout {
    id: number;
    name: string;
    description: string;
    created_at?: string;
    updated_at?: string;
    owner_id?: number;
    updated_id?: number;
}

export interface Schedule {
    id: number;
    name: string;
    is_active: boolean;
    max_day: number;
    max_date: string;
    sun_start: string;
    sun_end: string;
    mon_start: string;
    mon_end: string;
    tue_start: string;
    tue_end: string;
    wed_start: string;
    wed_end: string;
    thu_start: string;
    thu_end: string;
    fri_start: string;
    fri_end: string;
    sat_start: string;
    sat_end: string;
    created_at?: string;
    updated_at?: string;
    owner_id?: number;
    updated_id?: number;
}

export interface ScheduleOverride {
    id: number;
    note: string;
    date: string;
    time_start: string;
    time_end: string;
    is_open: boolean;
    rooms: Room[];
    created_at?: string;
    updated_at?: string;
    owner_id?: number;
    updated_id?: number;
}

export interface PaymentProvider {
    id: number;
    name: string;
    description: string;
    is_manual: boolean;
    is_active: boolean;
    is_default: boolean;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
    owner_id?: number;
    updated_id?: number;
}

export interface Booking {
    id: number;
    booking_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    room: Room;
    layout: Layout;
    payments: Payment[];
    total_paid: number;
    total_hours: number;
    total_price: number;
    note: string;
    qty: number;
    start_date: string;
    start_time: string;
    end_time: string;
    status: number;
    cancel_reason: string | null;
    expires_at: string;
    voucher_code: string;
    voucher_sent_at: string | null;
    created_at?: string;
    created_at_formatted?: string;
    updated_at?: string;
    deleted_at?: string | null;
    owner_id?: number;
    updated_id?: number;
    owner?: User;
    updater?: User;
}

export interface Payment {
    id: number;
    booking: Booking;
    payment_provider: PaymentProvider;
    note: string;
    status: number;
    reference_number: string;
    pr_no: string;
    amount: number;
    amount_paid: number;
    paid_at: string | null;
    raw_response: Record<string, unknown> | null;
    attachment: string | null;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
    owner_id?: number;
    updated_id?: number;
    owner?: User;
    updater?: User;
}

export interface MailLog {
    id: number;
    to: string;
    subject: string;
    status: boolean;
    error_message: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface Audit {
    id: number;
    auditable_type: string;
    auditable_id: number;
    user_id: number | null;
    event: string;
    old_values: Record<string, unknown> | null;
    new_values: Record<string, unknown> | null;
    created_at?: string;
    updated_at?: string;
    user?: User;
}
