import { Router } from "express";
import {
    getUserAnimeEntries,
    addAnimeEntryToUserList,
    updateUserAnimeEntry,
    deleteUserAnimeEntry,
} from "./userController";

const router: Router = Router();

/**
 * View animes of certain status
 * GET: /api/animes/animelist?status=status&page=pageNumber (1 if page number isn't provided)
 */
/**
 * view all the animes the user has added or an anime with a specific name
 * GET: /api/animes/animelist?page=pageNumber&q=animeName&status=animeStatus (1 if not provided)
 */
router.get("/animes", getUserAnimeEntries);

/**
 * Add an anime to the user's list. It is added to the watching list and the user can then make 
    change the status, add notes, start date, etc
 * POST: /api/animes/
 */
router.post("/animes", addAnimeEntryToUserList);

/**
 * allow the user to make changes to an anime they have in their list
 *
 * adding notes, adding a start date, adding a finished date, etc
 */
router.put("/animes/:malId", updateUserAnimeEntry);

/**
 * Delete user anime entry
 */
router.delete("/animes/:malId", deleteUserAnimeEntry);

export default router;
