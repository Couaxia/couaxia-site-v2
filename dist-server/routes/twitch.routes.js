import { Router } from "express";
import { getTwitchClips, getTwitchFollowers, getTwitchLive, getTwitchRecommendations, getTwitchVideos, getTwitchGames } from "../services/twitch.service.js";
/* =========================================================
   ROUTER
========================================================= */
const router = Router();
/* =========================================================
   GET /api/twitch/live
========================================================= */
router.get("/live", async (_req, res) => {
    try {
        const live = await getTwitchLive();
        res.json({
            success: true,
            data: live
        });
    }
    catch (error) {
        console.error("Twitch live route error:", error);
        const message = error instanceof Error
            ? error.message
            : "Unknown Twitch error";
        res
            .status(500)
            .json({
            success: false,
            message: "Unable to retrieve Twitch live data",
            error: message
        });
    }
});
/* =========================================================
   GET /api/twitch/followers
========================================================= */
router.get("/followers", async (_req, res) => {
    try {
        const followers = await getTwitchFollowers();
        res.json({
            success: true,
            data: followers
        });
    }
    catch (error) {
        console.error("Twitch followers route error:", error);
        const message = error instanceof Error
            ? error.message
            : "Unknown Twitch error";
        res
            .status(500)
            .json({
            success: false,
            message: "Unable to retrieve Twitch followers",
            error: message
        });
    }
});
/* =========================================================
   GET /api/twitch/recommendations
========================================================= */
router.get("/recommendations", async (req, res) => {
    try {
        const loginQuery = req.query.login;
        let logins = [];
        /* -------------------------------------------------
           SINGLE LOGIN
        ------------------------------------------------- */
        if (typeof loginQuery ===
            "string") {
            logins =
                [
                    loginQuery
                ];
        }
        /* -------------------------------------------------
           MULTIPLE LOGINS
        ------------------------------------------------- */
        else if (Array.isArray(loginQuery)) {
            logins =
                loginQuery.filter((value) => typeof value ===
                    "string");
        }
        /* -------------------------------------------------
           VALIDATION
        ------------------------------------------------- */
        if (logins.length ===
            0) {
            res
                .status(400)
                .json({
                success: false,
                message: "At least one Twitch login is required."
            });
            return;
        }
        /* -------------------------------------------------
           GET RECOMMENDATIONS
        ------------------------------------------------- */
        const recommendations = await getTwitchRecommendations(logins);
        res.json({
            success: true,
            data: recommendations
        });
    }
    catch (error) {
        console.error("Twitch recommendations route error:", error);
        const message = error instanceof Error
            ? error.message
            : "Unknown Twitch error";
        res
            .status(500)
            .json({
            success: false,
            message: "Unable to retrieve Twitch recommendations",
            error: message
        });
    }
});
/* =========================================================
   GET /api/twitch/clips
========================================================= */
router.get("/clips", async (req, res) => {
    try {
        /* -------------------------------------------------
           FIRST
        ------------------------------------------------- */
        const firstQuery = req.query.first;
        let first = 100;
        if (typeof firstQuery ===
            "string") {
            const parsed = Number(firstQuery);
            if (Number.isFinite(parsed)) {
                first =
                    parsed;
            }
        }
        /* -------------------------------------------------
           GET CLIPS
        ------------------------------------------------- */
        const clips = await getTwitchClips(first);
        /* -------------------------------------------------
           RESPONSE
        ------------------------------------------------- */
        res.json({
            success: true,
            data: clips,
            total: clips.length
        });
    }
    catch (error) {
        console.error("Twitch clips route error:", error);
        const message = error instanceof Error
            ? error.message
            : "Unknown Twitch error";
        res
            .status(500)
            .json({
            success: false,
            message: "Unable to retrieve Twitch clips",
            error: message
        });
    }
});
/* =========================================================
   GET /api/twitch/videos
========================================================= */
router.get("/videos", async (req, res) => {
    try {
        /* -------------------------------------------------
           FIRST
        ------------------------------------------------- */
        const firstQuery = req.query.first;
        let first = 100;
        if (typeof firstQuery ===
            "string") {
            const parsed = Number(firstQuery);
            if (Number.isFinite(parsed)) {
                first =
                    parsed;
            }
        }
        /* -------------------------------------------------
           GET VIDEOS
        ------------------------------------------------- */
        const videos = await getTwitchVideos(first);
        /* -------------------------------------------------
           RESPONSE
        ------------------------------------------------- */
        res.json({
            success: true,
            data: videos,
            total: videos.length
        });
    }
    catch (error) {
        console.error("Twitch videos route error:", error);
        const message = error instanceof Error
            ? error.message
            : "Unknown Twitch error";
        res
            .status(500)
            .json({
            success: false,
            message: "Unable to retrieve Twitch videos",
            error: message
        });
    }
});
/* =========================================================
   GET /api/twitch/games
========================================================= */
router.get("/games", async (req, res) => {
    try {
        /* =============================================
           IDS
        ============================================== */
        const rawIds = req.query.ids;
        if (typeof rawIds !==
            "string") {
            res
                .status(400)
                .json({
                success: false,
                message: "Le paramètre ids est obligatoire."
            });
            return;
        }
        /* =============================================
           SPLIT
        ============================================== */
        const gameIds = rawIds
            .split(",")
            .map(id => id.trim())
            .filter(Boolean);
        if (gameIds.length === 0) {
            res
                .status(400)
                .json({
                success: false,
                message: "Aucun identifiant Twitch fourni."
            });
            return;
        }
        /* =============================================
           TWITCH
        ============================================== */
        const games = await getTwitchGames(gameIds);
        /* =============================================
           RESPONSE
        ============================================== */
        res.json({
            success: true,
            data: games
        });
    }
    catch (error) {
        console.error("Twitch games error:", error);
        const message = error instanceof Error
            ? error.message
            : "Erreur Twitch inconnue";
        res
            .status(500)
            .json({
            success: false,
            message: "Impossible de récupérer les jeux Twitch.",
            error: message
        });
    }
});
/* =========================================================
   EXPORT
========================================================= */
export default router;
