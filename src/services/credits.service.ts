import {
    supabase
} from "../lib/supabase";


/* =========================================================
   TYPES
========================================================= */

export interface CreditRow {

    id:
        string;

    art_id:
        string;

    artist:
        string;

    artist_role:
        string | null;

    description:
        string | null;

    image_url:
        string;

    image_alt:
        string | null;

    media_type:
        string;

    tags:
        string[] | null;

    image_messages:
        string[] | null;

    artist_url:
        string | null;

    button_text:
        string;

    button_messages:
        string[] | null;

    sensitive:
        boolean;

    favorite_enabled:
        boolean;

    visible:
        boolean;

    sort_order:
        number;

    created_at:
        string;

    updated_at:
        string;

}


/* =========================================================
   GET CREDITS
========================================================= */

export async function getCredits():
    Promise<CreditRow[]> {

    const {
        data,
        error
    } =
        await supabase
            .from(
                "artworks"
            )
            .select(`
                id,
                art_id,
                artist,
                artist_role,
                description,
                image_url,
                image_alt,
                media_type,
                tags,
                image_messages,
                artist_url,
                button_text,
                button_messages,
                sensitive,
                favorite_enabled,
                visible,
                sort_order,
                created_at,
                updated_at
            `)
            .eq(
                "visible",
                true
            )
            .order(
                "sort_order",
                {
                    ascending:
                        true
                }
            )
            .order(
                "created_at",
                {
                    ascending:
                        true
                }
            );


    /* =====================================================
       ERROR
    ===================================================== */

    if (
        error
    ) {

        console.error(
            "❌ Supabase credits error:",
            {
                message:
                    error.message,

                details:
                    error.details,

                hint:
                    error.hint,

                code:
                    error.code
            }
        );


        throw new Error(
            `Impossible de récupérer les crédits : ${error.message}`
        );

    }


    /* =====================================================
       SUCCESS
    ===================================================== */

    console.log(
        "✅ Crédits Supabase :",
        data
    );


    return (
        data
        ??
        []
    ) as CreditRow[];

}