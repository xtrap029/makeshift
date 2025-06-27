export interface UserForm {
    name: string;
    email?: string;
    password: string;
    password_confirmation: string;
}

export interface AmenityForm {
    id: number;
    icon: string;
    name: string;
    description: string;
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
    amenities: number[];
    image: File | null;
}
