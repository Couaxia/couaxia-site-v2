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
   RAW GAME
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
   API BASE
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
   FORMAT BOX ART
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
        typeof value
        !==
        "object"
    ) {

        return null;

    }


    const game =
        value as RawTwitchGame;


    const id =
        normalizeString(
            game.id
        );


    const name =
        normalizeString(
            game.name
        );


    if (
        !id
        ||
        !name
    ) {

        return null;

    }


    const rawBoxArtUrl =
        normalizeString(
            game.rawBoxArtUrl
            ??
            game.box_art_url
            ??
            game.boxArtUrl
        )
        ||
        null;


    const directBoxArtUrl =
        normalizeString(
            game.boxArtUrl
        )
        ||
        null;


    const boxArtUrl =
        directBoxArtUrl
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
   READ API RESPONSE
========================================================= */

async function readApiResponse(
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
       TEXT / HTML
    ====================================================== */

    const text =
        await response.text();


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
   FETCH API
========================================================= */

async function fetchTwitchApi(
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


    const body =
        await readApiResponse(
            response
        );


    if (
        !response.ok
    ) {

        throw new Error(
            body.message
            ??
            body.error
            ??
            `Erreur Twitch (${response.status}).`
        );

    }


    if (
        body.success
        ===
        false
    ) {

        throw new Error(
            body.message
            ??
            body.error
            ??
            "Impossible de récupérer les jeux Twitch."
        );

    }


    return normalizeTwitchGames(
        body.data
    );

}


/* =========================================================
   SEARCH TWITCH GAMES
========================================================= */

/**
 * Recherche les jeux Twitch par NOM.
 *
 * Exemple :
 *
 * searchTwitchGames(
 *     "Party Animals"
 * );
 */
export async function searchTwitchGames(
    query:
        string,

    first:
        number =
            20
): Promise<TwitchGame[]> {

    const search =
        query
            .trim();


    if (
        search.length
        <
        2
    ) {

        return [];

    }


    const limit =
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


    /*
     * Notre route backend utilise :
     *
     * /api/twitch/games?search=Party Animals
     */

    params.set(
        "search",
        search
    );


    params.set(
        "first",
        String(
            limit
        )
    );


    return fetchTwitchApi(
        `${TWITCH_GAMES_API}?${params.toString()}`
    );

}


/* =========================================================
   GET TWITCH GAMES BY IDS
========================================================= */

/**
 * Utilisé pour les jeux déjà enregistrés
 * dans Supabase.
 */
export async function getTwitchGamesByIds(
    gameIds:
        string[]
): Promise<TwitchGame[]> {

    const ids =
        [
            ...new Set(
                gameIds
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
        ids.length
        ===
        0
    ) {

        return [];

    }


    const allGames:
        TwitchGame[] =
            [];


    const chunkSize =
        100;


    for (
        let index = 0;
        index < ids.length;
        index += chunkSize
    ) {

        const chunk =
            ids.slice(
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
            await fetchTwitchApi(
                `${TWITCH_GAMES_API}?${params.toString()}`
            );


        allGames.push(
            ...games
        );

    }


    return allGames;

}


/* =========================================================
   GET ONE GAME
========================================================= */

export async function getTwitchGameById(
    gameId:
        string
): Promise<TwitchGame | null> {

    const id =
        gameId
            .trim();


    if (
        !id
    ) {

        return null;

    }


    const games =
        await getTwitchGamesByIds([
            id
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