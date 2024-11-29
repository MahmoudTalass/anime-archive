import { HydratedDocument, isValidObjectId } from "mongoose";
import { AppError, logError } from "../helpers/errorHelpers";
import { IAnime } from "../anime/animeTypes";
import { Anime, UserAnimeEntry } from "../anime/animeModels";
import { transformAnimeData } from "./animeUtilities";

class AnimeService {
    async getAnimeFromAPI(malId: string): Promise<IAnime> {
        const response = await fetch(`${process.env.ANIME_API_BASE_URL}/anime/${malId}`);

        if (!response.ok) {
            logError(response.status, response.statusText, "getAnime");
            if (response.status === 404) {
                throw new AppError("Anime not found.", 404);
            }
            throw new AppError("Could not retreive anime data.");
        }

        const { data } = await response.json();
        const anime: IAnime = transformAnimeData(data);

        return anime;
    }

    async getAnimeFromDB(malId: string): Promise<HydratedDocument<IAnime> | null> {
        if (!isValidObjectId(malId)) {
            logError(
                400,
                `the malId [${malId}] provided is an invalid object id`,
                "getUserAnimeList"
            );
            throw new AppError("Invalid malId (anime id).", 400);
        }

        const anime: HydratedDocument<IAnime> | null = await Anime.findById(malId).exec();

        return anime;
    }

    // if the anime exists in the DB, return it, otherwise, get it from the api,
    // add that to the db for faster future retrieves, and return it
    async getAnime(malId: string): Promise<HydratedDocument<IAnime>> {
        let anime = await this.getAnimeFromDB(malId);
        if (anime === null) {
            const animeFromAPI = await this.getAnimeFromAPI(malId);
            anime = await this.addAnimeToDB(animeFromAPI);
        }

        return anime;
    }

    async addAnimeToDB(anime: IAnime): Promise<HydratedDocument<IAnime>> {
        const animeDocument = new Anime(anime);
        let addedAnime = await animeDocument.save();

        return addedAnime;
    }
}

export default new AnimeService();
