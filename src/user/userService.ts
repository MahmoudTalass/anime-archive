import mongoose, {
  HydratedDocument,
  isValidObjectId,
  PipelineStage,
} from "mongoose";
import { User } from "../user/userModel";
import { AppError, logError } from "../helpers/errorHelpers";
import { IUser } from "./userTypes";
import { AnimeWatchStatus, IUserAnimeEntry } from "../anime/animeTypes";
import { UserAnimeEntry } from "../anime/animeModels";
import { logger } from "../helpers/logger";

class UserService {
  async getUser(
    identifierValue: string,
    identifierType: "email" | "id" | "username"
  ): Promise<HydratedDocument<IUser>> {
    if (identifierType === "id") {
      if (!isValidObjectId(identifierValue)) {
        logError(
          400,
          `the object id ${identifierValue} provided is an invalid object id`,
          "getUser"
        );
        throw new AppError("Invalid user id.", 400);
      }
    }

    const user: HydratedDocument<IUser> | null = await User.findOne({
      [identifierType]: identifierValue,
    });

    if (user === null) {
      logError(
        404,
        `user with identifier ${identifierType} ${identifierValue} was not found`,
        "getUser"
      );
      throw new AppError("User not found.", 404);
    }

    logger(
      `Retrieved user information for user with identifier type [${identifierType}] [${identifierValue}]`,
      "getUser"
    );
    return user;
  }

  async getUserAnimeEntries(
    userId: string,
    pageNumber: number,
    perPage: number,
    searchTerm?: string,
    status?: AnimeWatchStatus
  ): Promise<HydratedDocument<IUserAnimeEntry>[]> {
    if (!isValidObjectId(userId)) {
      logError(
        400,
        `the user id [${userId}] provided is an invalid object id`,
        "getUserAnimeList"
      );
      throw new AppError("Invalid user id.", 400);
    }

    pageNumber -= 1;

    let dbQuery: Record<string, any> = {
      userId: new mongoose.Types.ObjectId(userId),
    };

    if (status) {
      dbQuery.status = status;
    }

    let aggregationStages: PipelineStage[] = [
      { $match: dbQuery },
      {
        $lookup: {
          from: "animes",
          foreignField: "malId",
          localField: "malId",
          as: "animeDetails",
          // if a searchTerm was provided, perform subquery on the collection we're joining with to find the
          // title matching the searchTerm, otherwise, provide empty subquery
          pipeline: searchTerm
            ? [
                {
                  $match: {
                    title: { $regex: searchTerm, $options: "i" },
                  },
                },
              ]
            : [],
        },
      },
      {
        $unwind: {
          path: "$animeDetails",
        },
      },

      {
        $project: {
          "animeDetails.synopsis": 0,
          "animeDetails.url": 0,
          "animeDetails.episodes": 0,
        },
      },
      {
        $sort: { startedDate: -1 },
      },
      {
        $skip: perPage * pageNumber,
      },
      {
        $limit: perPage,
      },
    ];

    const animes = await UserAnimeEntry.aggregate(aggregationStages).exec();

    logger(
      `Retrieved animes from user anime entry list for user with userId ${userId}`,
      "getUserAnimeEntries"
    );

    return animes;
  }

  async getTotalAnimes(
    userId: string,
    status?: AnimeWatchStatus
  ): Promise<number> {
    const query: Record<string, any> = { userId };
    if (status) {
      query.status = status;
    }
    const total = await UserAnimeEntry.countDocuments(query);
    logger(
      `Retrieved anime entry count for user with userId [${userId}] ${
        status ? `for animes with status [${status}]` : ""
      }`,
      "getTotalAnimes"
    );
    return total;
  }

  async addAnimeEntryToUserList(malId: string, userId: string): Promise<void> {
    const anime = await UserAnimeEntry.findOne({ malId, userId });

    if (anime === null) {
      const userAnimeEntry = new UserAnimeEntry({
        malId,
        userId,
      });

      logger(
        `added anime with malId [${malId}] to list of user with user id [${userId}]`,
        "addAnimeEntryToUserList"
      );

      await userAnimeEntry.save();
      return;
    }
    logger(
      `No op. anime with malId [${malId}] alreayd exists in the list of the user with user id [${userId}]`,
      "addAnimeEntryToUserList"
    );
  }

  async updateUserAnimeEntry(
    malId: string,
    animeEntryUpdates: Partial<IUserAnimeEntry>,
    userId: string
  ): Promise<void> {
    const animeExistsInUserList = await UserAnimeEntry.exists({
      malId,
      userId,
    });

    if (!animeExistsInUserList) {
      logError(
        404,
        `anime with malId [${malId}] does not exist in the anime entries of user [${userId}]`,
        "updateUserAnimeEntry"
      );
      throw new AppError(
        "Anime with the given malId does not exist in the user's list.",
        404
      );
    }

    const animeEntryUpdatesFiltered = Object.fromEntries(
      Object.entries(animeEntryUpdates).filter(
        ([_, value]: [string, any]) => value !== undefined
      )
    );

    await UserAnimeEntry.updateOne(
      { malId, userId },
      animeEntryUpdatesFiltered
    );
    logger(
      `Updated anime entry for anime with malId [${malId}] for user with userId [${userId}]`
    );
  }

  async deleteUserAnimeEntry(malId: string, userId: string): Promise<void> {
    const res = await UserAnimeEntry.deleteOne({ malId, userId });
    if (res.deletedCount === 0) {
      logger(
        `No op. Anime entry for anime with malId [${malId}] could not be deleted from the anime entry list for user with userId [${userId}]`,
        "deleteUserAnimeEntry"
      );
    } else {
      logger(
        `anime entry for anime with malId ${malId}] was deleted from the anime entry list for user with userId [${userId}]`,
        "deleteUserAnimeEntry"
      );
    }
  }
}

export default new UserService();
