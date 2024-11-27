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

export interface AnimeApiResponse {
    data: Record<string, any>;
    pagination?: Record<string, any>;
}
