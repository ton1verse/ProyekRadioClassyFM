export interface Musik {
    id: number;
    judul: string;
    penyanyi: string;
    foto?: string;
    deskripsi: string;
    lirik: string;
    peringkat?: number;
    trend?: string;
    link?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
