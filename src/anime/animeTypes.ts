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

export type AnimeWatchStatus = "completed" | "watching" | "planning to watch";

export interface IUserAnimeEntry {
  malId: number;
  status: AnimeWatchStatus;
  startedDate?: Date;
  finishedDate?: Date;
  notes?: string;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  score?: number;
}

export interface PaginationResponse {
  perPage: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface APIPaginationResponse {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

// represents two top-level properties in the json response from the jikan api when
// animes are requested
export interface AnimesApiResponse {
  data: SingleAnimeApiResponse[];
  pagination: APIPaginationResponse;
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

// represents the properties used from a single anime's information thats
// retrieved from the jikan api
export interface SingleAnimeApiResponse extends AnimeEntryApiResponse {
  title_english: string;
  episodes: number;
  synopsis: string;
  aired: {
    prop: {
      from: {
        year: number;
      };
    };
  };
  genres: {
    name: string;
  }[];
  [key: string]: any;
}
