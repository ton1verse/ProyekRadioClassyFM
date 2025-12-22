export interface Event {
    id: number;
    judul: string;
    lokasi: string;
    tanggal: string | Date;
    deskripsi: string;
    poster?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
