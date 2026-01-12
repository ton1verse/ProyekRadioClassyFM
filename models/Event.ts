import { EventCategory } from './EventCategory';

export interface Event {
    id: number;
    judul: string;
    lokasi: string;
    tanggal: string | Date;
    deskripsi: string;
    poster?: string;
    categoryId?: number;
    category?: EventCategory;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
