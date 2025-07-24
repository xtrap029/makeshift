export interface UserForm {
    name: string;
    email?: string;
    password: string;
    password_confirmation: string;
}

export interface RoomForm {
    id: number;
    name: string;
    price: number;
    is_active: boolean;
    description: string;
    is_private: boolean;
    sqm: number;
    qty: number;
    cap: number;
    schedule_id: number;
    amenities: number[];
    layouts: number[];
    image: File | null;
    image_name: string | null;
}

export interface AmenityForm {
    id: number;
    icon: string;
    name: string;
    description: string;
}

export interface LayoutForm {
    id: number;
    name: string;
    description: string;
}

export interface ScheduleForm {
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
}

export interface ScheduleOverrideForm {
    id: number;
    date: string;
    time_start: string;
    time_end: string;
    is_open: boolean;
    note: string;
    rooms: number[];
}

export interface PaymentProviderForm {
    id: number;
    name: string;
    description: string;
    is_manual: boolean;
    is_active: boolean;
    is_default: boolean;
}

export interface BookingForm {
    id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    room_id: number;
    layout_id: number;
    note: string;
    qty: number;
    start_date: string;
    start_time: string;
    end_time: string;
    status: number;
    expires_at: string;
}
