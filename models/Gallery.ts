export interface Gallery {
    id: number;
    judul: string;
    deskripsi: string;
    gambar?: string;
    tanggal?: string | Date;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
