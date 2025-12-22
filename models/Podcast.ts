import { Classier } from './Classier';

export interface PodcastCategory {
    id: number;
    nama: string;
    createdAt?: string | Date;
}

export interface Podcast {
    id: number;
    classierId: number;
    categoryId: number;
    judul: string;
    deskripsi: string;
    poster?: string;
    link: string;
    durasi: number;
    classier?: Classier;
    category?: PodcastCategory;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
