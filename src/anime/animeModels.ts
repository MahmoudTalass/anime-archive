import mongoose, { Schema } from "mongoose";
import { IAnime, IUserAnimeEntry } from "./animeTypes";

const animeSchema: Schema = new Schema<IAnime>({
    malId: { type: Schema.Types.Number, required: true, unique: true, index: true },
    title: { type: Schema.Types.String, required: true, index: true },
    imageUrl: { type: Schema.Types.String },
    episodes: { type: Schema.Types.Number },
    synopsis: { type: Schema.Types.String },
    url: { type: Schema.Types.String, required: true },
    genres: [Schema.Types.String],
});

const userAnimeEntrySchema: Schema = new Schema<IUserAnimeEntry>(
    {
        malId: { type: Schema.Types.Number, index: true },
        status: {
            type: String,
            enum: ["completed", "watching", "planning to watch"],
            default: "watching",
            required: true,
        },
        finishedDate: { type: Schema.Types.Date, default: null },
        startedDate: { type: Schema.Types.Date, default: null },
        notes: { type: Schema.Types.String, default: "" },
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        score: { type: Schema.Types.Number, default: null },
    },
    { timestamps: true }
);

export const UserAnimeEntry = mongoose.model<IUserAnimeEntry>(
    "UserAnimeEntry",
    userAnimeEntrySchema
);
export const Anime = mongoose.model<IAnime>("Anime", animeSchema);
