import { HydratedDocument, isValidObjectId } from "mongoose";
import { User } from "../user/userModel";
import { AppError, logError } from "../helpers/errorHelpers";
import { IUser } from "./userTypes";
import { AnimeWatchStatus, IUserAnimeEntry } from "../anime/animeTypes";
import { UserAnimeEntry } from "../anime/animeModels";

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

        let dbQuery: Record<string, any> = { _id: userId };
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

    async getTotalAnimes(status?: AnimeWatchStatus): Promise<number> {
        return await UserAnimeEntry.countDocuments({ status });
    }

    async addAnimeToList() {}
}

export default new UserService();
