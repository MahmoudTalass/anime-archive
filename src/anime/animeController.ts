import asyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import {
  AnimesApiResponse,
  AnimeEntryApiResponse,
  IAnime,
  SingleAnimeApiResponse,
  PaginationResponse,
  APIPaginationResponse,
} from "./animeTypes";
import { AppError, logError } from "../helpers/errorHelpers";
import { transformAnimeData } from "./animeUtilities";
import animeService from "./animeService";
import { HydratedDocument } from "mongoose";

const getAnimes = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // used || since NaN would pass ?? operator
    const pageNumber = Number(req.query.page) || 1;
    const searchTerm = req.query.q ?? "";

    const response = await fetch(
      `${process.env.ANIME_API_BASE_URL}/anime?page=${pageNumber}&q=${searchTerm}`
    );

    if (!response.ok) {
      logError(response.status, response.statusText, "getAnimes");
      throw new AppError(
        "Could not retreive anime data, please try again later.",
        502
      );
    }

    const json = (await response.json()) as AnimesApiResponse;

    const paginationAPIResponse: APIPaginationResponse | undefined =
      json.pagination;

    const animeData: Partial<IAnime>[] = json.data.map(
      (anime: SingleAnimeApiResponse) => {
        const transformed = transformAnimeData(anime);
        return {
          title: transformed.title,
          imageUrl: transformed.imageUrl,
          malId: transformed.malId,
        };
      }
    );

    let paginationResponse: PaginationResponse = {
      page: paginationAPIResponse.current_page,
      perPage: paginationAPIResponse.items.per_page, // 25 be default (can only be decreased, not increased)
      total: paginationAPIResponse.items.total,
      totalPages: paginationAPIResponse.last_visible_page,
    };

    res.json({ pagination: paginationResponse, data: animeData });
  }
);

const getAnime = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { malId } = req.params;

    const anime: HydratedDocument<IAnime> = await animeService.getAnime(malId);

    res.json({ data: anime });
  }
);

const getRandomAnime = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const response = await fetch(
      `${process.env.ANIME_API_BASE_URL}/random/anime`
    );

    if (!response.ok) {
      logError(response.status, response.statusText, "getRandomAnime");
      throw new AppError("Could not retreive a random anime.");
    }

    const { data } = await response.json();
    const anime: IAnime = transformAnimeData(data);

    res.json({ data: anime });
  }
);

const getRecommendationsBasedOnAnime = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { malId } = req.params;
    const response = await fetch(
      `${process.env.ANIME_API_BASE_URL}/anime/${malId}/recommendations`
    );

    if (!response.ok) {
      logError(
        response.status,
        response.statusText,
        "getRecommendationsBasedOnAnimes"
      );
      throw new AppError(
        "Could not find recommendations for this anime",
        response.status
      );
    }

    const { data } = await response.json();
    const animes = data.map(
      (anime: { entry: AnimeEntryApiResponse } & Record<string, any>) => {
        const entry: AnimeEntryApiResponse = anime.entry;
        return {
          malId: entry.mal_id,
          title: entry.title,
          url: entry.url,
          imageUrl: entry.images.webp.image_url,
        };
      }
    );

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
      logError(
        response.status,
        response.statusText,
        "getRecentlyUserRecommendedAnimes"
      );
      throw new AppError(
        "Could not retreive recommendations, try again later.",
        500
      );
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

export {
  getAnimes,
  getAnime,
  getRecommendationsBasedOnAnime,
  getRecentlyUserRecommendedAnimes,
  getRandomAnime,
};
