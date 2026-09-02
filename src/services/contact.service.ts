import {
    supabase
} from "../lib/supabase";


/* =========================================================
   TYPES
========================================================= */

export type ContactIdentity =
    | "individual"
    | "creator"
    | "vtuber"
    | "artist"
    | "association"
    | "company"
    | "studio"
    | "media"
    | "other";


export type ContactReason =
    | "event"
    | "collaboration"
    | "moderation"
    | "sponsorship"
    | "art"
    | "game"
    | "media"
    | "community"
    | "report"
    | "other";


export type ContactStatus =
    | "new"
    | "read"
    | "to_reply"
    | "replied"
    | "archived";


export type ContactLocale =
    | "fr"
    | "en";


export type ContactPreference =
    | "email"
    | "discord"
    | "either";


/* =========================================================
   CONTACT REQUEST
========================================================= */

export interface ContactRequest {

    id:
        string;

    user_id:
        string | null;

    name:
        string;

    email:
        string;

    identity:
        ContactIdentity;

    reason:
        ContactReason;

    subject:
        string;

    message:
        string;

    links:
        string | null;

    contact_preference:
        ContactPreference;

    discord_username:
        string | null;

    locale:
        ContactLocale;

    status:
        ContactStatus;

    is_read:
        boolean;

    admin_note:
        string | null;

    created_at:
        string;

    updated_at:
        string;

}


/* =========================================================
   CREATE PAYLOAD
========================================================= */

export interface CreateContactRequestPayload {

    name:
        string;

    email:
        string;

    identity:
        ContactIdentity;

    reason:
        ContactReason;

    subject:
        string;

    message:
        string;

    links?:
        string | null;

    contact_preference:
        ContactPreference;

    discord_username?:
        string | null;

    locale:
        ContactLocale;

}


/* =========================================================
   NORMALIZE STRING
========================================================= */

function normalizeString(
    value:
        string
):
    string {

    return value.trim();

}


/* =========================================================
   NORMALIZE OPTIONAL STRING
========================================================= */

function normalizeOptionalString(
    value:
        string | null | undefined
):
    string | null {

    if (
        !value
    ) {

        return null;

    }


    const normalized =
        value.trim();


    return normalized
        ||
        null;

}


/* =========================================================
   EMAIL VALIDATION
========================================================= */

function isValidEmail(
    email:
        string
):
    boolean {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(
            email.trim()
        );

}


/* =========================================================
   CREATE CONTACT REQUEST
========================================================= */

export async function createContactRequest(
    payload:
        CreateContactRequestPayload
):
    Promise<ContactRequest> {

    /* =====================================================
       NORMALIZE
    ===================================================== */

    const name =
        normalizeString(
            payload.name
        );


    const email =
        normalizeString(
            payload.email
        )
            .toLowerCase();


    const subject =
        normalizeString(
            payload.subject
        );


    const message =
        normalizeString(
            payload.message
        );


    const links =
        normalizeOptionalString(
            payload.links
        );


    const discordUsername =
        normalizeOptionalString(
            payload.discord_username
        );


    /* =====================================================
       VALIDATION — NAME
    ===================================================== */

    if (
        !name
    ) {

        throw new Error(
            "Le nom ou pseudo est obligatoire."
        );

    }


    if (
        name.length >
        80
    ) {

        throw new Error(
            "Le nom ou pseudo est trop long."
        );

    }


    /* =====================================================
       VALIDATION — EMAIL
    ===================================================== */

    if (
        !email
        ||
        !isValidEmail(
            email
        )
    ) {

        throw new Error(
            "L'adresse e-mail est invalide."
        );

    }


    if (
        email.length >
        160
    ) {

        throw new Error(
            "L'adresse e-mail est trop longue."
        );

    }


    /* =====================================================
       VALIDATION — SUBJECT
    ===================================================== */

    if (
        !subject
    ) {

        throw new Error(
            "L'objet est obligatoire."
        );

    }


    if (
        subject.length >
        180
    ) {

        throw new Error(
            "L'objet est trop long."
        );

    }


    /* =====================================================
       VALIDATION — MESSAGE
    ===================================================== */

    if (
        !message
    ) {

        throw new Error(
            "Le message est obligatoire."
        );

    }


    if (
        message.length >
        5000
    ) {

        throw new Error(
            "Le message est trop long."
        );

    }


    /* =====================================================
       VALIDATION — LINKS
    ===================================================== */

    if (
        links
        &&
        links.length >
        1500
    ) {

        throw new Error(
            "La liste de liens est trop longue."
        );

    }


    /* =====================================================
       VALIDATION — CONTACT PREFERENCE
    ===================================================== */

    if (
        ![
            "email",
            "discord",
            "either"
        ].includes(
            payload.contact_preference
        )
    ) {

        throw new Error(
            "Le moyen de contact sélectionné est invalide."
        );

    }


    /* =====================================================
       VALIDATION — DISCORD
    ===================================================== */

    if (
        (
            payload.contact_preference
            ===
            "discord"
            ||
            payload.contact_preference
            ===
            "either"
        )
        &&
        !discordUsername
    ) {

        throw new Error(
            "Le pseudo Discord est obligatoire pour ce moyen de contact."
        );

    }


    if (
        discordUsername
        &&
        discordUsername.length >
        100
    ) {

        throw new Error(
            "Le pseudo Discord est trop long."
        );

    }


    /* =====================================================
       CURRENT USER
    ===================================================== */

    const {
        data: {
            user
        },
        error:
            userError
    } =
        await supabase
            .auth
            .getUser();


    if (
        userError
    ) {

        console.warn(
            "Impossible de récupérer l'utilisateur connecté :",
            userError
        );

    }


    /* =====================================================
       INSERT
    ===================================================== */

    const {
        data,
        error
    } =
        await supabase
            .from(
                "contact_requests"
            )
            .insert({
                user_id:
                    user?.id
                    ??
                    null,

                name,

                email,

                identity:
                    payload.identity,

                reason:
                    payload.reason,

                subject,

                message,

                links,

                contact_preference:
                    payload.contact_preference,

                discord_username:
                    discordUsername,

                locale:
                    payload.locale,

                status:
                    "new",

                is_read:
                    false
            })
            .select(`
                id,
                user_id,
                name,
                email,
                identity,
                reason,
                subject,
                message,
                links,
                contact_preference,
                discord_username,
                locale,
                status,
                is_read,
                admin_note,
                created_at,
                updated_at
            `)
            .single();


    /* =====================================================
       ERROR
    ===================================================== */

    if (
        error
    ) {

        console.error(
            "Erreur création demande de contact :",
            error
        );


        throw new Error(
            error.message
            ||
            "Impossible d'envoyer la demande de contact."
        );

    }


    if (
        !data
    ) {

        throw new Error(
            "La demande a été envoyée mais aucune donnée n'a été retournée."
        );

    }


    /* =====================================================
       SUCCESS
    ===================================================== */

    return data as ContactRequest;

}


/* =========================================================
   GET MY CONTACT REQUESTS
========================================================= */

export async function getMyContactRequests():
    Promise<ContactRequest[]> {

    /* =====================================================
       CURRENT USER
    ===================================================== */

    const {
        data: {
            user
        },
        error:
            userError
    } =
        await supabase
            .auth
            .getUser();


    if (
        userError
    ) {

        console.error(
            "Erreur récupération utilisateur contact :",
            userError
        );


        throw userError;

    }


    if (
        !user
    ) {

        return [];

    }


    /* =====================================================
       SELECT
    ===================================================== */

    const {
        data,
        error
    } =
        await supabase
            .from(
                "contact_requests"
            )
            .select(`
                id,
                user_id,
                name,
                email,
                identity,
                reason,
                subject,
                message,
                links,
                contact_preference,
                discord_username,
                locale,
                status,
                is_read,
                admin_note,
                created_at,
                updated_at
            `)
            .eq(
                "user_id",
                user.id
            )
            .order(
                "created_at",
                {
                    ascending:
                        false
                }
            );


    /* =====================================================
       ERROR
    ===================================================== */

    if (
        error
    ) {

        console.error(
            "Erreur récupération demandes de contact :",
            error
        );


        throw error;

    }


    /* =====================================================
       SUCCESS
    ===================================================== */

    return (
        data
        ??
        []
    ) as ContactRequest[];

}