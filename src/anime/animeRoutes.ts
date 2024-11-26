/** 
    get all animes on a certain page (get page 1 if page is not specified) and 
    limit will be set programmatically.
    GET: /api/animes?page=page
*/

/**
 *  get a certain anime info
 *  GET: /api/anime/:id
 */

/**
 * search for an anime from all available animes
 * GET: /api/anime?search=searchTerm&page=pageNumber (1 if not provided)
 */

/**
 * get recommendations based on a given anime and view a page of the recommendations (1 if not provided)
 * GET: /api/anime/:id/recommendations?page=page
 */

/**
 * Add an anime to the user's list. (MUST PICK STATUS, EG. completed, watching, plan-to-watch)
 * POST: /api/anime/:id/add
 * body will include the status and
 * optionally, notes, rating, current episodes watched start date, finished date.
 */

/**
 * view all the animes the user has added.
 * GET: /api/animes/animelist?page=pageNumber (1 if not provided)
 */

/**
 * View animes of certain status
 * GET: /api/animes/animelist?status=status&page=pageNumber (1 if page number isn't provided)
 */

/**
 * search for an anime with a name from the user list
 * GET: /api/animes/animelist?search=searchterm&page=pageNumber (1 if not provided)
 */
