import { HydratedDocument, isValidObjectId } from "mongoose";
import { AppError, logError } from "../helpers/errorHelpers";
import { IAnime } from "../anime/animeTypes";
import { Anime } from "../anime/animeModels";
import { transformAnimeData } from "./animeUtilities";
import { log } from "console";
import { logger } from "../helpers/logger";

class AnimeService {
  async getAnimeFromAPI(malId: string): Promise<IAnime> {
    const response = await fetch(
      `${process.env.ANIME_API_BASE_URL}/anime/${malId}`
    );

    if (!response.ok) {
      logError(response.status, response.statusText, "getAnime");
      if (response.status === 404) {
        throw new AppError("Anime not found.", 404);
      }
      throw new AppError("Could not retreive anime data.");
    }

    const { data } = await response.json();
    const anime: IAnime = transformAnimeData(data);
    logger(`Retrieved anime with malId [${malId}] from the anime API`);

    return anime;
  }

  async getAnimeFromDB(
    malId: string
  ): Promise<HydratedDocument<IAnime> | null> {
    const anime: HydratedDocument<IAnime> | null = await Anime.findOne({
      malId,
    }).exec();
    log(`Retrieved anime with malId [${malId}] from database`);
    return anime;
  }

  // if the anime exists in the DB, return it, otherwise, get it from the api,
  // add that to the db for faster future retrieves, and return it
  async getAnime(malId: string): Promise<HydratedDocument<IAnime>> {
    let anime = await this.getAnimeFromDB(malId);
    if (anime === null) {
      logger(
        `Could not find the anime with malId [${malId}] in the database`,
        "getAnime"
      );
      const animeFromAPI = await this.getAnimeFromAPI(malId);
      anime = await this.addAnimeToDB(animeFromAPI);
    }

    return anime;
  }

  async addAnimeToDB(anime: IAnime): Promise<HydratedDocument<IAnime>> {
    const animeDocument = new Anime(anime);
    let addedAnime = await animeDocument.save();
    logger(
      `Added anime with malId [${addedAnime.malId}] to database`,
      "addAnimeToDB"
    );
    return addedAnime;
  }
}

export default new AnimeService();
