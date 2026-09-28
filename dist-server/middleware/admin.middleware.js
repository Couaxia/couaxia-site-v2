/* =========================================================
   COUAXIA — ADMIN MIDDLEWARE
========================================================= */
import { supabaseAdmin } from "../services/supabase-admin.service.js";
/* =========================================================
   REQUIRE ADMIN
========================================================= */
export async function requireAdmin(req, res, next) {
    try {
        /* =================================================
           AUTHORIZATION HEADER
        ================================================= */
        const authorization = req.headers.authorization;
        if (!authorization) {
            res
                .status(401)
                .json({
                success: false,
                error: "Authentification requise."
            });
            return;
        }
        /* =================================================
           BEARER TOKEN
        ================================================= */
        const [scheme, token] = authorization
            .trim()
            .split(/\s+/);
        if (scheme?.toLowerCase()
            !==
                "bearer"
            ||
                !token) {
            res
                .status(401)
                .json({
                success: false,
                error: "Token d'authentification invalide."
            });
            return;
        }
        /* =================================================
           VERIFY SUPABASE USER
        ================================================= */
        /*
         * On ne fait jamais confiance à un userId
         * envoyé par le navigateur.
         *
         * Supabase vérifie le JWT et nous retourne
         * l'utilisateur correspondant au token.
         */
        const { data: userData, error: userError } = await supabaseAdmin
            .auth
            .getUser(token);
        if (userError
            ||
                !userData.user) {
            res
                .status(401)
                .json({
                success: false,
                error: "Session invalide ou expirée."
            });
            return;
        }
        const user = userData.user;
        /* =================================================
           GET PROFILE
        ================================================= */
        const { data: profile, error: profileError } = await supabaseAdmin
            .from("profiles")
            .select(`
                    id,
                    username,
                    display_name,
                    role
                `)
            .eq("id", user.id)
            .maybeSingle();
        if (profileError) {
            console.error("Erreur vérification profil admin :", profileError);
            res
                .status(500)
                .json({
                success: false,
                error: "Impossible de vérifier les permissions."
            });
            return;
        }
        /* =================================================
           ROLE CHECK
        ================================================= */
        if (!profile
            ||
                profile.role
                    !==
                        "admin") {
            res
                .status(403)
                .json({
                success: false,
                error: "Accès administrateur requis."
            });
            return;
        }
        /* =================================================
           SAVE ADMIN IN REQUEST
        ================================================= */
        req.admin = {
            id: user.id,
            email: user.email
                ??
                    null,
            username: profile.username
                ??
                    null,
            displayName: profile.display_name
                ??
                    null,
            role: "admin"
        };
        /* =================================================
           ACCESS GRANTED
        ================================================= */
        next();
    }
    catch (error) {
        console.error("Erreur middleware administrateur :", error);
        res
            .status(500)
            .json({
            success: false,
            error: "Erreur lors de la vérification administrateur."
        });
    }
}
