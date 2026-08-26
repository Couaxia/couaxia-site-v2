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
   API URL
========================================================= */

const apiUrl =
    import.meta.env.VITE_API_URL;


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


    if (!apiUrl) {

        throw new Error(
            "VITE_API_URL est manquante."
        );

    }


    const response =
        await fetch(
            `${apiUrl}/api/twitch/games?ids=${encodeURIComponent(
                cleanIds.join(",")
            )}`
        );


    /* =====================================================
       HTTP ERROR
    ===================================================== */

    if (!response.ok) {

        throw new Error(
            `Erreur API Twitch : ${response.status}`
        );

    }


    /* =====================================================
       CONTENT TYPE
    ===================================================== */

    const contentType =
        response.headers.get(
            "content-type"
        );


    if (
        !contentType?.includes(
            "application/json"
        )
    ) {

        const text =
            await response.text();


        console.error(
            "Réponse API non JSON :",
            text.slice(
                0,
                300
            )
        );


        throw new Error(
            "Le serveur Twitch n'a pas renvoyé du JSON."
        );

    }


    /* =====================================================
       JSON
    ===================================================== */

    const result =
        await response.json() as
            TwitchGamesApiResponse;


    return (
        result.data ??
        []
    );

}