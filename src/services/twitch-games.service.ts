import {
    apiFetch
} from "./api";


/* =========================================================
   TYPES
========================================================= */

export interface TwitchGameData {

    id: string;

    name: string;

    boxArtUrl: string;

}


interface TwitchGamesApiResponse {

    success: boolean;

    data?: TwitchGameData[];

    message?: string;

    error?: string;

}


/* =========================================================
   GET TWITCH GAMES
========================================================= */

export async function getTwitchGamesByIds(
    ids: string[]
):
    Promise<TwitchGameData[]> {

    /* =====================================================
       CLEAN IDS
    ===================================================== */

    const cleanIds =
        [
            ...new Set(
                ids
                    .map(
                        id =>
                            id.trim()
                    )
                    .filter(
                        Boolean
                    )
            )
        ];


    /* =====================================================
       EMPTY
    ===================================================== */

    if (
        cleanIds.length === 0
    ) {

        return [];

    }


    /* =====================================================
       API TWITCH
    ===================================================== */

    const result =
        await apiFetch<TwitchGamesApiResponse>(
            `/api/twitch/games?ids=${encodeURIComponent(
                cleanIds.join(",")
            )}`
        );


    /* =====================================================
       API ERROR
    ===================================================== */

    if (
        !result.success ||
        !result.data
    ) {

        throw new Error(
            result.error ??
            result.message ??
            "Impossible de récupérer les jeux Twitch."
        );

    }


    /* =====================================================
       SUCCESS
    ===================================================== */

    return result.data;

}