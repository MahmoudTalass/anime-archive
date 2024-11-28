import { HydratedDocument, isValidObjectId } from "mongoose";
import { User } from "../user/userModel";
import { AppError, logError } from "../helpers/errorHelpers";
import { IUser } from "./userTypes";

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
}

export default new UserService();
