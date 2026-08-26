import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import twitchRouter from "./routes/twitch.routes.js";
/* =========================================================
   APP
========================================================= */
const app = express();
/* =========================================================
   PORT
========================================================= */
const PORT = Number(process.env.PORT) || 3000;
/* =========================================================
   MIDDLEWARES
========================================================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
/* =========================================================
   HEALTH CHECK
========================================================= */
app.get("/api/health", (_req, res) => {
    res.json({
        success: true,
        message: "Couaxia API is running",
        timestamp: new Date()
            .toISOString()
    });
});
/* =========================================================
   TWITCH ROUTES
========================================================= */
app.use("/api/twitch", twitchRouter);
/* =========================================================
   API 404
========================================================= */
app.use("/api", (_req, res) => {
    res
        .status(404)
        .json({
        success: false,
        message: "API route not found"
    });
});
/* =========================================================
   START SERVER
========================================================= */
app.listen(PORT, () => {
    console.log(`Couaxia API running on http://localhost:${PORT}`);
});
