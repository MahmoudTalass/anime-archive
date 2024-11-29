import { default as asyncHandler } from "express-async-handler";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { AppError, logError } from "../helpers/errorHelpers";
import userService from "./userService";
import { AnimeWatchStatus } from "../anime/animeTypes";
import { verifyToken } from "../auth/authMiddleware";

const getUserAnimeEntries: RequestHandler[] = [
    verifyToken,
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const pageNumber: number = Number(req.query.pageNumber) || 1;
        const perPage = 40;
        const searchTerm = req.query.query as string | undefined;
        const status = req.query.status as AnimeWatchStatus | undefined;

        const [documentCount, animes] = await Promise.all([
            userService.getTotalAnimes(status),
            userService.getUserAnimeEntries(
                req.user?.id as string,
                pageNumber,
                perPage,
                searchTerm,
                status
            ),
        ]);

        res.json({
            data: { animes },
            pagination: {
                perPage,
                page: pageNumber,
                total: documentCount,
                totalPages: Math.ceil(documentCount / perPage),
            },
        });
    }),
];

const addAnimeToUserList: RequestHandler[] = [
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { malId } = req.body;
    }),
];

export { getUserAnimeEntries };
