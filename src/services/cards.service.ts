/* =========================================================
   SUPABASE
========================================================= */

import {
    supabase
} from "../lib/supabase";


/* =========================================================
   TYPES
========================================================= */

import type {
    Card,
    CardCategory,
    CardCollection,
    CardCollectionStats,
    CardPack,
    CardRarity,
    CardRarityConfig,
    UserCardWithDetails
} from "../types/card.types";


/* =========================================================
   DATABASE TYPES

   Les noms ici correspondent directement
   aux colonnes PostgreSQL / Supabase.
========================================================= */

interface DatabaseCard {

    id: string;

    number: number;

    name: string;

    description: string | null;

    rarity: CardRarity;

    category: CardCategory;

    image_url: string;

    back_image_url: string | null;

    artist: string | null;

    artist_url: string | null;

    weight: number;

    status:
        "draft"
        | "active"
        | "disabled";

    limited: boolean;

    available_from: string | null;

    available_until: string | null;

    reveal_sound_url: string | null;

    reveal_animation: string | null;

    created_at: string;

    updated_at: string;
}


interface DatabaseCardRarity {

    id: CardRarity;

    name: string;

    weight: number;

    color: string;

    secondary_color: string | null;

    reveal_sound_url: string | null;

    reveal_animation: string | null;
}


interface DatabaseCardPack {

    id: string;

    name: string;

    description: string | null;

    image_url: string | null;

    cards_per_pack: number;

    active: boolean;

    limited: boolean;

    available_from: string | null;

    available_until: string | null;

    created_at: string;

    updated_at: string;
}


interface DatabaseUserCard {

    id: string;

    user_id: string;

    card_id: string;

    quantity: number;

    first_obtained_at: string;

    last_obtained_at: string;

    cards:
        DatabaseCard
        | DatabaseCard[]
        | null;
}


/* =========================================================
   CARD MAPPER

   Supabase utilise :
       image_url
       created_at

   Vue utilise :
       imageUrl
       createdAt

   On fait la conversion ici pour que le reste
   du site n'ait jamais besoin de connaître
   les noms SQL.
========================================================= */

function mapCard(
    card: DatabaseCard
): Card {

    return {

        id:
            card.id,

        number:
            card.number,

        name:
            card.name,

        description:
            card.description,

        rarity:
            card.rarity,

        category:
            card.category,

        imageUrl:
            card.image_url,

        backImageUrl:
            card.back_image_url,

        artist:
            card.artist,

        artistUrl:
            card.artist_url,

        weight:
            card.weight,

        status:
            card.status,

        limited:
            card.limited,

        availableFrom:
            card.available_from,

        availableUntil:
            card.available_until,

        revealSoundUrl:
            card.reveal_sound_url,

        revealAnimation:
            card.reveal_animation,

        createdAt:
            card.created_at,

        updatedAt:
            card.updated_at

    };

}


/* =========================================================
   RARITY MAPPER
========================================================= */

function mapRarity(
    rarity: DatabaseCardRarity
): CardRarityConfig {

    return {

        id:
            rarity.id,

        name:
            rarity.name,

        weight:
            rarity.weight,

        color:
            rarity.color,

        secondaryColor:
            rarity.secondary_color,

        revealSoundUrl:
            rarity.reveal_sound_url,

        revealAnimation:
            rarity.reveal_animation

    };

}


/* =========================================================
   PACK MAPPER
========================================================= */

function mapPack(
    pack: DatabaseCardPack
): CardPack {

    return {

        id:
            pack.id,

        name:
            pack.name,

        description:
            pack.description,

        imageUrl:
            pack.image_url,

        cardsPerPack:
            pack.cards_per_pack,

        active:
            pack.active,

        limited:
            pack.limited,

        availableFrom:
            pack.available_from,

        availableUntil:
            pack.available_until,

        createdAt:
            pack.created_at,

        updatedAt:
            pack.updated_at

    };

}


/* =========================================================
   GET ALL CARDS

   RLS Supabase s'occupe déjà de cacher :
   - draft
   - disabled
   - cartes futures
   - cartes expirées
========================================================= */

export async function getCards():
    Promise<Card[]> {

    const {
        data,
        error
    } =
        await supabase
            .from("cards")
            .select("*")
            .order(
                "number",
                {
                    ascending:
                        true
                }
            );


    if (
        error
    ) {

        console.error(
            "[Cards] Impossible de récupérer les cartes :",
            error
        );

        throw new Error(
            "Impossible de récupérer les cartes."
        );

    }


    const cards =
        (
            data ??
            []
        ) as DatabaseCard[];


    return cards.map(
        mapCard
    );

}


/* =========================================================
   GET ONE CARD
========================================================= */

export async function getCardById(
    cardId: string
):
    Promise<Card | null> {

    const {
        data,
        error
    } =
        await supabase
            .from("cards")
            .select("*")
            .eq(
                "id",
                cardId
            )
            .maybeSingle();


    if (
        error
    ) {

        console.error(
            "[Cards] Impossible de récupérer la carte :",
            error
        );

        throw new Error(
            "Impossible de récupérer la carte."
        );

    }


    if (
        !data
    ) {

        return null;

    }


    return mapCard(
        data as DatabaseCard
    );

}


/* =========================================================
   GET CARD BY NUMBER

   Exemple :
       getCardByNumber(1)
========================================================= */

export async function getCardByNumber(
    cardNumber: number
):
    Promise<Card | null> {

    const {
        data,
        error
    } =
        await supabase
            .from("cards")
            .select("*")
            .eq(
                "number",
                cardNumber
            )
            .maybeSingle();


    if (
        error
    ) {

        console.error(
            "[Cards] Impossible de récupérer la carte :",
            error
        );

        throw new Error(
            "Impossible de récupérer la carte."
        );

    }


    if (
        !data
    ) {

        return null;

    }


    return mapCard(
        data as DatabaseCard
    );

}


/* =========================================================
   GET CARDS BY RARITY
========================================================= */

export async function getCardsByRarity(
    rarity: CardRarity
):
    Promise<Card[]> {

    const {
        data,
        error
    } =
        await supabase
            .from("cards")
            .select("*")
            .eq(
                "rarity",
                rarity
            )
            .order(
                "number",
                {
                    ascending:
                        true
                }
            );


    if (
        error
    ) {

        console.error(
            "[Cards] Impossible de filtrer les cartes :",
            error
        );

        throw new Error(
            "Impossible de récupérer les cartes."
        );

    }


    return (
        (
            data ??
            []
        ) as DatabaseCard[]
    ).map(
        mapCard
    );

}


/* =========================================================
   GET CARDS BY CATEGORY
========================================================= */

export async function getCardsByCategory(
    category: CardCategory
):
    Promise<Card[]> {

    const {
        data,
        error
    } =
        await supabase
            .from("cards")
            .select("*")
            .eq(
                "category",
                category
            )
            .order(
                "number",
                {
                    ascending:
                        true
                }
            );


    if (
        error
    ) {

        console.error(
            "[Cards] Impossible de filtrer les cartes :",
            error
        );

        throw new Error(
            "Impossible de récupérer les cartes."
        );

    }


    return (
        (
            data ??
            []
        ) as DatabaseCard[]
    ).map(
        mapCard
    );

}


/* =========================================================
   GET RARITIES
========================================================= */

export async function getCardRarities():
    Promise<CardRarityConfig[]> {

    const {
        data,
        error
    } =
        await supabase
            .from("card_rarities")
            .select("*")
            .order(
                "weight",
                {
                    ascending:
                        false
                }
            );


    if (
        error
    ) {

        console.error(
            "[Cards] Impossible de récupérer les raretés :",
            error
        );

        throw new Error(
            "Impossible de récupérer les raretés."
        );

    }


    return (
        (
            data ??
            []
        ) as DatabaseCardRarity[]
    ).map(
        mapRarity
    );

}


/* =========================================================
   GET PACKS
========================================================= */

export async function getCardPacks():
    Promise<CardPack[]> {

    const {
        data,
        error
    } =
        await supabase
            .from("card_packs")
            .select("*")
            .order(
                "created_at",
                {
                    ascending:
                        true
                }
            );


    if (
        error
    ) {

        console.error(
            "[Cards] Impossible de récupérer les packs :",
            error
        );

        throw new Error(
            "Impossible de récupérer les packs."
        );

    }


    return (
        (
            data ??
            []
        ) as DatabaseCardPack[]
    ).map(
        mapPack
    );

}


/* =========================================================
   GET ONE PACK
========================================================= */

export async function getCardPackById(
    packId: string
):
    Promise<CardPack | null> {

    const {
        data,
        error
    } =
        await supabase
            .from("card_packs")
            .select("*")
            .eq(
                "id",
                packId
            )
            .maybeSingle();


    if (
        error
    ) {

        console.error(
            "[Cards] Impossible de récupérer le pack :",
            error
        );

        throw new Error(
            "Impossible de récupérer le pack."
        );

    }


    if (
        !data
    ) {

        return null;

    }


    return mapPack(
        data as DatabaseCardPack
    );

}


/* =========================================================
   GET CURRENT USER
========================================================= */

async function getCurrentUserId():
    Promise<string | null> {

    const {
        data,
        error
    } =
        await supabase.auth.getUser();


    if (
        error
    ) {

        console.error(
            "[Cards] Impossible de récupérer l'utilisateur :",
            error
        );

        return null;

    }


    return (
        data.user?.id ??
        null
    );

}


/* =========================================================
   GET USER COLLECTION
========================================================= */

export async function getMyCardCollection():
    Promise<CardCollection | null> {

    const userId =
        await getCurrentUserId();


    if (
        !userId
    ) {

        return null;

    }


    /*
        Supabase récupère ici user_cards
        ainsi que la carte correspondante.

        La relation est possible grâce à :

        user_cards.card_id -> cards.id
    */

    const {
        data,
        error
    } =
        await supabase
            .from("user_cards")
            .select(`
                id,
                user_id,
                card_id,
                quantity,
                first_obtained_at,
                last_obtained_at,
                cards (
                    *
                )
            `)
            .eq(
                "user_id",
                userId
            )
            .order(
                "first_obtained_at",
                {
                    ascending:
                        true
                }
            );


    if (
        error
    ) {

        console.error(
            "[Cards] Impossible de récupérer la collection :",
            error
        );

        throw new Error(
            "Impossible de récupérer ta collection."
        );

    }


    const rows =
        (
            data ??
            []
        ) as unknown as DatabaseUserCard[];


    const userCards:
        UserCardWithDetails[] =
        [];


    for (
        const row of rows
    ) {

        /*
            Selon la génération de types Supabase,
            une relation peut être renvoyée
            comme objet ou tableau.

            On normalise donc le résultat.
        */

        const databaseCard =
            Array.isArray(
                row.cards
            )
                ?
                row.cards[0]
                :
                row.cards;


        if (
            !databaseCard
        ) {

            continue;

        }


        userCards.push(
            {

                id:
                    row.id,

                userId:
                    row.user_id,

                cardId:
                    row.card_id,

                quantity:
                    row.quantity,

                firstObtainedAt:
                    row.first_obtained_at,

                lastObtainedAt:
                    row.last_obtained_at,

                card:
                    mapCard(
                        databaseCard
                    )

            }
        );

    }


    /* =====================================================
       COLLECTION STATISTICS
    ===================================================== */

    const totalCopies =
        userCards.reduce(
            (
                total,
                userCard
            ) =>
                total +
                userCard.quantity,
            0
        );


    /*
        getCards() respecte RLS.

        Donc totalCards correspond aux cartes
        actuellement visibles/disponibles.
    */

    const availableCards =
        await getCards();


    const totalCards =
        availableCards.length;


    const uniqueCards =
        userCards.length;


    const completion =
        totalCards >
        0
            ?
            Number(
                (
                    (
                        uniqueCards /
                        totalCards
                    )
                    *
                    100
                ).toFixed(
                    1
                )
            )
            :
            0;


    const stats:
        CardCollectionStats =
        {

            uniqueCards,

            totalCards,

            totalCopies,

            completion

        };


    return {

        userId,

        cards:
            userCards,

        stats

    };

}


/* =========================================================
   DOES USER OWN CARD?
========================================================= */

export async function userOwnsCard(
    cardId: string
):
    Promise<boolean> {

    const userId =
        await getCurrentUserId();


    if (
        !userId
    ) {

        return false;

    }


    const {
        data,
        error
    } =
        await supabase
            .from("user_cards")
            .select("id")
            .eq(
                "user_id",
                userId
            )
            .eq(
                "card_id",
                cardId
            )
            .maybeSingle();


    if (
        error
    ) {

        console.error(
            "[Cards] Vérification impossible :",
            error
        );

        return false;

    }


    return Boolean(
        data
    );

}


/* =========================================================
   GET CARD QUANTITY
========================================================= */

export async function getMyCardQuantity(
    cardId: string
):
    Promise<number> {

    const userId =
        await getCurrentUserId();


    if (
        !userId
    ) {

        return 0;

    }


    const {
        data,
        error
    } =
        await supabase
            .from("user_cards")
            .select("quantity")
            .eq(
                "user_id",
                userId
            )
            .eq(
                "card_id",
                cardId
            )
            .maybeSingle();


    if (
        error
    ) {

        console.error(
            "[Cards] Quantité impossible à récupérer :",
            error
        );

        return 0;

    }


    return (
        data?.quantity ??
        0
    );

}