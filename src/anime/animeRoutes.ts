import { Router } from "express";
import { getAnime, getAnimes } from "./animeController";

const router: Router = Router();

/** 
    get all animes on a certain page (get page 1 if page is not specified) and 
    limit will be set programmatically.
    GET: /api/animes?page=page
*/
/**
 * search for an anime from all available animes
 * GET: /api/animes?search=searchTerm&page=pageNumber (1 if not provided)
 */
router.get("/", getAnimes);

/**
 *  get a certain anime info
 *  GET: /api/animes/:id
 */
router.get("/:malId", getAnime);

/**
 * get recommendations based on a given anime and view a page of the recommendations (1 if not provided)
 * GET: /api/animes/:id/recommendations?page=page
 */
router.get("/:malId/recommendations");

export default router;
