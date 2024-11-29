import { default as asyncHandler } from "express-async-handler";
import { NextFunction, Request, RequestHandler, Response } from "express";
import userService from "./userService";
import { AnimeWatchStatus, IAnime } from "../anime/animeTypes";
import { verifyToken } from "../auth/authMiddleware";
import animeService from "../anime/animeService";
import { HydratedDocument } from "mongoose";

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

const addAnimeEntryToUserList: RequestHandler[] = [
    verifyToken,
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { malId } = req.body;

        // this retrieval checks if the anime exists and retrieves it. If it doesn't exist,
        // a 404 error is thrown
        const anime: HydratedDocument<IAnime> = await animeService.getAnime(malId);

        await userService.addAnimeEntryToUserList(anime.malId.toString(), req.user?.id as string);
        res.sendStatus(201);
    }),
];

export { getUserAnimeEntries, addAnimeEntryToUserList };
