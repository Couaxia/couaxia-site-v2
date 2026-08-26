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

    data: TwitchGameData[];

}


/* =========================================================
   GET TWITCH GAMES
========================================================= */

export async function getTwitchGamesByIds(
    ids: string[]
):
    Promise<TwitchGameData[]> {

    const cleanIds =
        [
            ...new Set(
                ids.filter(
                    Boolean
                )
            )
        ];


    if (
        cleanIds.length === 0
    ) {

        return [];

    }


    const response =
        await fetch(
            `/api/twitch/games?ids=${encodeURIComponent(
                cleanIds.join(",")
            )}`
        );


    if (
        !response.ok
    ) {

        throw new Error(
            "Impossible de récupérer les informations Twitch des jeux."
        );

    }


    const result =
        await response.json() as
            TwitchGamesApiResponse;


    return (
        result.data ??
        []
    );

}