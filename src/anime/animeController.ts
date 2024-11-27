import { default as asyncHandler } from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { AnimeApiResponse, AnimeEntryApiResponse, IAnime } from "./animeTypes";
import { AppError, logError } from "../helpers/errorHelpers";

function transformAnimeData(anime: Record<string, any>): IAnime {
    return {
        malId: anime.mal_id,
        title: anime.title_english ?? anime.title,
        url: anime.url,
        imageUrl: anime.images.webp.image_url,
        episodes: anime.episodes,
        synopsis: anime.synopsis,
        genres: anime.genres.map((genre: Record<string, any>) => genre.name),
        year: anime.year,
    };
}

const getAnimes = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // used || since NaN would pass ?? operator
    const pageNumber = Number(req.query.page) || 1;
    const searchTerm = req.query.q ?? "";

    const response = await fetch(
        `${process.env.ANIME_API_BASE_URL}/anime?page=${pageNumber}&q=${searchTerm}`
    );

    if (!response.ok) {
        logError(response.status, response.statusText);
        throw new AppError("Could not retreive anime data, please try again later.", 502);
    }

    const { data, pagination } = (await response.json()) as AnimeApiResponse;

    const animeData: IAnime[] = data.map((anime: Record<string, any>) => {
        return transformAnimeData(anime);
    });

    res.json({ pagination, data: animeData });
});

const getAnime = asyncHandler(async (req: Request, res: Response) => {
    const { malId } = req.params;
    const response = await fetch(`${process.env.ANIME_API_BASE_URL}/anime/${malId}`);

    if (!response.ok) {
        logError(response.status, response.statusText);
        if (response.status === 404) {
            throw new AppError("Anime not found.", 404);
        }
        throw new AppError("Could not retreive anime data.");
    }

    const { data } = (await response.json()) as AnimeApiResponse;
    const anime: IAnime = transformAnimeData(data);

    res.json({ data: anime });
});

const getRecommendationsBasedOnAnime = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { malId } = req.params;
        const response = await fetch(
            `${process.env.ANIME_API_BASE_URL}/anime/${malId}/recommendations`
        );

        if (!response.ok) {
            logError(response.status, response.statusText);
            throw new AppError("Could not find recommendations for this anime", response.status);
        }

        const { data } = await response.json();
        const animes = data.map((anime: { entry: AnimeEntryApiResponse } & Record<string, any>) => {
            const entry: AnimeEntryApiResponse = anime.entry;
            return {
                malId: entry.mal_id,
                title: entry.title,
                url: entry.url,
                imageUrl: entry.images.webp.image_url,
            };
        });

        res.json({ data: animes });
    }
);

const getRecentlyUserRecommendedAnimes = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const pageNumber: number = Number(req.query.page) || 1;
        const response = await fetch(
            `${process.env.ANIME_API_BASE_URL}/recommendations/anime?page=${pageNumber}`
        );

        if (!response.ok) {
            logError(response.status, response.statusText);
            throw new AppError("Could not retreive recommendations, try again later.", 500);
        }

        const { data } = await response.json();

        const animes: Partial<IAnime>[] = data.reduce(
            (
                acc: Partial<IAnime>[],
                data: { entry: AnimeEntryApiResponse[] } & Record<string, any>
            ) => {
                const entries: Partial<IAnime>[] = data.entry.map(
                    (anime: AnimeEntryApiResponse) => {
                        return {
                            malId: anime.mal_id,
                            title: anime.title,
                            url: anime.url,
                            imageUrl: anime.images.webp.image_url,
                        };
                    }
                );
                return [...acc, ...entries];
            },
            []
        );

        res.json({ data: animes });
    }
);

export { getAnimes, getAnime, getRecommendationsBasedOnAnime, getRecentlyUserRecommendedAnimes };
