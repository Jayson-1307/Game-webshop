// import { PoolConnection } from "mysql2/promise";

export type createGameFormModel = {
    tags: string;
    status: string;
    gameTitle: string;
    Thumbnail: File | null;
    Description: string;
    price: number;
    images: File[];
    url: string;
    authors: string;
};
