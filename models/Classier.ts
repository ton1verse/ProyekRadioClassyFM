export interface Classier {
    id: number;
    nama: string;
    deskripsi: string;
    foto?: string;
    status: 'active' | 'inactive';
    honor_per_jam: number;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
