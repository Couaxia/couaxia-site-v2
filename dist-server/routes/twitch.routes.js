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
   TWITCH THUMBNAIL CACHE
========================================================= */

/*
 * Les anciennes VOD Twitch peuvent renvoyer une URL
 * qui redirige vers :
 *
 * /ttv-static/404_preview-480x272.jpg
 *
 * Techniquement l'image existe, donc <img @error>
 * ne détecte rien.
 *
 * On vérifie donc côté backend si Twitch utilise
 * son aperçu 404.
 */

const TWITCH_THUMBNAIL_CACHE_TTL =
    6
    *
    60
    *
    60
    *
    1000;


const twitchThumbnailCache =
    new Map();


/* =========================================================
   IS TWITCH THUMBNAIL AVAILABLE
========================================================= */

async function isTwitchThumbnailAvailable(
    thumbnailUrl
) {

    if (
        !thumbnailUrl
        ||
        typeof thumbnailUrl !==
            "string"
    ) {

        return false;

    }


    /* =====================================================
       CACHE
    ====================================================== */

    const cached =
        twitchThumbnailCache.get(
            thumbnailUrl
        );


    if (
        cached
        &&
        Date.now()
        <
        cached.expiresAt
    ) {

        return cached.available;

    }


    /* =====================================================
       REQUEST
    ====================================================== */

    try {

        const response =
            await fetch(
                thumbnailUrl,
                {
                    method:
                        "HEAD",

                    redirect:
                        "follow",

                    signal:
                        AbortSignal.timeout(
                            5000
                        )
                }
            );


        const finalUrl =
            response.url
                ??
                "";


        const is404Preview =
            finalUrl.includes(
                "/404_preview"
            )
            ||
            finalUrl.includes(
                "404_preview-"
            );


        const available =
            response.ok
            &&
            !is404Preview;


        /* =================================================
           SAVE CACHE
        ================================================== */

        twitchThumbnailCache.set(
            thumbnailUrl,
            {

                available,

                expiresAt:
                    Date.now()
                    +
                    TWITCH_THUMBNAIL_CACHE_TTL

            }
        );


        return available;

    }
    catch (
        error
    ) {

        console.warn(
            "Impossible de vérifier la miniature Twitch :",
            thumbnailUrl,
            error
        );


        /*
         * En cas de problème réseau temporaire,
         * on conserve la miniature plutôt que
         * de la déclarer cassée par erreur.
         */

        return true;

    }

}


/* =========================================================
   CLEAN TWITCH VIDEO THUMBNAILS
========================================================= */

async function cleanVideoThumbnails(
    videos
) {

    const cleanedVideos =
        [];


    /*
     * On traite les vidéos par petits groupes
     * afin de ne pas envoyer 100 requêtes HEAD
     * simultanément à Twitch.
     */

    const chunkSize =
        8;


    for (
        let index = 0;
        index < videos.length;
        index += chunkSize
    ) {

        const chunk =
            videos.slice(
                index,
                index
                +
                chunkSize
            );


        const cleanedChunk =
            await Promise.all(

                chunk.map(
                    async video => {

                        if (
                            !video.thumbnailUrl
                        ) {

                            return {
                                ...video,

                                thumbnailUrl:
                                    null
                            };

                        }


                        const available =
                            await isTwitchThumbnailAvailable(
                                video.thumbnailUrl
                            );


                        return {

                            ...video,

                            thumbnailUrl:
                                available
                                    ? video.thumbnailUrl
                                    : null

                        };

                    }
                )

            );


        cleanedVideos.push(
            ...cleanedChunk
        );

    }


    return cleanedVideos;

}


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


            /* =================================================
               TWITCH VIDEOS
            ================================================== */

            const videos =
                await getTwitchVideos(
                    first
                );


            /* =================================================
               VERIFY THUMBNAILS
            ================================================== */

            const cleanedVideos =
                await cleanVideoThumbnails(
                    videos
                );


            /* =================================================
               RESPONSE
            ================================================== */

            res.json({

                success:
                    true,

                data:
                    cleanedVideos,

                total:
                    cleanedVideos.length

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