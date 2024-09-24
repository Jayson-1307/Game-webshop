// import { PoolConnection } from "mysql2/promise";

export type createMerchFormModel = {
    status: string;
    name: string;
    Thumbnail: File | null;
    price: number;
    images: File[];
    type: string;
    quantity: number;
};


