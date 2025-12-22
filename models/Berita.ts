export interface NewsCategory {
    id: number;
    nama: string;
    createdAt?: string | Date;
}

export interface Berita {
    id: number;
    categoryId: number;
    judul: string;
    isi: string;
    gambar?: string;
    link: string;
    penulis: string;
    category?: NewsCategory;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
