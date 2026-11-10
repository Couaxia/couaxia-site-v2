/* =========================================================
   COUAXIA - ARTIST CREDITS ADMIN ROUTES

   Tables :
   - artwork_credits
   - card_artists

   Routes :
   GET /api/admin/artist-credits/:target/:id
   PUT /api/admin/artist-credits/:target/:id

   Sécurité :
   - requireAdmin
   - Supabase service_role côté serveur
========================================================= */
import { randomUUID } from "node:crypto";
import { Router } from "express";
import { requireAdmin } from "../middleware/admin.middleware.js";
import { supabaseAdmin } from "../services/supabase-admin.service.js";
/* =========================================================
   ROUTER
========================================================= */
const router = Router();
router.use(requireAdmin);
/* =========================================================
   CONSTANTES
========================================================= */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_ARTISTS = 500;
const MAX_LINKS_PER_ARTIST = 100;
/* =========================================================
   CONFIGURATION DES TABLES
========================================================= */
function getTargetConfig(target) {
    if (target === "artwork") {
        return {
            parentTable: "artworks",
            creditsTable: "artwork_credits",
            foreignKey: "artwork_id"
        };
    }
    if (target === "card") {
        return {
            parentTable: "cards",
            creditsTable: "card_artists",
            foreignKey: "card_id"
        };
    }
    return null;
}
/* =========================================================
   VALIDATION
========================================================= */
function isValidUUID(value) {
    return (typeof value === "string" &&
        UUID_REGEX.test(value));
}
function validateCredits(value) {
    if (!Array.isArray(value)) {
        throw new Error("La liste des crédits artistiques est invalide.");
    }
    if (value.length > MAX_ARTISTS) {
        throw new Error(`Maximum ${MAX_ARTISTS} artistes par illustration ou carte.`);
    }
    return value.map((item, index) => {
        if (item === null ||
            typeof item !== "object" ||
            Array.isArray(item)) {
            throw new Error(`Les informations de l'artiste ${index + 1} sont invalides.`);
        }
        const credit = item;
        const artistName = typeof credit.artistName === "string"
            ? credit.artistName.trim()
            : "";
        const contribution = typeof credit.contribution === "string"
            ? credit.contribution.trim()
            : "";
        if (!artistName) {
            throw new Error(`Le nom de l'artiste ${index + 1} est obligatoire.`);
        }
        if (artistName.length > 200) {
            throw new Error(`Le nom de l'artiste ${index + 1} est trop long.`);
        }
        if (contribution.length > 500) {
            throw new Error(`La contribution de l'artiste ${index + 1} est trop longue.`);
        }
        if (credit.id !== undefined &&
            !isValidUUID(credit.id)) {
            throw new Error(`L'identifiant de l'artiste ${index + 1} est invalide.`);
        }
        const rawLinks = credit.links ?? [];
        if (!Array.isArray(rawLinks)) {
            throw new Error(`Les liens de l'artiste "${artistName}" sont invalides.`);
        }
        if (rawLinks.length > MAX_LINKS_PER_ARTIST) {
            throw new Error(`L'artiste "${artistName}" possède trop de liens.`);
        }
        const links = rawLinks.map((item, linkIndex) => {
            if (item === null ||
                typeof item !== "object" ||
                Array.isArray(item)) {
                throw new Error(`Lien ${linkIndex + 1} invalide pour "${artistName}".`);
            }
            const link = item;
            const label = typeof link.label === "string"
                ? link.label.trim()
                : "";
            const url = typeof link.url === "string"
                ? link.url.trim()
                : "";
            if (!url) {
                throw new Error(`L'URL du lien ${linkIndex + 1} de "${artistName}" est obligatoire.`);
            }
            if (label.length > 100 || url.length > 2048) {
                throw new Error(`Le lien ${linkIndex + 1} de "${artistName}" est trop long.`);
            }
            let parsedURL;
            try {
                parsedURL = new URL(url);
            }
            catch {
                throw new Error(`L'URL "${url}" est invalide.`);
            }
            if (parsedURL.protocol !== "https:" &&
                parsedURL.protocol !== "http:") {
                throw new Error("Seuls les liens HTTP et HTTPS sont autorisés.");
            }
            return {
                label: label || "Lien",
                url: parsedURL.toString()
            };
        });
        return {
            ...(typeof credit.id === "string"
                ? { id: credit.id }
                : {}),
            artistName,
            contribution,
            links,
            sortOrder: index
        };
    });
}
/* =========================================================
   VÉRIFIER L'EXISTENCE DE LA CARTE / ILLUSTRATION
========================================================= */
async function parentExists(table, id) {
    const { data, error } = await supabaseAdmin
        .from(table)
        .select("id")
        .eq("id", id)
        .maybeSingle();
    if (error) {
        throw error;
    }
    return data !== null;
}
/* =========================================================
   RÉCUPÉRER LES CRÉDITS DEPUIS SUPABASE
========================================================= */
async function fetchCredits(table, foreignKey, targetId) {
    const { data, error } = await supabaseAdmin
        .from(table)
        .select("id, artist_name, contribution, links, sort_order")
        .eq(foreignKey, targetId)
        .order("sort_order", {
        ascending: true
    })
        .order("created_at", {
        ascending: true
    });
    if (error) {
        throw error;
    }
    return (data ?? []);
}
/* =========================================================
   GET - RÉCUPÉRER LES CRÉDITS

   GET /api/admin/artist-credits/:target/:id
========================================================= */
router.get("/:target/:id", async (req, res, next) => {
    try {
        const target = String(req.params.target);
        const targetId = String(req.params.id);
        const config = getTargetConfig(target);
        if (!config) {
            res.status(400).json({
                success: false,
                error: "Type de crédit artistique invalide."
            });
            return;
        }
        if (!isValidUUID(targetId)) {
            res.status(400).json({
                success: false,
                error: "Identifiant invalide."
            });
            return;
        }
        const exists = await parentExists(config.parentTable, targetId);
        if (!exists) {
            res.status(404).json({
                success: false,
                error: target === "artwork"
                    ? "Illustration introuvable."
                    : "Carte introuvable."
            });
            return;
        }
        const credits = await fetchCredits(config.creditsTable, config.foreignKey, targetId);
        res.json({
            success: true,
            credits
        });
    }
    catch (error) {
        next(error);
    }
});
/* =========================================================
   PUT - ENREGISTRER LES CRÉDITS

   PUT /api/admin/artist-credits/:target/:id

   Fonctionnement :
   1. Valider les crédits
   2. Vérifier l'illustration ou la carte
   3. Récupérer les crédits existants
   4. Mettre à jour / ajouter les crédits
   5. Supprimer les crédits retirés
   6. Retourner la liste actualisée
========================================================= */
router.put("/:target/:id", async (req, res, next) => {
    try {
        const target = String(req.params.target);
        const targetId = String(req.params.id);
        const config = getTargetConfig(target);
        if (!config) {
            res.status(400).json({
                success: false,
                error: "Type de crédit artistique invalide."
            });
            return;
        }
        if (!isValidUUID(targetId)) {
            res.status(400).json({
                success: false,
                error: "Identifiant invalide."
            });
            return;
        }
        let credits;
        try {
            credits = validateCredits(req.body?.credits);
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error instanceof Error
                    ? error.message
                    : "Crédits artistiques invalides."
            });
            return;
        }
        const exists = await parentExists(config.parentTable, targetId);
        if (!exists) {
            res.status(404).json({
                success: false,
                error: target === "artwork"
                    ? "Illustration introuvable."
                    : "Carte introuvable."
            });
            return;
        }
        /* =================================================
           CRÉDITS EXISTANTS
        ================================================= */
        const existingCredits = await fetchCredits(config.creditsTable, config.foreignKey, targetId);
        const existingIds = new Set(existingCredits.map((credit) => credit.id));
        const suppliedIds = credits
            .map((credit) => credit.id)
            .filter((id) => Boolean(id));
        /* =================================================
           EMPÊCHER LA MODIFICATION DE CRÉDITS ÉTRANGERS
        ================================================= */
        if (new Set(suppliedIds).size !== suppliedIds.length) {
            res.status(400).json({
                success: false,
                error: "Un crédit artistique est présent plusieurs fois."
            });
            return;
        }
        for (const id of suppliedIds) {
            if (!existingIds.has(id)) {
                res.status(400).json({
                    success: false,
                    error: "Un crédit artistique n'appartient pas à cette illustration ou carte."
                });
                return;
            }
        }
        /* =================================================
           PRÉPARER LES CRÉDITS
        ================================================= */
        const rows = credits.map((credit) => ({
            id: credit.id ?? randomUUID(),
            [config.foreignKey]: targetId,
            artist_name: credit.artistName,
            contribution: credit.contribution || null,
            links: credit.links,
            sort_order: credit.sortOrder
        }));
        /* =================================================
           AJOUTER / MODIFIER LES CRÉDITS

           On enregistre les nouvelles valeurs avant de
           supprimer les crédits retirés.
        ================================================= */
        if (rows.length > 0) {
            const { error: upsertError } = await supabaseAdmin
                .from(config.creditsTable)
                .upsert(rows, {
                onConflict: "id"
            });
            if (upsertError) {
                throw upsertError;
            }
        }
        /* =================================================
           SUPPRIMER UNIQUEMENT LES CRÉDITS RETIRÉS
        ================================================= */
        const retainedIds = new Set(rows.map((row) => row.id));
        const idsToDelete = existingCredits
            .filter((credit) => !retainedIds.has(credit.id))
            .map((credit) => credit.id);
        if (idsToDelete.length > 0) {
            const { error: deleteError } = await supabaseAdmin
                .from(config.creditsTable)
                .delete()
                .eq(config.foreignKey, targetId)
                .in("id", idsToDelete);
            if (deleteError) {
                throw deleteError;
            }
        }
        /* =================================================
           RÉCUPÉRER LE RÉSULTAT FINAL
        ================================================= */
        const updatedCredits = await fetchCredits(config.creditsTable, config.foreignKey, targetId);
        res.json({
            success: true,
            credits: updatedCredits
        });
    }
    catch (error) {
        next(error);
    }
});
/* =========================================================
   EXPORT
========================================================= */
export default router;
