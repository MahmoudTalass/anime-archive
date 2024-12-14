import { NextFunction, Request, RequestHandler, Response } from "express";
import asyncHandler from "express-async-handler";
import authService from "./authService";
import {
  unauthenticated,
  validateLogin,
  validateRegister,
} from "./authMiddleware";
import { IUser } from "../user/userTypes";
import { HydratedDocument } from "mongoose";
import { ValidationChain } from "express-validator";

const registerUser: RequestHandler[] = [
  unauthenticated,
  ...validateRegister,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;

    const user: HydratedDocument<IUser> = await authService.registerUser(
      username,
      email,
      password
    );

    const token = authService.createJwt(user.id, user.username);

    res.json({ data: { token, user: { id: user.id, username, email } } });
  }),
];
const loginUser: RequestHandler[] = [
  unauthenticated,
  ...validateLogin,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const { token, user } = await authService.loginUser(email, password);
    res.json({
      data: {
        token,
        user: { id: user.id, username: user.username, email: user.email },
      },
    });
  }),
];

export { registerUser, loginUser };
