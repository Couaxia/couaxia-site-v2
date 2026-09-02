/* =========================================================
   TWITCH ROUTES
========================================================= */

import {
    Router
} from "express";


import {
    getTwitchClips,
    getTwitchFollowers,
    getTwitchGames,
    getTwitchLive,
    getTwitchRecommendations,
    getTwitchVideos,
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

            const data =
                await getTwitchLive();


            res.json({

                success:
                    true,

                data

            });

        }
        catch (
            error
        ) {

            console.error(
                "Twitch live route error:",
                error
            );


            res
                .status(
                    500
                )
                .json({

                    success:
                        false,

                    message:
                        "Impossible de récupérer le live Twitch.",

                    error:
                        error instanceof Error
                            ? error.message
                            : "Erreur Twitch inconnue"

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

            const data =
                await getTwitchFollowers();


            res.json({

                success:
                    true,

                data

            });

        }
        catch (
            error
        ) {

            console.error(
                "Twitch followers route error:",
                error
            );


            res
                .status(
                    500
                )
                .json({

                    success:
                        false,

                    message:
                        "Impossible de récupérer les followers Twitch.",

                    error:
                        error instanceof Error
                            ? error.message
                            : "Erreur Twitch inconnue"

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

            const rawLogins =
                req.query.logins;


            if (
                typeof rawLogins !==
                "string"
            ) {

                res.json({

                    success:
                        true,

                    data:
                        []

                });


                return;

            }


            const logins =
                rawLogins
                    .split(
                        ","
                    )
                    .map(
                        login =>
                            login.trim()
                    )
                    .filter(
                        Boolean
                    );


            const data =
                await getTwitchRecommendations(
                    logins
                );


            res.json({

                success:
                    true,

                data

            });

        }
        catch (
            error
        ) {

            console.error(
                "Twitch recommendations route error:",
                error
            );


            res
                .status(
                    500
                )
                .json({

                    success:
                        false,

                    message:
                        "Impossible de récupérer les recommandations Twitch.",

                    error:
                        error instanceof Error
                            ? error.message
                            : "Erreur Twitch inconnue"

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

            const rawFirst =
                req.query.first;


            let first =
                100;


            if (
                typeof rawFirst ===
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
                        parsed;

                }

            }


            const clips =
                await getTwitchClips(
                    first
                );


            res.json({

                success:
                    true,

                data:
                    clips,

                total:
                    clips.length

            });

        }
        catch (
            error
        ) {

            console.error(
                "Twitch clips route error:",
                error
            );


            res
                .status(
                    500
                )
                .json({

                    success:
                        false,

                    message:
                        "Impossible de récupérer les clips Twitch.",

                    error:
                        error instanceof Error
                            ? error.message
                            : "Erreur Twitch inconnue"

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

            const rawFirst =
                req.query.first;


            let first =
                100;


            if (
                typeof rawFirst ===
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
                        parsed;

                }

            }


            const videos =
                await getTwitchVideos(
                    first
                );


            res.json({

                success:
                    true,

                data:
                    videos,

                total:
                    videos.length

            });

        }
        catch (
            error
        ) {

            console.error(
                "Twitch videos route error:",
                error
            );


            res
                .status(
                    500
                )
                .json({

                    success:
                        false,

                    message:
                        "Impossible de récupérer les vidéos Twitch.",

                    error:
                        error instanceof Error
                            ? error.message
                            : "Erreur Twitch inconnue"

                });

        }

    }
);


/* =========================================================
   GET /api/twitch/games
========================================================= */

/*
 * DEUX MODES :
 *
 * ---------------------------------------------------------
 *
 * RECHERCHE PAR NOM
 *
 * /api/twitch/games?search=Dead%20By%20Daylight
 *
 * ---------------------------------------------------------
 *
 * RECHERCHE PAR IDS
 *
 * /api/twitch/games?ids=509658,123456
 *
 * ---------------------------------------------------------
 */

router.get(
    "/games",

    async (
        req,
        res
    ) => {

        try {

            const rawSearch =
                req.query.search;


            const rawIds =
                req.query.ids;


            const rawFirst =
                req.query.first;


            /* =================================================
               SEARCH BY NAME
            ================================================== */

            if (
                typeof rawSearch ===
                "string"
            ) {

                const search =
                    rawSearch.trim();


                if (
                    search.length <
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
                   FIRST
                ============================================== */

                let first =
                    20;


                if (
                    typeof rawFirst ===
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
               SEARCH BY IDS
            ================================================== */

            if (
                typeof rawIds ===
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


                if (
                    gameIds.length ===
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
               INVALID REQUEST
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
        catch (
            error
        ) {

            console.error(
                "Twitch games route error:",
                error
            );


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
                        error instanceof Error
                            ? error.message
                            : "Erreur Twitch inconnue"

                });

        }

    }
);


/* =========================================================
   ROUTER FALLBACK
========================================================= */

router.use(
    (
        req,
        res
    ) => {

        res
            .status(
                404
            )
            .json({

                success:
                    false,

                message:
                    "Route Twitch introuvable.",

                path:
                    req.originalUrl

            });

    }
);


/* =========================================================
   EXPORT
========================================================= */

export default router;