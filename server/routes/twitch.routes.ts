import {
    Router
} from "express";

import {
    getTwitchClips,
    getTwitchFollowers,
    getTwitchLive,
    getTwitchRecommendations,
    getTwitchVideos,
    getTwitchGames,
    searchTwitchGames
} from "../services/twitch.service.js";


/* =========================================================
   ROUTER
========================================================= */

const router =
    Router();


/* =========================================================
   GET /api/twitch/live
========================================================= */

router.get(
    "/live",

    async (
        _req,
        res
    ) => {

        try {

            const live =
                await getTwitchLive();


            res.json({
                success:
                    true,

                data:
                    live
            });

        }

        catch (error) {

            console.error(
                "Twitch live route error:",
                error
            );


            const message =
                error instanceof Error
                    ? error.message
                    : "Unknown Twitch error";


            res
                .status(500)
                .json({
                    success:
                        false,

                    message:
                        "Unable to retrieve Twitch live data",

                    error:
                        message
                });

        }

    }
);


/* =========================================================
   GET /api/twitch/followers
========================================================= */

router.get(
    "/followers",

    async (
        _req,
        res
    ) => {

        try {

            const followers =
                await getTwitchFollowers();


            res.json({
                success:
                    true,

                data:
                    followers
            });

        }

        catch (error) {

            console.error(
                "Twitch followers route error:",
                error
            );


            const message =
                error instanceof Error
                    ? error.message
                    : "Unknown Twitch error";


            res
                .status(500)
                .json({
                    success:
                        false,

                    message:
                        "Unable to retrieve Twitch followers",

                    error:
                        message
                });

        }

    }
);


/* =========================================================
   GET /api/twitch/recommendations
========================================================= */

router.get(
    "/recommendations",

    async (
        req,
        res
    ) => {

        try {

            const loginQuery =
                req.query.login;


            let logins:
                string[] =
                [];


            /* -------------------------------------------------
               SINGLE LOGIN
            ------------------------------------------------- */

            if (
                typeof loginQuery ===
                "string"
            ) {

                logins =
                    [
                        loginQuery
                    ];

            }


            /* -------------------------------------------------
               MULTIPLE LOGINS
            ------------------------------------------------- */

            else if (
                Array.isArray(
                    loginQuery
                )
            ) {

                logins =
                    loginQuery.filter(
                        (
                            value
                        ):
                            value is string =>
                            typeof value ===
                            "string"
                    );

            }


            /* -------------------------------------------------
               VALIDATION
            ------------------------------------------------- */

            if (
                logins.length ===
                0
            ) {

                res
                    .status(400)
                    .json({
                        success:
                            false,

                        message:
                            "At least one Twitch login is required."
                    });


                return;

            }


            /* -------------------------------------------------
               GET RECOMMENDATIONS
            ------------------------------------------------- */

            const recommendations =
                await getTwitchRecommendations(
                    logins
                );


            res.json({
                success:
                    true,

                data:
                    recommendations
            });

        }

        catch (error) {

            console.error(
                "Twitch recommendations route error:",
                error
            );


            const message =
                error instanceof Error
                    ? error.message
                    : "Unknown Twitch error";


            res
                .status(500)
                .json({
                    success:
                        false,

                    message:
                        "Unable to retrieve Twitch recommendations",

                    error:
                        message
                });

        }

    }
);


/* =========================================================
   GET /api/twitch/clips
========================================================= */

router.get(
    "/clips",

    async (
        req,
        res
    ) => {

        try {

            /* -------------------------------------------------
               FIRST
            ------------------------------------------------- */

            const firstQuery =
                req.query.first;


            let first =
                100;


            if (
                typeof firstQuery ===
                "string"
            ) {

                const parsed =
                    Number(
                        firstQuery
                    );


                if (
                    Number.isFinite(
                        parsed
                    )
                ) {

                    first =
                        parsed;

                }

            }


            /* -------------------------------------------------
               GET CLIPS
            ------------------------------------------------- */

            const clips =
                await getTwitchClips(
                    first
                );


            /* -------------------------------------------------
               RESPONSE
            ------------------------------------------------- */

            res.json({
                success:
                    true,

                data:
                    clips,

                total:
                    clips.length
            });

        }

        catch (error) {

            console.error(
                "Twitch clips route error:",
                error
            );


            const message =
                error instanceof Error
                    ? error.message
                    : "Unknown Twitch error";


            res
                .status(500)
                .json({
                    success:
                        false,

                    message:
                        "Unable to retrieve Twitch clips",

                    error:
                        message
                });

        }

    }
);


/* =========================================================
   GET /api/twitch/videos
========================================================= */

router.get(
    "/videos",

    async (
        req,
        res
    ) => {

        try {

            /* -------------------------------------------------
               FIRST
            ------------------------------------------------- */

            const firstQuery =
                req.query.first;


            let first =
                100;


            if (
                typeof firstQuery ===
                "string"
            ) {

                const parsed =
                    Number(
                        firstQuery
                    );


                if (
                    Number.isFinite(
                        parsed
                    )
                ) {

                    first =
                        parsed;

                }

            }


            /* -------------------------------------------------
               GET VIDEOS
            ------------------------------------------------- */

            const videos =
                await getTwitchVideos(
                    first
                );


            /* -------------------------------------------------
               RESPONSE
            ------------------------------------------------- */

            res.json({
                success:
                    true,

                data:
                    videos,

                total:
                    videos.length
            });

        }

        catch (error) {

            console.error(
                "Twitch videos route error:",
                error
            );


            const message =
                error instanceof Error
                    ? error.message
                    : "Unknown Twitch error";


            res
                .status(500)
                .json({
                    success:
                        false,

                    message:
                        "Unable to retrieve Twitch videos",

                    error:
                        message
                });

               }

    }
);


/* =========================================================
   GET /api/twitch/games
========================================================= */

/*
 * Cette route possède maintenant DEUX modes :
 *
 * 1.
 * Recherche par nom :
 *
 * /api/twitch/games?search=Party%20Animals
 *
 *
 * 2.
 * Recherche par IDs :
 *
 * /api/twitch/games?ids=123,456
 *
 *
 * Le mode IDs reste utilisé par les pages publiques
 * pour récupérer les informations Twitch des jeux
 * déjà présents dans Supabase.
 */

router.get(
    "/games",

    async (
        req,
        res
    ) => {

        try {

            /* =================================================
               PARAMÈTRES
            ================================================== */

            const rawSearch =
                req.query.search;


            const rawIds =
                req.query.ids;


            const rawFirst =
                req.query.first;


            /* =================================================
               MODE 1 — SEARCH
            ================================================== */

            if (
                typeof rawSearch
                ===
                "string"
            ) {

                const search =
                    rawSearch
                        .trim();


                /*
                 * Pas de recherche Twitch pour une seule lettre.
                 */

                if (
                    search.length
                    <
                    2
                ) {

                    res.json({

                        success:
                            true,

                        data:
                            []

                    });


                    return;

                }


                /* =============================================
                   LIMIT
                ============================================== */

                let first =
                    20;


                if (
                    typeof rawFirst
                    ===
                    "string"
                ) {

                    const parsed =
                        Number(
                            rawFirst
                        );


                    if (
                        Number.isFinite(
                            parsed
                        )
                    ) {

                        first =
                            Math.min(
                                Math.max(
                                    Math.floor(
                                        parsed
                                    ),
                                    1
                                ),
                                100
                            );

                    }

                }


                /* =============================================
                   TWITCH SEARCH
                ============================================== */

                const games =
                    await searchTwitchGames(
                        search,
                        first
                    );


                res.json({

                    success:
                        true,

                    data:
                        games

                });


                return;

            }


            /* =================================================
               MODE 2 — IDS
            ================================================== */

            if (
                typeof rawIds
                ===
                "string"
            ) {

                const gameIds =
                    [
                        ...new Set(
                            rawIds
                                .split(
                                    ","
                                )
                                .map(
                                    id =>
                                        id.trim()
                                )
                                .filter(
                                    Boolean
                                )
                        )
                    ]
                        .slice(
                            0,
                            100
                        );


                /* =============================================
                   EMPTY IDS
                ============================================== */

                if (
                    gameIds.length
                    ===
                    0
                ) {

                    res.json({

                        success:
                            true,

                        data:
                            []

                    });


                    return;

                }


                /* =============================================
                   GET GAMES
                ============================================== */

                const games =
                    await getTwitchGames(
                        gameIds
                    );


                res.json({

                    success:
                        true,

                    data:
                        games

                });


                return;

            }


            /* =================================================
               AUCUN PARAMÈTRE
            ================================================== */

            res
                .status(
                    400
                )
                .json({

                    success:
                        false,

                    message:
                        "Utilise le paramètre search ou ids."

                });

        }


        /* =====================================================
           ERROR
        ====================================================== */

        catch (
            error
        ) {

            console.error(
                "Twitch games error:",
                error
            );


            const message =
                error instanceof Error

                    ? error.message

                    : "Erreur Twitch inconnue";


            res
                .status(
                    500
                )
                .json({

                    success:
                        false,

                    message:
                        "Impossible de récupérer les jeux Twitch.",

                    error:
                        message

                });

        }

    }
);


/* =========================================================
   EXPORT
========================================================= */

export default router;