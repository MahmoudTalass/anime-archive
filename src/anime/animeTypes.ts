import { Types } from "mongoose";

export interface IAnime {
   mal_id: Number;
   title: String;
   image_url?: String;
   episodes: Number;
   synopsis?: String;
   url: String;
   genres: String[];
}

type AnimeWatchStatus = "completed" | "watching" | "planning to watch";

export interface IUserAnimeEntry {
   anime_id: Types.ObjectId;
   status: AnimeWatchStatus;
   startedDate?: Date;
   finishedDate?: Date;
   notes: String;
   user_id: Types.ObjectId;
   createdAt: Date;
   updatedAt: Date;
}
