import {
    supabase
} from "../lib/supabase";


/* =========================================================
   TYPES
========================================================= */

export type GameStatus =
    | "current"
    | "regular"
    | "backlog"
    | "finished";


export interface Game {

    id: number;

    twitch_game_id:
        string | null;

    twitch_name:
        string | null;

    box_art_url?:
        string | null;

    status:
        GameStatus;

    tags:
        string[] | null;

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
   TWITCH GAME
========================================================= */

interface TwitchGame {

    id: string;

    name: string;

    boxArtUrl: string;

}


interface TwitchGamesResponse {

    success: boolean;

    data: TwitchGame[];

}


/* =========================================================
   GET TWITCH GAMES
========================================================= */

async function getTwitchGames(
    ids: string[]
):
    Promise<TwitchGame[]> {

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

        console.error(
            "❌ Twitch games HTTP error:",
            response.status
        );


        return [];

    }


    const result =
        await response.json() as TwitchGamesResponse;


    return (
        result.data ??
        []
    );

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
            .from("games")
            .select("*")
            .order(
                "created_at",
                {
                    ascending:
                        false
                }
            );


    /* =====================================================
       ERROR
    ===================================================== */

    if (error) {

        console.error(
            "❌ Supabase games error:",
            {
                message:
                    error.message,

                details:
                    error.details,

                hint:
                    error.hint,

                code:
                    error.code
            }
        );


        throw new Error(
            `Impossible de récupérer les jeux : ${error.message}`
        );

    }


    /* =====================================================
       SUPABASE GAMES
    ===================================================== */

    const games =
        (
            data ??
            []
        ) as Game[];


    /* =====================================================
       TWITCH IDS
    ===================================================== */

    const twitchIds =
        games
            .map(
                game =>
                    game.twitch_game_id
            )
            .filter(
                (
                    id
                ): id is string =>
                    Boolean(
                        id
                    )
            );


    /* =====================================================
       TWITCH DATA
    ===================================================== */

    const twitchGames =
        await getTwitchGames(
            twitchIds
        );


    const twitchLookup =
        new Map(
            twitchGames.map(
                game => [
                    game.id,
                    game
                ]
            )
        );


    /* =====================================================
       MERGE SUPABASE + TWITCH
    ===================================================== */

    const enrichedGames =
        games.map(
            game => {

                if (
                    !game.twitch_game_id
                ) {

                    return game;

                }


                const twitchGame =
                    twitchLookup.get(
                        game.twitch_game_id
                    );


                if (
                    !twitchGame
                ) {

                    return game;

                }


                return {

                    ...game,

                    twitch_name:
                        twitchGame.name,

                    box_art_url:
                        twitchGame.boxArtUrl

                };

            }
        );


    /* =====================================================
       SUCCESS
    ===================================================== */

    console.log(
        "✅ Jeux Supabase + Twitch :",
        enrichedGames
    );


    return enrichedGames;

}