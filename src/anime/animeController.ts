import { default as asyncHanlder } from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { IAnime } from "./animeTypes";

const getAnimes = asyncHanlder(async (req: Request, res: Response, next: NextFunction) => {
    const pageNumber = Number(req.query.page) || 1;
    const response = await fetch(`${process.env.ANIME_API_BASE_URL}/anime?page=${pageNumber}`);
    const { data, pagination } = await response.json();

    const animeData: IAnime[] = data.map((anime: Record<string, any>) => {
        return {
            malId: anime.mal_id,
            title: anime.title_english,
            url: anime.url,
            imageUrl: anime.images.jpg.image_url,
            episodes: anime.episodes,
            synopsis: anime.synopsis,
            genres: anime.genres.map((genre: Record<string, any>) => genre.name),
        };
    });

    res.json({ pagination, animeData });
});

export { getAnimes };
