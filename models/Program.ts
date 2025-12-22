import { Classier } from './Classier';

export interface Program {
    id: number;
    classierId: number;
    nama_program: string;
    deskripsi: string;
    jadwal: string | Date;
    poster?: string;
    durasi: number;
    classier?: Classier;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
