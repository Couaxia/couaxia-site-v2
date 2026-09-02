/* =========================================================
   COUAXIA — EXPRESS SERVER
========================================================= */

import express from "express";

import path from "path";

import {
    fileURLToPath
} from "url";


import twitchRoutes
    from "./routes/twitch.routes.js";


/* =========================================================
   APP
========================================================= */

const app =
    express();


/* =========================================================
   __DIRNAME
========================================================= */

const __filename =
    fileURLToPath(
        import.meta.url
    );


const __dirname =
    path.dirname(
        __filename
    );


/* =========================================================
   CONFIG
========================================================= */

const PORT =
    Number(
        process.env.PORT
    )
    ||
    10000;


const HOST =
    "0.0.0.0";


/* =========================================================
   DIST
========================================================= */

/*
 * On utilise process.cwd() pour que ça fonctionne
 * aussi une fois server.ts compilé dans dist-server.
 *
 * Sur Render :
 *
 * projet/
 * ├── dist/
 * ├── dist-server/
 * └── package.json
 */

const distPath =
    path.resolve(
        process.cwd(),
        "dist"
    );


const indexPath =
    path.join(
        distPath,
        "index.html"
    );


/* =========================================================
   TRUST PROXY — RENDER
========================================================= */

app.set(
    "trust proxy",
    1
);


/* =========================================================
   BODY
========================================================= */

app.use(
    express.json({

        limit:
            "20mb"

    })
);


app.use(
    express.urlencoded({

        extended:
            true,

        limit:
            "20mb"

    })
);


/* =========================================================
   HEALTH
========================================================= */

app.get(
    "/health",

    (
        _req,
        res
    ) => {

        res.json({

            success:
                true,

            status:
                "ok",

            service:
                "couaxia-site-v2"

        });

    }
);


/* =========================================================
   API — TWITCH
========================================================= */

/*
 * IMPORTANT :
 *
 * Cette route doit être déclarée AVANT
 * express.static() et AVANT index.html.
 */

app.use(
    "/api/twitch",
    twitchRoutes
);


/* =========================================================
   API FALLBACK
========================================================= */

/*
 * Toute route /api inconnue doit retourner du JSON.
 *
 * Cela évite exactement le problème :
 *
 * "Le serveur a renvoyé une page HTML au lieu
 * de données Twitch."
 */

app.use(
    "/api",

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
                    "Route API introuvable.",

                path:
                    req.originalUrl

            });

    }
);


/* =========================================================
   STATIC VUE BUILD
========================================================= */

/*
 * Seulement APRÈS les APIs.
 */

app.use(
    express.static(
        distPath
    )
);


/* =========================================================
   SPA FALLBACK
========================================================= */

/*
 * Vue Router doit pouvoir afficher :
 *
 * /
 * /jeux
 * /profil
 * /admin
 * etc.
 *
 * Ce middleware est volontairement placé
 * APRÈS /api.
 */

app.use(
    (
        req,
        res,
        next
    ) => {

        /*
         * Protection supplémentaire :
         * une API ne doit JAMAIS recevoir index.html.
         */

        if (
            req.path.startsWith(
                "/api/"
            )
        ) {

            res
                .status(
                    404
                )
                .json({

                    success:
                        false,

                    message:
                        "Route API introuvable.",

                    path:
                        req.originalUrl

                });


            return;

        }


        /*
         * Pour les GET du frontend Vue,
         * on renvoie index.html.
         */

        if (
            req.method ===
            "GET"
        ) {

            res.sendFile(
                indexPath,
                error => {

                    if (
                        error
                    ) {

                        next(
                            error
                        );

                    }

                }
            );


            return;

        }


        next();

    }
);


/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use(
    (
        error:
            unknown,

        _req:
            express.Request,

        res:
            express.Response,

        _next:
            express.NextFunction
    ) => {

        console.error(
            "Erreur serveur :",
            error
        );


        if (
            res.headersSent
        ) {

            return;

        }


        res
            .status(
                500
            )
            .json({

                success:
                    false,

                message:
                    "Une erreur interne est survenue.",

                error:
                    error instanceof Error
                        ? error.message
                        : "Erreur inconnue"

            });

    }
);


/* =========================================================
   START SERVER
========================================================= */

app.listen(
    PORT,
    HOST,

    () => {

        console.log(
            "===================================="
        );


        console.log(
            "🐙 Serveur Couaxia démarré"
        );


        console.log(
            `🌐 http://${HOST}:${PORT}`
        );


        console.log(
            `🎮 Twitch games : http://localhost:${PORT}/api/twitch/games?search=Dead%20By%20Daylight`
        );


        console.log(
            "===================================="
        );

    }
);