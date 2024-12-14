import { User } from "../user/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userService from "../user/userService";
import { HydratedDocument } from "mongoose";
import { IUser } from "../user/userTypes";
import { AppError, logError } from "../helpers/errorHelpers";

class AuthService {
  async registerUser(username: string, email: string, password: string) {
    const user: HydratedDocument<IUser> | null = await User.findOne({
      $or: [{ username: username }, { email: email }],
    }).exec();

    if (user) {
      if (user.email === email) {
        logError(
          400,
          `user with the email ${email} already exists in the database`,
          "registerUser"
        );
        throw new AppError("A user with this email already exists.", 400);
      } else if (user.username === username) {
        logError(
          400,
          `user with the username ${username} already exists in the database`,
          "registerUser"
        );

        throw new AppError("Usernames must be unique.", 400);
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });

    const addedUser = await newUser.save();

    return addedUser;
  }
  createJwt(userId: string, username: string) {
    const token = jwt.sign(
      { sub: userId, username },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "10 days",
      }
    );
    return token;
  }

  async loginUser(
    email: string,
    password: string
  ): Promise<{ token: string; user: HydratedDocument<IUser> }> {
    const user: HydratedDocument<IUser> | null = await userService.getUser(
      email,
      "email"
    );

    if (user === null) {
      logError(
        400,
        `user with the email ${email} does not exist in the database`,
        "checkUserLogin"
      );
      throw new AppError("Incorrect email.", 400);
    }

    const comparePasswords = bcrypt.compareSync(password, user.password);

    if (!comparePasswords) {
      logError(
        400,
        `user with the email ${email} attempted to login with an incorrect password`,
        "checkUserLogin"
      );
    }

    return { token: this.createJwt(user._id.toString(), user.username), user };
  }
}

export default new AuthService();
