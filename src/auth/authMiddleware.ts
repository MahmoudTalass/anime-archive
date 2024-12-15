import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { AppError } from "../helpers/errorHelpers";
import {
   validationResult,
   body,
   ValidationChain,
   ValidationError,
   Result,
} from "express-validator";

function verifyToken(req: Request, res: Response, next: NextFunction) {
   const authHeader = req.headers["authorization"];

   if (authHeader) {
      const token = authHeader?.split(" ")[1];

      jwt.verify(token, process.env.JWT_SECRET as string, (err, payload) => {
         if (err) {
            let errorMessage = "";
            if (err.name === "TokenExpiredError") {
               errorMessage = "Token expired.";
            } else {
               errorMessage = "Invalid token.";
            }
            next(new AppError(errorMessage, 401));
         }

         payload = payload as JwtPayload;
         req.user = {
            id: payload.sub as string,
            username: payload.username,
         };
         next();
      });
   } else {
      next(new AppError("Authorization required.", 401));
   }
}

function unauthenticated(req: Request, res: Response, next: NextFunction) {
   const authHeader = req.headers["authorization"];
   const token = authHeader && authHeader?.split(" ")[1];

   if (token) {
      jwt.verify(token, process.env.JWT_SECRET as string, (err, payload) => {
         if (err) {
            next();
            return;
         }

         next(new AppError("You are already logged in.", 403));
         return;
      });
   }
   next();
}

const validateAuth = [
   body("email")
      .trim()
      .notEmpty()
      .withMessage("Must provide email address")
      .isLength({ max: 254 })
      .withMessage("Email address must not exceed 254 characters in length"),
   body("password")
      .trim()
      .isLength({ min: 8, max: 64 })
      .withMessage("Passwords must be 8-64 characters long"),
];

const validateRegister: (ValidationChain | RequestHandler)[] = [
   body("username")
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage("Username must contain 3-50 characters"),
   ...validateAuth,
   (req: Request, res: Response, next: NextFunction) => {
      const errors: Result<ValidationError> = validationResult(req);

      if (!errors.isEmpty()) {
         const errorMessage = errors
            .array()
            .map((err) => err.msg)
            .join(", ");
         next(new AppError(errorMessage, 400));
         return;
      }
      next();
   },
];

const validateLogin: (ValidationChain | RequestHandler)[] = [
   ...validateAuth,
   (req: Request, res: Response, next: NextFunction) => {
      const errors: Result<ValidationError> = validationResult(req);

      if (!errors.isEmpty()) {
         let errorMessage = errors
            .array()
            .map((err) => err.msg)
            .join(", ");
         next(new AppError(errorMessage));
         return;
      }
      next();
   },
];

export { unauthenticated, verifyToken, validateLogin, validateRegister };
