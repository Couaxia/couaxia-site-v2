/* =========================================================
   IMPORTS
========================================================= */

import type {
    Card,
    CardCategory,
    CardRarity,
    CardStatus
} from "../types/card.types";

import {
    supabase
} from "../lib/supabase";


/* =========================================================
   API URL

   En local :
   VITE_API_URL=http://localhost:3000

   En production :
   VITE_API_URL=https://couaxia-hmbf.onrender.com
========================================================= */

const API_URL =
    import.meta.env.VITE_API_URL ??
    "http://localhost:3000";


/* =========================================================
   CARD ADMIN INPUT
========================================================= */

export interface CardAdminInput {

    number:
        number;

    name:
        string;

    description:
        string | null;

    rarity:
        CardRarity;

    category:
        CardCategory;

    imageUrl:
        string;

    backImageUrl:
        string | null;

    artist:
        string | null;

    artistUrl:
        string | null;

    weight:
        number;

    status:
        CardStatus;

    limited:
        boolean;

    availableFrom:
        string | null;

    availableUntil:
        string | null;

    revealSoundUrl:
        string | null;

    revealAnimation:
        string | null;

}


/* =========================================================
   IMAGEKIT UPLOAD RESULT
========================================================= */

export interface CardImageUploadResult {

    fileId:
        string;

    name:
        string;

    url:
        string;

    filePath:
        string;

    thumbnailUrl:
        string | null;

    size:
        number;

}


/* =========================================================
   API RESPONSE
========================================================= */

interface ApiResponse<T> {

    success:
        boolean;

    data?:
        T;

    error?:
        string;

}


/* =========================================================
   API ERROR
========================================================= */

function getErrorMessage(
    value: unknown
): string {

    if (
        typeof value === "object"
        &&
        value !== null
        &&
        "error" in value
        &&
        typeof (
            value as {
                error?: unknown;
            }
        ).error === "string"
    ) {

        return (
            value as {
                error: string;
            }
        ).error;

    }

    return "Une erreur est survenue.";

}


/* =========================================================
   GET SESSION
========================================================= */

async function getAccessToken():
    Promise<string> {

    const {
        data: {
            session
        },
        error
    } =
        await supabase
            .auth
            .getSession();


    if (
        error
        ||
        !session
    ) {

        throw new Error(
            "Tu dois être connectée pour accéder à l'administration."
        );

    }


    return session.access_token;

}


/* =========================================================
   ADMIN FETCH
========================================================= */

async function adminFetch<T>(
    path: string,
    options:
        RequestInit = {}
): Promise<T> {

    const accessToken =
        await getAccessToken();


    const headers =
        new Headers(
            options.headers
        );


    /*
     * Toutes les routes utilisées ici envoient actuellement
     * du JSON.
     */
    if (
        options.body
        &&
        !headers.has(
            "Content-Type"
        )
    ) {

        headers.set(
            "Content-Type",
            "application/json"
        );

    }


    headers.set(
        "Authorization",
        `Bearer ${accessToken}`
    );


    const response =
        await fetch(
            `${API_URL}${path}`,
            {
                ...options,
                headers
            }
        );


    let body:
        unknown = null;


    try {

        body =
            await response.json();

    }
    catch {

        body =
            null;

    }


    if (
        !response.ok
    ) {

        throw new Error(
            getErrorMessage(
                body
            )
        );

    }


    const result =
        body as ApiResponse<T>;


    if (
        !result.success
    ) {

        throw new Error(
            result.error
            ??
            "Une erreur est survenue."
        );

    }


    if (
        result.data === undefined
    ) {

        throw new Error(
            "Réponse invalide du serveur."
        );

    }


    return result.data;

}


/* =========================================================
   FILE -> BASE64
========================================================= */

function fileToBase64(
    file: File
): Promise<string> {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const reader =
                new FileReader();


            reader.onload =
                () => {

                    if (
                        typeof reader.result
                        !==
                        "string"
                    ) {

                        reject(
                            new Error(
                                "Impossible de lire l'image."
                            )
                        );

                        return;

                    }


                    /*
                     * FileReader retourne :
                     *
                     * data:image/png;base64,AAAA...
                     *
                     * Le serveur a uniquement besoin de la partie
                     * située après la virgule.
                     */
                    const base64 =
                        reader.result
                            .split(",")[1];


                    if (
                        !base64
                    ) {

                        reject(
                            new Error(
                                "Le fichier n'a pas pu être converti."
                            )
                        );

                        return;

                    }


                    resolve(
                        base64
                    );

                };


            reader.onerror =
                () => {

                    reject(
                        new Error(
                            "Impossible de lire le fichier."
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* =========================================================
   VALIDATE CARD IMAGE
========================================================= */

function validateCardImage(
    file: File
): void {

    const allowedTypes = [

        "image/png",
        "image/jpeg",
        "image/webp",
        "image/gif"

    ];


    if (
        !allowedTypes.includes(
            file.type
        )
    ) {

        throw new Error(
            "Format non autorisé. Utilise PNG, JPG, WEBP ou GIF."
        );

    }


    const maxSize =
        10
        *
        1024
        *
        1024;


    if (
        file.size > maxSize
    ) {

        throw new Error(
            "L'image ne peut pas dépasser 10 Mo."
        );

    }

}


/* =========================================================
   UPLOAD CARD IMAGE TO IMAGEKIT
========================================================= */

export async function uploadCardImage(
    file: File,
    type:
        "artwork" | "back" = "artwork"
):
    Promise<CardImageUploadResult> {

    validateCardImage(
        file
    );


    const base64 =
        await fileToBase64(
            file
        );


    return adminFetch<CardImageUploadResult>(
        "/api/admin/cards/upload",
        {

            method:
                "POST",

            body:
                JSON.stringify(
                    {

                        file:
                            base64,

                        fileName:
                            file.name,

                        mimeType:
                            file.type,

                        type

                    }
                )

        }
    );

}


/* =========================================================
   GET ADMIN CARDS
========================================================= */

export async function getAdminCards():
    Promise<Card[]> {

    return adminFetch<Card[]>(
        "/api/admin/cards"
    );

}


/* =========================================================
   GET NEXT CARD NUMBER
========================================================= */

export async function getNextCardNumber():
    Promise<number> {

    const result =
        await adminFetch<{
            number: number;
        }>(
            "/api/admin/cards/next-number"
        );


    return result.number;

}


/* =========================================================
   GET ONE CARD
========================================================= */

export async function getAdminCard(
    cardId: string
):
    Promise<Card> {

    return adminFetch<Card>(
        `/api/admin/cards/${encodeURIComponent(
            cardId
        )}`
    );

}


/* =========================================================
   CREATE CARD
========================================================= */

export async function createCard(
    input: CardAdminInput
):
    Promise<Card> {

    return adminFetch<Card>(
        "/api/admin/cards",
        {

            method:
                "POST",

            body:
                JSON.stringify(
                    input
                )

        }
    );

}


/* =========================================================
   UPDATE CARD
========================================================= */

export async function updateCard(
    cardId: string,
    input: CardAdminInput
):
    Promise<Card> {

    return adminFetch<Card>(
        `/api/admin/cards/${encodeURIComponent(
            cardId
        )}`,
        {

            method:
                "PUT",

            body:
                JSON.stringify(
                    input
                )

        }
    );

}


/* =========================================================
   CHANGE STATUS
========================================================= */

export async function updateCardStatus(
    cardId: string,
    status: CardStatus
):
    Promise<Card> {

    return adminFetch<Card>(
        `/api/admin/cards/${encodeURIComponent(
            cardId
        )}/status`,
        {

            method:
                "PATCH",

            body:
                JSON.stringify(
                    {
                        status
                    }
                )

        }
    );

}


/* =========================================================
   DELETE CARD
========================================================= */

export async function deleteCard(
    cardId: string
):
    Promise<{
        id: string;
    }> {

    return adminFetch<{
        id: string;
    }>(
        `/api/admin/cards/${encodeURIComponent(
            cardId
        )}`,
        {
            method:
                "DELETE"
        }
    );

}