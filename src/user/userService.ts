import { HydratedDocument, isValidObjectId } from "mongoose";
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
        const animesPerPage = 40;

        let dbQuery: Record<string, any> = { userId };
        if (status) {
            dbQuery.status = status;
        }
        if (searchTerm) {
            dbQuery.searchTerm = searchTerm;
        }

        let animes: HydratedDocument<IUserAnimeEntry>[] = await UserAnimeEntry.find(dbQuery)
            .sort({ startedDate: "desc" })
            .skip(pageNumber * animesPerPage)
            .limit(animesPerPage)
            .exec();

        return animes;
    }

    async getTotalAnimes(userId: string, status?: AnimeWatchStatus): Promise<number> {
        const query: Record<string, any> = { userId };
        if (status) {
            query.status = status;
        }
        const total = await UserAnimeEntry.countDocuments(query);
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
        const animeExistsInUserList = await UserAnimeEntry.exists({ malId, userId });

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

        await UserAnimeEntry.updateOne({ malId, userId }, animeEntryUpdatesFiltered);
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
