/* =========================================================
   COUAXIA - ARTIST CREDITS SERVICE
   Gestion des crédits artistiques

   Tables Supabase :
   - artwork_credits
   - card_artists

   Sécurité :
   - Authentification Supabase
   - API backend protégée
   - Aucune clé service_role côté navigateur
========================================================= */

import { supabase } from "../lib/supabase";

import type {
    ArtistCredit,
    ArtistCreditLink
} from "../types/artist-credit.types";


/* =========================================================
   CONFIGURATION API
========================================================= */

const API_URL = (
    import.meta.env.VITE_API_URL ??
    "http://localhost:10000"
).replace(/\/$/, "");

const API_BASE = `${API_URL}/api/admin/artist-credits`;


/* =========================================================
   TYPES
========================================================= */

export type ArtistCreditTarget = "artwork" | "card";

interface ArtistCreditRow {
    id: string;

    artist_name: string;

    contribution: string | null;

    links: unknown;

    sort_order: number;
}

interface ArtistCreditsResponse {
    credits: ArtistCreditRow[];
}

interface SaveArtistCreditsResponse {
    success: boolean;

    credits: ArtistCreditRow[];
}


/* =========================================================
   AUTHENTIFICATION
========================================================= */

async function getAccessToken(): Promise<string> {
    const {
        data: { session },
        error
    } = await supabase.auth.getSession();

    if (error) {
        throw new Error(
            "Impossible de récupérer la session utilisateur."
        );
    }

    if (!session?.access_token) {
        throw new Error(
            "Tu dois être connecté pour gérer les crédits artistiques."
        );
    }

    return session.access_token;
}


/* =========================================================
   REQUÊTES API ADMIN
========================================================= */

async function artistCreditsFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = await getAccessToken();

    const headers = new Headers(options.headers);

    headers.set(
        "Authorization",
        `Bearer ${token}`
    );

    if (options.body !== undefined) {
        headers.set(
            "Content-Type",
            "application/json"
        );
    }

    let response: Response;

    try {
        response = await fetch(
            `${API_BASE}${endpoint}`,
            {
                ...options,
                headers
            }
        );
    } catch {
        throw new Error(
            "Impossible de contacter le serveur des crédits artistiques."
        );
    }

    if (!response.ok) {
        const result: unknown = await response
            .json()
            .catch(() => null);

        let message = "Une erreur est survenue.";

        if (
            result !== null &&
            typeof result === "object" &&
            "error" in result &&
            typeof result.error === "string"
        ) {
            message = result.error;
        }

        if (response.status === 401) {
            throw new Error(
                "Ta session a expiré. Reconnecte-toi."
            );
        }

        if (response.status === 403) {
            throw new Error(
                "Tu n'as pas les permissions administrateur."
            );
        }

        throw new Error(message);
    }

    return response.json() as Promise<T>;
}


/* =========================================================
   VALIDATION DES IDENTIFIANTS
========================================================= */

function validateTarget(
    target: ArtistCreditTarget,
    targetId: string
): void {
    if (
        target !== "artwork" &&
        target !== "card"
    ) {
        throw new Error(
            "Type de crédit artistique invalide."
        );
    }

    const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidPattern.test(targetId)) {
        throw new Error(
            "Identifiant de l'illustration ou de la carte invalide."
        );
    }
}


/* =========================================================
   NORMALISATION DES LIENS
========================================================= */

function normalizeLinks(
    value: unknown
): ArtistCreditLink[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .filter(
            (link): link is Record<string, unknown> =>
                link !== null &&
                typeof link === "object" &&
                !Array.isArray(link)
        )
        .map((link) => ({
            label:
                typeof link.label === "string"
                    ? link.label
                    : "",

            url:
                typeof link.url === "string"
                    ? link.url
                    : ""
        }));
}


/* =========================================================
   CONVERSION SUPABASE → VUE
========================================================= */

function mapArtistCredit(
    row: ArtistCreditRow
): ArtistCredit {
    return {
        id: row.id,

        artistName: row.artist_name,

        contribution: row.contribution ?? "",

        links: normalizeLinks(row.links),

        sortOrder: row.sort_order
    };
}


/* =========================================================
   NORMALISATION AVANT SAUVEGARDE
========================================================= */

function prepareCredits(
    credits: ArtistCredit[]
): ArtistCredit[] {
    return credits.map((credit, index) => {
        const artistName = credit.artistName.trim();

        const contribution =
            credit.contribution.trim();

        if (!artistName) {
            throw new Error(
                `Le nom de l'artiste ${index + 1} est obligatoire si tu ajoutes un crédit.`
            );
        }

        const links = credit.links.map(
            (link, linkIndex) => {
                const label = link.label.trim();

                const url = link.url.trim();

                if (!label && !url) {
                    return null;
                }

                if (!url) {
                    throw new Error(
                        `Le lien ${linkIndex + 1} de l'artiste "${artistName}" n'a pas d'URL.`
                    );
                }

                let parsedUrl: URL;

                try {
                    parsedUrl = new URL(url);
                } catch {
                    throw new Error(
                        `L'URL "${url}" n'est pas valide.`
                    );
                }

                if (
                    parsedUrl.protocol !== "https:" &&
                    parsedUrl.protocol !== "http:"
                ) {
                    throw new Error(
                        "Seuls les liens HTTP et HTTPS sont autorisés."
                    );
                }

                return {
                    label: label || "Lien",
                    url: parsedUrl.toString()
                };
            }
        ).filter(
            (link): link is ArtistCreditLink =>
                link !== null
        );

        return {
            ...(credit.id
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
   RÉCUPÉRER LES CRÉDITS
========================================================= */

/**
 * Récupère les crédits d'une illustration ou d'une carte.
 *
 * Exemple :
 * getArtistCredits("artwork", artworkId)
 *
 * getArtistCredits("card", cardId)
 */
export async function getArtistCredits(
    target: ArtistCreditTarget,
    targetId: string
): Promise<ArtistCredit[]> {
    validateTarget(target, targetId);

    const result =
        await artistCreditsFetch<ArtistCreditsResponse>(
            `/${target}/${encodeURIComponent(targetId)}`
        );

    return result.credits.map(mapArtistCredit);
}


/* =========================================================
   ENREGISTRER LES CRÉDITS
========================================================= */

/**
 * Remplace les crédits associés à une illustration
 * ou à une carte par la liste fournie.
 *
 * [] signifie : aucun crédit.
 *
 * La sauvegarde réelle sera gérée côté serveur.
 */
export async function saveArtistCredits(
    target: ArtistCreditTarget,
    targetId: string,
    credits: ArtistCredit[]
): Promise<ArtistCredit[]> {
    validateTarget(target, targetId);

    const preparedCredits = prepareCredits(credits);

    const result =
        await artistCreditsFetch<SaveArtistCreditsResponse>(
            `/${target}/${encodeURIComponent(targetId)}`,
            {
                method: "PUT",

                body: JSON.stringify({
                    credits: preparedCredits
                })
            }
        );

    return result.credits.map(mapArtistCredit);
}


/* =========================================================
   RACCOURCIS - ARTWORKS
========================================================= */

/**
 * Récupérer les crédits d'une illustration.
 */
export async function getArtworkCredits(
    artworkId: string
): Promise<ArtistCredit[]> {
    return getArtistCredits(
        "artwork",
        artworkId
    );
}


/**
 * Enregistrer les crédits d'une illustration.
 */
export async function saveArtworkCredits(
    artworkId: string,
    credits: ArtistCredit[]
): Promise<ArtistCredit[]> {
    return saveArtistCredits(
        "artwork",
        artworkId,
        credits
    );
}


/* =========================================================
   RACCOURCIS - CARTES
========================================================= */

/**
 * Récupérer les crédits d'une carte.
 */
export async function getCardArtistCredits(
    cardId: string
): Promise<ArtistCredit[]> {
    return getArtistCredits(
        "card",
        cardId
    );
}


/**
 * Enregistrer les crédits d'une carte.
 */
export async function saveCardArtistCredits(
    cardId: string,
    credits: ArtistCredit[]
): Promise<ArtistCredit[]> {
    return saveArtistCredits(
        "card",
        cardId,
        credits
    );
}