export interface Classier {
    id: number;
    nama: string;
    motto: string;
    deskripsi?: string;
    foto?: string;
    status: 'active' | 'inactive';
    honor_per_jam: number;
    instagram?: string;
    facebook?: string;
    twitter?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
