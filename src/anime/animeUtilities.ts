import { SingleAnimeApiResponse, IAnime } from "./animeTypes";

export function transformAnimeData(anime: SingleAnimeApiResponse): IAnime {
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
