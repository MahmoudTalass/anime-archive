import { Types } from "mongoose";

export interface IAnime {
   malId: Number;
   title: String;
   imageUrl?: String;
   episodes: Number;
   synopsis?: String;
   url: String;
   genres: String[];
}

type AnimeWatchStatus = "completed" | "watching" | "planning to watch";

export interface IUserAnimeEntry {
   animeId: Types.ObjectId;
   status: AnimeWatchStatus;
   startedDate?: Date;
   finishedDate?: Date;
   notes?: String;
   userId: Types.ObjectId;
   createdAt: Date;
   updatedAt: Date;
   rating?: Number;
}
