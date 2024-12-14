import { NextFunction, Request, Response } from "express";
import { validationResult, body, query, param } from "express-validator";
import { AppError } from "../helpers/errorHelpers";

const validationHandlerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessage = errors
      .array()
      .map((err) => err.msg)
      .join(", ");
    next(new AppError(errorMessage, 400));
    return;
  }
  next();
};

const getUserAnimeEntriesValidation = [
  query("page")
    .optional()
    .isInt()
    .withMessage("Page number must be an integer")
    .customSanitizer((value: string) => (Number(value) <= 0 ? 1 : value)),
  query("q")
    .optional()
    .isLength({ max: 200 })
    .withMessage("search term / query must not exceed 200 characters"),
  validationHandlerMiddleware,
];

const addAnimeToUserListValidation = [
  body("malId")
    .notEmpty()
    .withMessage("Must provide malId of the anime")
    .isInt()
    .withMessage("malId's must be integer values"),
  validationHandlerMiddleware,
];

const updateUserAnimeEntryValidation = [
  param("malId")
    .notEmpty()
    .withMessage("Must provide malId of the anime as a parameter")
    .isInt()
    .withMessage("malId's must be integer values"),
  body("status")
    .optional()
    .isIn(["watching", "completed", "planning to watch"])
    .withMessage(
      "Status can only be one of the following ['watching', 'completed', 'planning to watch']"
    ),
  body("finishedDate")
    .optional()
    .isDate()
    .withMessage("finishedDate must be a date string"),
  body("startedDate")
    .optional()
    .isDate()
    .withMessage("startedDate must be a date string"),
  body("notes")
    .optional()
    .isLength({ min: 0, max: 400 })
    .withMessage("Notes must be 0-400 characters long"),
  body("score")
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage("Score must be an integer in the range 1-10"),
  validationHandlerMiddleware,
];

const deleteUserAnimeEntryValidation = [
  param("malId")
    .notEmpty()
    .withMessage("Must provide malId of the anime as a parameter")
    .isInt()
    .withMessage("malId's must be integer values"),
  validationHandlerMiddleware,
];

export {
  updateUserAnimeEntryValidation,
  addAnimeToUserListValidation,
  getUserAnimeEntriesValidation,
  deleteUserAnimeEntryValidation,
};
