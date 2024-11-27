import { Types } from "mongoose";

export interface IAnime {
    malId: number;
    title: string;
    imageUrl?: string;
    episodes: number;
    synopsis?: string;
    url: string;
    genres: string[];
    year: number;
}

type AnimeWatchStatus = "completed" | "watching" | "planning to watch";

export interface IUserAnimeEntry {
    animeId: Types.ObjectId;
    status: AnimeWatchStatus;
    startedDate?: Date;
    finishedDate?: Date;
    notes?: string;
    userId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    score?: number;
}

// represents two top-level properties in the json response from the jikan api when
// animes are requested
export interface AnimeApiResponse {
    data: Record<string, any>;
    pagination?: Record<string, any>;
}

// represents an anime entry thats in the json response from the jikan api
export interface AnimeEntryApiResponse {
    mal_id: number;
    url: string;
    images: {
        jpg: {
            image_url: string;
            small_image_url: string;
            large_image_url: string;
        };
        webp: {
            image_url: string;
            small_image_url: string;
            large_image_url: string;
        };
    };
    title: string;
}
