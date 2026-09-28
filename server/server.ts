/* =========================================================
   COUAXIA — EXPRESS SERVER
========================================================= */

import "dotenv/config";


import express from "express";

import cors from "cors";

import path from "path";

import {
    fileURLToPath
} from "url";


import twitchRoutes
    from "./routes/twitch.routes.js";


import cardsAdminRoutes
    from "./routes/cards-admin.routes.js";


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
   CORS
========================================================= */

app.use(
    cors({

        origin: [

            "https://couaxia-hmbf.onrender.com",

            "https://couaxia-api.onrender.com",

            "http://localhost:5173"

        ],

        methods: [

            "GET",

            "POST",

            "PUT",

            "PATCH",

            "DELETE",

            "OPTIONS"

        ],

        allowedHeaders: [

            "Content-Type",

            "Authorization"

        ],

        credentials:
            true

    })
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

app.use(
    "/api/twitch",
    twitchRoutes
);


/* =========================================================
   API — ADMIN CARDS
========================================================= */

/*
 * IMPORTANT :
 *
 * Cette route doit rester AVANT le fallback /api.
 */

app.use(
    "/api/admin/cards",
    cardsAdminRoutes
);


/* =========================================================
   API FALLBACK
========================================================= */

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

app.use(
    express.static(
        distPath
    )
);


/* =========================================================
   SPA FALLBACK
========================================================= */

app.use(
    (
        req,
        res,
        next
    ) => {

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
                        ?
                        error.message
                        :
                        "Erreur inconnue"

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
            `🃏 Admin cards : http://localhost:${PORT}/api/admin/cards`
        );


        console.log(
            "===================================="
        );

    }
);