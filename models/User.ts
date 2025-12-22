export interface User {
    id: number;
    nama: string;
    username: string;
    email: string;
    password?: string;
    foto?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
