import {
    supabase
} from "../lib/supabase";


/* =========================================================
   GAME STATUS
========================================================= */

export type GameStatus =
    | "current"
    | "regular"
    | "backlog"
    | "paused"
    | "finished";


/* =========================================================
   GAME
========================================================= */

export interface Game {

    id:
        string;

    twitch_game_id:
        string | null;

    twitch_name:
        string | null;

    box_art_url:
        string | null;

    status:
        GameStatus;

    tags:
        string[];

    description:
        string | null;

    rating:
        number | null;

    youtube_playlist:
        string | null;

    poll_enabled:
        boolean;

    created_at:
        string;

    updated_at:
        string;

}


/* =========================================================
   RAW GAME
========================================================= */

interface RawGame {

    id?:
        unknown;

    twitch_game_id?:
        unknown;

    twitch_name?:
        unknown;

    box_art_url?:
        unknown;

    status?:
        unknown;

    tags?:
        unknown;

    description?:
        unknown;

    rating?:
        unknown;

    youtube_playlist?:
        unknown;

    poll_enabled?:
        unknown;

    created_at?:
        unknown;

    updated_at?:
        unknown;

}


/* =========================================================
   GAME SELECT
========================================================= */

const GAME_SELECT = `
    id,
    twitch_game_id,
    twitch_name,
    box_art_url,
    status,
    tags,
    description,
    rating,
    youtube_playlist,
    poll_enabled,
    created_at,
    updated_at
`;


/* =========================================================
   NORMALIZE STRING
========================================================= */

function normalizeString(
    value:
        unknown
): string | null {

    if (
        value === null
        ||
        value === undefined
    ) {

        return null;

    }


    const text =
        String(
            value
        )
            .trim();


    return (
        text
        ||
        null
    );

}


/* =========================================================
   NORMALIZE STATUS
========================================================= */

function normalizeStatus(
    value:
        unknown
): GameStatus {

    switch (
        value
    ) {

        case "current":

            return "current";


        case "regular":

            return "regular";


        case "paused":

            return "paused";


        case "finished":

            return "finished";


        case "backlog":

        default:

            return "backlog";

    }

}


/* =========================================================
   NORMALIZE TAGS
========================================================= */

function normalizeTags(
    value:
        unknown
): string[] {

    /*
     * Cas 1 :
     *
     * Supabase retourne déjà un tableau PostgreSQL text[].
     */

    if (
        Array.isArray(
            value
        )
    ) {

        return value
            .map(
                tag =>
                    String(
                        tag
                    )
                        .trim()
            )
            .filter(
                Boolean
            );

    }


    /*
     * Cas 2 :
     *
     * Anciennes données éventuellement stockées
     * sous forme de texte.
     */

    if (
        typeof value
        ===
        "string"
    ) {

        const text =
            value
                .trim();


        if (
            !text
        ) {

            return [];

        }


        /*
         * Essaie d'abord un JSON :
         *
         * ["Horreur", "Coop"]
         */

        if (
            text.startsWith(
                "["
            )
            &&
            text.endsWith(
                "]"
            )
        ) {

            try {

                const parsed =
                    JSON.parse(
                        text
                    );


                if (
                    Array.isArray(
                        parsed
                    )
                ) {

                    return parsed
                        .map(
                            tag =>
                                String(
                                    tag
                                )
                                    .trim()
                        )
                        .filter(
                            Boolean
                        );

                }

            }
            catch {

                /*
                 * On continue avec la séparation classique.
                 */

            }

        }


        return text
            .split(
                ","
            )
            .map(
                tag =>
                    tag.trim()
            )
            .filter(
                Boolean
            );

    }


    return [];

}


/* =========================================================
   NORMALIZE RATING
========================================================= */

function normalizeRating(
    value:
        unknown
): number | null {

    if (
        value === null
        ||
        value === undefined
        ||
        value === ""
    ) {

        return null;

    }


    const number =
        Number(
            value
        );


    if (
        Number.isNaN(
            number
        )
    ) {

        return null;

    }


    return number;

}


/* =========================================================
   NORMALIZE BOOLEAN
========================================================= */

function normalizeBoolean(
    value:
        unknown
): boolean {

    if (
        value === true
        ||
        value === 1
        ||
        value === "1"
        ||
        value === "true"
    ) {

        return true;

    }


    return false;

}


/* =========================================================
   NORMALIZE DATE
========================================================= */

function normalizeDate(
    value:
        unknown
): string {

    const normalized =
        normalizeString(
            value
        );


    if (
        normalized
    ) {

        return normalized;

    }


    return new Date()
        .toISOString();

}


/* =========================================================
   NORMALIZE GAME
========================================================= */

function normalizeGame(
    game:
        RawGame
): Game {

    const id =
        normalizeString(
            game.id
        );


    if (
        !id
    ) {

        throw new Error(
            "Un jeu Supabase ne possède pas d'identifiant valide."
        );

    }


    return {

        id,

        twitch_game_id:
            normalizeString(
                game.twitch_game_id
            ),

        twitch_name:
            normalizeString(
                game.twitch_name
            ),

        box_art_url:
            normalizeString(
                game.box_art_url
            ),

        status:
            normalizeStatus(
                game.status
            ),

        tags:
            normalizeTags(
                game.tags
            ),

        description:
            normalizeString(
                game.description
            ),

        rating:
            normalizeRating(
                game.rating
            ),

        youtube_playlist:
            normalizeString(
                game.youtube_playlist
            ),

        poll_enabled:
            normalizeBoolean(
                game.poll_enabled
            ),

        created_at:
            normalizeDate(
                game.created_at
            ),

        updated_at:
            normalizeDate(
                game.updated_at
            )

    };

}


/* =========================================================
   GET GAMES
========================================================= */

export async function getGames():
    Promise<Game[]> {

    const {
        data,
        error
    } =
        await supabase
            .from(
                "games"
            )
            .select(
                GAME_SELECT
            )
            .order(
                "created_at",
                {
                    ascending:
                        true
                }
            );


    if (
        error
    ) {

        console.error(
            "Erreur récupération jeux Supabase :",
            error
        );


        throw error;

    }


    if (
        !data
    ) {

        return [];

    }


    return data
        .map(
            game =>
                normalizeGame(
                    game
                )
        );

}


/* =========================================================
   GET GAME BY ID
========================================================= */

export async function getGameById(
    gameId:
        string
): Promise<Game | null> {

    const id =
        gameId
            .trim();


    if (
        !id
    ) {

        return null;

    }


    const {
        data,
        error
    } =
        await supabase
            .from(
                "games"
            )
            .select(
                GAME_SELECT
            )
            .eq(
                "id",
                id
            )
            .maybeSingle();


    if (
        error
    ) {

        console.error(
            "Erreur récupération jeu Supabase :",
            error
        );


        throw error;

    }


    if (
        !data
    ) {

        return null;

    }


    return normalizeGame(
        data
    );

}


/* =========================================================
   GET CURRENT GAMES
========================================================= */

export async function getCurrentGames():
    Promise<Game[]> {

    const games =
        await getGames();


    return games
        .filter(
            game =>
                game.status
                ===
                "current"
        );

}


/* =========================================================
   GET REGULAR GAMES
========================================================= */

export async function getRegularGames():
    Promise<Game[]> {

    const games =
        await getGames();


    return games
        .filter(
            game =>
                game.status
                ===
                "regular"
        );

}


/* =========================================================
   GET BACKLOG GAMES
========================================================= */

export async function getBacklogGames():
    Promise<Game[]> {

    const games =
        await getGames();


    return games
        .filter(
            game =>
                game.status
                ===
                "backlog"
        );

}


/* =========================================================
   GET FINISHED GAMES
========================================================= */

export async function getFinishedGames():
    Promise<Game[]> {

    const games =
        await getGames();


    return games
        .filter(
            game =>
                game.status
                ===
                "finished"
        );

}


/* =========================================================
   GET POLL GAMES
========================================================= */

export async function getPollGames():
    Promise<Game[]> {

    const games =
        await getGames();


    return games
        .filter(
            game =>
                game.poll_enabled
        );

}


/* =========================================================
   GET GAME DISPLAY NAME
========================================================= */

export function getGameDisplayName(
    game:
        Game
): string {

    return (
        game.twitch_name
        ||
        "Jeu sans nom"
    );

}


/* =========================================================
   GET GAME TAGS TEXT
========================================================= */

export function getGameTagsText(
    game:
        Game
): string {

    return game.tags
        .join(
            " "
        );

}