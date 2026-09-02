/* =========================================================
   TWITCH GAMES SERVICE — FRONTEND
========================================================= */


/* =========================================================
   TYPES
========================================================= */

export interface TwitchGame {

    id:
        string;

    name:
        string;

    boxArtUrl:
        string | null;

    rawBoxArtUrl:
        string | null;

}


/*
 * Compatibilité avec les anciens composants
 * Favorites.vue / Currently.vue / etc.
 */
export type TwitchGameData =
    TwitchGame;


/* =========================================================
   API RESPONSE
========================================================= */

interface TwitchGamesApiResponse {

    success?:
        boolean;

    data?:
        unknown;

    message?:
        string;

    error?:
        string;

}


/* =========================================================
   RAW TWITCH GAME
========================================================= */

interface RawTwitchGame {

    id?:
        unknown;

    name?:
        unknown;

    boxArtUrl?:
        unknown;

    rawBoxArtUrl?:
        unknown;

    box_art_url?:
        unknown;

}


/* =========================================================
   API
========================================================= */

const TWITCH_GAMES_API =
    "/api/twitch/games";


/* =========================================================
   NORMALIZE STRING
========================================================= */

function normalizeString(
    value:
        unknown
): string {

    if (
        value === null
        ||
        value === undefined
    ) {

        return "";

    }


    return String(
        value
    ).trim();

}


/* =========================================================
   FORMAT TWITCH BOX ART
========================================================= */

export function formatTwitchGameBoxArt(
    value:
        string | null | undefined,

    width:
        number =
            285,

    height:
        number =
            380
): string | null {

    if (
        !value
    ) {

        return null;

    }


    const url =
        value.trim();


    if (
        !url
    ) {

        return null;

    }


    return url
        .replaceAll(
            "{width}",
            String(
                width
            )
        )
        .replaceAll(
            "{height}",
            String(
                height
            )
        )
        .replaceAll(
            "%{width}",
            String(
                width
            )
        )
        .replaceAll(
            "%{height}",
            String(
                height
            )
        );

}


/* =========================================================
   NORMALIZE GAME
========================================================= */

function normalizeTwitchGame(
    value:
        unknown
): TwitchGame | null {

    if (
        !value
        ||
        typeof value !==
            "object"
    ) {

        return null;

    }


    const raw =
        value as RawTwitchGame;


    const id =
        normalizeString(
            raw.id
        );


    const name =
        normalizeString(
            raw.name
        );


    if (
        !id
        ||
        !name
    ) {

        return null;

    }


    /*
     * URL Twitch originale avec :
     *
     * {width}
     * {height}
     */

    const rawBoxArtUrl =
        normalizeString(
            raw.rawBoxArtUrl
            ??
            raw.box_art_url
            ??
            raw.boxArtUrl
        )
        ||
        null;


    /*
     * URL déjà formatée par notre serveur.
     */

    const suppliedBoxArt =
        normalizeString(
            raw.boxArtUrl
        )
        ||
        null;


    const boxArtUrl =
        suppliedBoxArt
        ??
        formatTwitchGameBoxArt(
            rawBoxArtUrl
        );


    return {

        id,

        name,

        boxArtUrl,

        rawBoxArtUrl

    };

}


/* =========================================================
   NORMALIZE ARRAY
========================================================= */

function normalizeTwitchGames(
    value:
        unknown
): TwitchGame[] {

    if (
        !Array.isArray(
            value
        )
    ) {

        return [];

    }


    return value
        .map(
            normalizeTwitchGame
        )
        .filter(
            (
                game
            ): game is TwitchGame =>
                game !== null
        );

}


/* =========================================================
   READ RESPONSE
========================================================= */

async function readResponse(
    response:
        Response
): Promise<TwitchGamesApiResponse> {

    const contentType =
        response.headers
            .get(
                "content-type"
            )
        ??
        "";


    /* =====================================================
       JSON
    ====================================================== */

    if (
        contentType.includes(
            "application/json"
        )
    ) {

        return (
            await response.json()
        ) as TwitchGamesApiResponse;

    }


    /* =====================================================
       NON JSON
    ====================================================== */

    const text =
        await response.text();


    /*
     * Si on arrive ici avec du HTML,
     * la requête est probablement tombée
     * sur index.html au lieu de l'API.
     */

    if (
        text
            .trim()
            .startsWith(
                "<"
            )
    ) {

        throw new Error(
            "Le serveur a renvoyé une page HTML au lieu de données Twitch."
        );

    }


    if (
        !text.trim()
    ) {

        return {};

    }


    try {

        return JSON.parse(
            text
        ) as TwitchGamesApiResponse;

    }
    catch {

        return {

            success:
                false,

            message:
                text

        };

    }

}


/* =========================================================
   FETCH TWITCH API
========================================================= */

async function fetchTwitchGames(
    url:
        string
): Promise<TwitchGame[]> {

    const response =
        await fetch(
            url,
            {

                method:
                    "GET",

                headers: {

                    Accept:
                        "application/json"

                }

            }
        );


    const result =
        await readResponse(
            response
        );


    if (
        !response.ok
    ) {

        throw new Error(
            result.error
            ??
            result.message
            ??
            `Erreur Twitch (${response.status}).`
        );

    }


    if (
        result.success ===
        false
    ) {

        throw new Error(
            result.error
            ??
            result.message
            ??
            "Impossible de récupérer les jeux Twitch."
        );

    }


    return normalizeTwitchGames(
        result.data
    );

}


/* =========================================================
   SEARCH TWITCH GAMES
========================================================= */

/*
 * Recherche Twitch PAR NOM.
 *
 * Exemple :
 *
 * searchTwitchGames(
 *     "Dead By Daylight"
 * );
 */
export async function searchTwitchGames(
    query:
        string,

    first:
        number =
            20
): Promise<TwitchGame[]> {

    const cleanQuery =
        query
            .trim();


    if (
        cleanQuery.length <
        2
    ) {

        return [];

    }


    const cleanFirst =
        Number.isFinite(
            first
        )

            ? Math.min(
                Math.max(
                    Math.floor(
                        first
                    ),
                    1
                ),
                100
            )

            : 20;


    const params =
        new URLSearchParams();


    params.set(
        "search",
        cleanQuery
    );


    params.set(
        "first",
        String(
            cleanFirst
        )
    );


    return fetchTwitchGames(
        `${TWITCH_GAMES_API}?${params.toString()}`
    );

}


/* =========================================================
   GET GAMES BY IDS
========================================================= */

/*
 * Utilisé pour les jeux déjà enregistrés
 * dans Supabase.
 */
export async function getTwitchGamesByIds(
    ids:
        string[]
): Promise<TwitchGame[]> {

    const cleanIds =
        [
            ...new Set(
                ids
                    .map(
                        id =>
                            String(
                                id
                            )
                                .trim()
                    )
                    .filter(
                        Boolean
                    )
            )
        ];


    if (
        cleanIds.length ===
        0
    ) {

        return [];

    }


    const result:
        TwitchGame[] =
            [];


    /*
     * Twitch accepte maximum 100 IDs
     * dans GET /helix/games.
     */

    const chunkSize =
        100;


    for (
        let index = 0;
        index < cleanIds.length;
        index += chunkSize
    ) {

        const chunk =
            cleanIds.slice(
                index,
                index
                +
                chunkSize
            );


        const params =
            new URLSearchParams();


        params.set(
            "ids",
            chunk.join(
                ","
            )
        );


        const games =
            await fetchTwitchGames(
                `${TWITCH_GAMES_API}?${params.toString()}`
            );


        result.push(
            ...games
        );

    }


    return result;

}


/* =========================================================
   GET ONE GAME BY ID
========================================================= */

export async function getTwitchGameById(
    id:
        string
): Promise<TwitchGame | null> {

    const cleanId =
        id.trim();


    if (
        !cleanId
    ) {

        return null;

    }


    const games =
        await getTwitchGamesByIds([
            cleanId
        ]);


    return (
        games[0]
        ??
        null
    );

}


/* =========================================================
   SEARCH FIRST GAME
========================================================= */

export async function searchFirstTwitchGame(
    query:
        string
): Promise<TwitchGame | null> {

    const games =
        await searchTwitchGames(
            query,
            10
        );


    return (
        games[0]
        ??
        null
    );

}


/* =========================================================
   GET COVER
========================================================= */

export function getTwitchGameCover(
    game:
        TwitchGame | null | undefined,

    width:
        number =
            285,

    height:
        number =
            380
): string | null {

    if (
        !game
    ) {

        return null;

    }


    return formatTwitchGameBoxArt(
        game.rawBoxArtUrl
        ??
        game.boxArtUrl,
        width,
        height
    );

}


/* =========================================================
   GET NAME
========================================================= */

export function getTwitchGameName(
    game:
        TwitchGame | null | undefined
): string {

    return (
        game?.name
        ||
        "Jeu inconnu"
    );

}