import { Router } from "express";

const router: Router = Router();

/**
 * View animes of certain status
 * GET: /api/animes/animelist?status=status&page=pageNumber (1 if page number isn't provided)
 */
/**
 * view all the animes the user has added.
 * GET: /api/animes/animelist?page=pageNumber (1 if not provided)
 */
router.get("/animes");

/**
 * search for an anime with a name from the user list
 * GET: /api/animes/animelist?search=searchterm&page=pageNumber (1 if not provided)
 */
router.get("/animes/:malId");

/**
 * Add an anime to the user's list. (MUST PICK STATUS, EG. completed, watching, plan-to-watch)
 * POST: /api/animes/:id/
 * body will include the status and
 * optionally, notes, rating, current episodes watched start date, finished date.
 */
router.post("/animes");

/**
 * Remove an anime entry from the user's animes
 */
router.delete("/animes/:malId");
