/* =========================================================
   VUE
========================================================= */

import {
    computed,
    readonly,
    ref
} from "vue";


/* =========================================================
   SERVICES
========================================================= */

import {
    getCardById,
    getCardPacks,
    getCardRarities,
    getCards,
    getMyCardCollection
} from "../services/cards.service";


/* =========================================================
   TYPES
========================================================= */

import type {
    Card,
    CardCategory,
    CardCollection,
    CardFilters,
    CardPack,
    CardRarity,
    CardRarityConfig,
    CardSort
} from "../types/card.types";


/* =========================================================
   GLOBAL STATE

   Ces refs sont volontairement placées en dehors
   de useCards().

   Résultat :
   Cards.vue, Profile.vue et les autres composants
   partagent le même état.
========================================================= */

const cards =
    ref<Card[]>([]);


const rarities =
    ref<CardRarityConfig[]>([]);


const packs =
    ref<CardPack[]>([]);


const collection =
    ref<CardCollection | null>(
        null
    );


const selectedCard =
    ref<Card | null>(
        null
    );


/* =========================================================
   LOADING STATES
========================================================= */

const cardsLoading =
    ref(false);


const raritiesLoading =
    ref(false);


const packsLoading =
    ref(false);


const collectionLoading =
    ref(false);


const selectedCardLoading =
    ref(false);


/* =========================================================
   ERRORS
========================================================= */

const cardsError =
    ref<string | null>(
        null
    );


const raritiesError =
    ref<string | null>(
        null
    );


const packsError =
    ref<string | null>(
        null
    );


const collectionError =
    ref<string | null>(
        null
    );


const selectedCardError =
    ref<string | null>(
        null
    );


/* =========================================================
   FILTERS
========================================================= */

const filters =
    ref<CardFilters>(
        {

            search:
                "",

            rarity:
                "all",

            category:
                "all",

            limited:
                undefined,

            owned:
                undefined

        }
    );


/* =========================================================
   SORT
========================================================= */

const sort =
    ref<CardSort>(
        "number-asc"
    );


/* =========================================================
   INITIALIZED STATES
========================================================= */

const cardsLoaded =
    ref(false);


const raritiesLoaded =
    ref(false);


const packsLoaded =
    ref(false);


const collectionLoaded =
    ref(false);


/* =========================================================
   LOAD CARDS
========================================================= */

async function loadCards(
    force = false
) {

    /*
        Évite de refaire une requête inutile
        si les cartes sont déjà chargées.
    */

    if (
        cardsLoaded.value
        &&
        !force
    ) {

        return cards.value;

    }


    if (
        cardsLoading.value
    ) {

        return cards.value;

    }


    cardsLoading.value =
        true;


    cardsError.value =
        null;


    try {

        cards.value =
            await getCards();


        cardsLoaded.value =
            true;


        return cards.value;

    }
    catch (
        error
    ) {

        console.error(
            "[useCards] loadCards :",
            error
        );


        cardsError.value =
            error instanceof Error
                ?
                error.message
                :
                "Impossible de charger les cartes.";


        return [];

    }
    finally {

        cardsLoading.value =
            false;

    }

}


/* =========================================================
   LOAD RARITIES
========================================================= */

async function loadRarities(
    force = false
) {

    if (
        raritiesLoaded.value
        &&
        !force
    ) {

        return rarities.value;

    }


    if (
        raritiesLoading.value
    ) {

        return rarities.value;

    }


    raritiesLoading.value =
        true;


    raritiesError.value =
        null;


    try {

        rarities.value =
            await getCardRarities();


        raritiesLoaded.value =
            true;


        return rarities.value;

    }
    catch (
        error
    ) {

        console.error(
            "[useCards] loadRarities :",
            error
        );


        raritiesError.value =
            error instanceof Error
                ?
                error.message
                :
                "Impossible de charger les raretés.";


        return [];

    }
    finally {

        raritiesLoading.value =
            false;

    }

}


/* =========================================================
   LOAD PACKS
========================================================= */

async function loadPacks(
    force = false
) {

    if (
        packsLoaded.value
        &&
        !force
    ) {

        return packs.value;

    }


    if (
        packsLoading.value
    ) {

        return packs.value;

    }


    packsLoading.value =
        true;


    packsError.value =
        null;


    try {

        packs.value =
            await getCardPacks();


        packsLoaded.value =
            true;


        return packs.value;

    }
    catch (
        error
    ) {

        console.error(
            "[useCards] loadPacks :",
            error
        );


        packsError.value =
            error instanceof Error
                ?
                error.message
                :
                "Impossible de charger les packs.";


        return [];

    }
    finally {

        packsLoading.value =
            false;

    }

}


/* =========================================================
   LOAD COLLECTION
========================================================= */

async function loadCollection(
    force = false
) {

    if (
        collectionLoaded.value
        &&
        !force
    ) {

        return collection.value;

    }


    if (
        collectionLoading.value
    ) {

        return collection.value;

    }


    collectionLoading.value =
        true;


    collectionError.value =
        null;


    try {

        collection.value =
            await getMyCardCollection();


        collectionLoaded.value =
            true;


        return collection.value;

    }
    catch (
        error
    ) {

        console.error(
            "[useCards] loadCollection :",
            error
        );


        collectionError.value =
            error instanceof Error
                ?
                error.message
                :
                "Impossible de charger la collection.";


        return null;

    }
    finally {

        collectionLoading.value =
            false;

    }

}


/* =========================================================
   LOAD ONE CARD
========================================================= */

async function loadCard(
    cardId: string
) {

    selectedCardLoading.value =
        true;


    selectedCardError.value =
        null;


    try {

        /*
            On regarde d'abord si la carte
            existe déjà dans le cache.
        */

        const existingCard =
            cards.value.find(
                (
                    card
                ) =>
                    card.id ===
                    cardId
            );


        if (
            existingCard
        ) {

            selectedCard.value =
                existingCard;


            return existingCard;

        }


        /*
            Sinon on interroge Supabase.
        */

        selectedCard.value =
            await getCardById(
                cardId
            );


        return selectedCard.value;

    }
    catch (
        error
    ) {

        console.error(
            "[useCards] loadCard :",
            error
        );


        selectedCardError.value =
            error instanceof Error
                ?
                error.message
                :
                "Impossible de charger cette carte.";


        selectedCard.value =
            null;


        return null;

    }
    finally {

        selectedCardLoading.value =
            false;

    }

}


/* =========================================================
   LOAD EVERYTHING NEEDED FOR CARDS PAGE
========================================================= */

async function initializeCards() {

    /*
        Les trois requêtes sont indépendantes,
        donc on les lance en parallèle.
    */

    await Promise.all(
        [
            loadCards(),
            loadRarities(),
            loadPacks()
        ]
    );

}


/* =========================================================
   LOAD EVERYTHING FOR COLLECTION
========================================================= */

async function initializeCollection() {

    await Promise.all(
        [
            loadCards(),
            loadRarities(),
            loadCollection()
        ]
    );

}


/* =========================================================
   OWNED CARD IDS
========================================================= */

const ownedCardIds =
    computed<Set<string>>(
        () => {

            if (
                !collection.value
            ) {

                return new Set();

            }


            return new Set(
                collection.value.cards.map(
                    (
                        userCard
                    ) =>
                        userCard.cardId
                )
            );

        }
    );


/* =========================================================
   FILTERED CARDS
========================================================= */

const filteredCards =
    computed<Card[]>(
        () => {

            let result =
                [
                    ...cards.value
                ];


            /* -------------------------------------------------
               SEARCH
            ------------------------------------------------- */

            const search =
                filters.value.search
                    ?.trim()
                    .toLocaleLowerCase(
                        "fr-FR"
                    );


            if (
                search
            ) {

                result =
                    result.filter(
                        (
                            card
                        ) => {

                            const number =
                                String(
                                    card.number
                                )
                                    .padStart(
                                        3,
                                        "0"
                                    );


                            return (
                                card.name
                                    .toLocaleLowerCase(
                                        "fr-FR"
                                    )
                                    .includes(
                                        search
                                    )
                                ||
                                (
                                    card.description
                                        ?.toLocaleLowerCase(
                                            "fr-FR"
                                        )
                                        .includes(
                                            search
                                        )
                                    ??
                                    false
                                )
                                ||
                                number.includes(
                                    search.replace(
                                        "#",
                                        ""
                                    )
                                )
                            );

                        }
                    );

            }


            /* -------------------------------------------------
               RARITY
            ------------------------------------------------- */

            if (
                filters.value.rarity
                &&
                filters.value.rarity !==
                "all"
            ) {

                const rarity =
                    filters.value.rarity;


                result =
                    result.filter(
                        (
                            card
                        ) =>
                            card.rarity ===
                            rarity
                    );

            }


            /* -------------------------------------------------
               CATEGORY
            ------------------------------------------------- */

            if (
                filters.value.category
                &&
                filters.value.category !==
                "all"
            ) {

                const category =
                    filters.value.category;


                result =
                    result.filter(
                        (
                            card
                        ) =>
                            card.category ===
                            category
                    );

            }


            /* -------------------------------------------------
               LIMITED
            ------------------------------------------------- */

            if (
                typeof
                    filters.value.limited ===
                "boolean"
            ) {

                result =
                    result.filter(
                        (
                            card
                        ) =>
                            card.limited ===
                            filters.value.limited
                    );

            }


            /* -------------------------------------------------
               OWNED
            ------------------------------------------------- */

            if (
                typeof
                    filters.value.owned ===
                "boolean"
            ) {

                const shouldBeOwned =
                    filters.value.owned;


                result =
                    result.filter(
                        (
                            card
                        ) => {

                            const owned =
                                ownedCardIds.value.has(
                                    card.id
                                );


                            return shouldBeOwned
                                ?
                                owned
                                :
                                !owned;

                        }
                    );

            }


            return result;

        }
    );


/* =========================================================
   RARITY ORDER

   Plus le nombre est élevé,
   plus la rareté est importante.
========================================================= */

const rarityOrder:
    Record<CardRarity, number> =
    {

        common:
            1,

        uncommon:
            2,

        rare:
            3,

        epic:
            4,

        legendary:
            5,

        mythic:
            6

    };


/* =========================================================
   SORTED CARDS
========================================================= */

const displayedCards =
    computed<Card[]>(
        () => {

            const result =
                [
                    ...filteredCards.value
                ];


            switch (
                sort.value
            ) {

                /* -----------------------------------------
                   NUMBER ASC
                ------------------------------------------ */

                case "number-asc":

                    return result.sort(
                        (
                            a,
                            b
                        ) =>
                            a.number -
                            b.number
                    );


                /* -----------------------------------------
                   NUMBER DESC
                ------------------------------------------ */

                case "number-desc":

                    return result.sort(
                        (
                            a,
                            b
                        ) =>
                            b.number -
                            a.number
                    );


                /* -----------------------------------------
                   NAME ASC
                ------------------------------------------ */

                case "name-asc":

                    return result.sort(
                        (
                            a,
                            b
                        ) =>
                            a.name.localeCompare(
                                b.name,
                                "fr"
                            )
                    );


                /* -----------------------------------------
                   NAME DESC
                ------------------------------------------ */

                case "name-desc":

                    return result.sort(
                        (
                            a,
                            b
                        ) =>
                            b.name.localeCompare(
                                a.name,
                                "fr"
                            )
                    );


                /* -----------------------------------------
                   RARITY
                ------------------------------------------ */

                case "rarity":

                    return result.sort(
                        (
                            a,
                            b
                        ) => {

                            const rarityDifference =
                                rarityOrder[
                                    b.rarity
                                ]
                                -
                                rarityOrder[
                                    a.rarity
                                ];


                            if (
                                rarityDifference !==
                                0
                            ) {

                                return rarityDifference;

                            }


                            return (
                                a.number -
                                b.number
                            );

                        }
                    );


                /* -----------------------------------------
                   NEWEST
                ------------------------------------------ */

                case "newest":

                    return result.sort(
                        (
                            a,
                            b
                        ) =>
                            new Date(
                                b.createdAt
                            ).getTime()
                            -
                            new Date(
                                a.createdAt
                            ).getTime()
                    );


                default:

                    return result;

            }

        }
    );


/* =========================================================
   CARDS BY RARITY
========================================================= */

const cardsByRarity =
    computed(
        () => {

            const result:
                Record<
                    CardRarity,
                    Card[]
                > =
                {

                    common:
                        [],

                    uncommon:
                        [],

                    rare:
                        [],

                    epic:
                        [],

                    legendary:
                        [],

                    mythic:
                        []

                };


            for (
                const card of cards.value
            ) {

                result[
                    card.rarity
                ].push(
                    card
                );

            }


            return result;

        }
    );


/* =========================================================
   COLLECTION STATS
========================================================= */

const collectionStats =
    computed(
        () =>
            collection.value
                ?.stats
            ??
            null
    );


/* =========================================================
   COLLECTION COMPLETION
========================================================= */

const collectionCompletion =
    computed(
        () =>
            collection.value
                ?.stats
                .completion
            ??
            0
    );


/* =========================================================
   IS CARD OWNED
========================================================= */

function isCardOwned(
    cardId: string
) {

    return ownedCardIds.value.has(
        cardId
    );

}


/* =========================================================
   CARD QUANTITY
========================================================= */

function getCardQuantity(
    cardId: string
) {

    if (
        !collection.value
    ) {

        return 0;

    }


    const userCard =
        collection.value.cards.find(
            (
                item
            ) =>
                item.cardId ===
                cardId
        );


    return (
        userCard?.quantity ??
        0
    );

}


/* =========================================================
   GET RARITY CONFIG
========================================================= */

function getRarityConfig(
    rarity: CardRarity
) {

    return (
        rarities.value.find(
            (
                item
            ) =>
                item.id ===
                rarity
        )
        ??
        null
    );

}


/* =========================================================
   SET SEARCH
========================================================= */

function setSearch(
    search: string
) {

    filters.value.search =
        search;

}


/* =========================================================
   SET RARITY FILTER
========================================================= */

function setRarityFilter(
    rarity:
        CardRarity
        | "all"
) {

    filters.value.rarity =
        rarity;

}


/* =========================================================
   SET CATEGORY FILTER
========================================================= */

function setCategoryFilter(
    category:
        CardCategory
        | "all"
) {

    filters.value.category =
        category;

}


/* =========================================================
   SET OWNED FILTER
========================================================= */

function setOwnedFilter(
    owned:
        boolean
        | undefined
) {

    filters.value.owned =
        owned;

}


/* =========================================================
   SET LIMITED FILTER
========================================================= */

function setLimitedFilter(
    limited:
        boolean
        | undefined
) {

    filters.value.limited =
        limited;

}


/* =========================================================
   SET SORT
========================================================= */

function setSort(
    value: CardSort
) {

    sort.value =
        value;

}


/* =========================================================
   RESET FILTERS
========================================================= */

function resetFilters() {

    filters.value =
        {

            search:
                "",

            rarity:
                "all",

            category:
                "all",

            owned:
                undefined,

            limited:
                undefined

        };


    sort.value =
        "number-asc";

}


/* =========================================================
   REFRESH CARDS
========================================================= */

async function refreshCards() {

    return loadCards(
        true
    );

}


/* =========================================================
   REFRESH PACKS
========================================================= */

async function refreshPacks() {

    return loadPacks(
        true
    );

}


/* =========================================================
   REFRESH COLLECTION

   Très important plus tard après
   l'ouverture d'un booster.
========================================================= */

async function refreshCollection() {

    return loadCollection(
        true
    );

}


/* =========================================================
   RESET COLLECTION

   Utile à la déconnexion d'un utilisateur.
========================================================= */

function resetCollection() {

    collection.value =
        null;


    collectionLoaded.value =
        false;


    collectionError.value =
        null;

}


/* =========================================================
   USE CARDS
========================================================= */

export function useCards() {

    return {

        /* -------------------------------------------------
           DATA
        ------------------------------------------------- */

        cards:
            readonly(
                cards
            ),

        rarities:
            readonly(
                rarities
            ),

        packs:
            readonly(
                packs
            ),

        collection:
            readonly(
                collection
            ),

        selectedCard:
            readonly(
                selectedCard
            ),


        /* -------------------------------------------------
           DISPLAY
        ------------------------------------------------- */

        displayedCards,

        filteredCards,

        cardsByRarity,

        collectionStats,

        collectionCompletion,


        /* -------------------------------------------------
           FILTERS
        ------------------------------------------------- */

        filters,

        sort,


        /* -------------------------------------------------
           LOADING
        ------------------------------------------------- */

        cardsLoading:
            readonly(
                cardsLoading
            ),

        raritiesLoading:
            readonly(
                raritiesLoading
            ),

        packsLoading:
            readonly(
                packsLoading
            ),

        collectionLoading:
            readonly(
                collectionLoading
            ),

        selectedCardLoading:
            readonly(
                selectedCardLoading
            ),


        /* -------------------------------------------------
           ERRORS
        ------------------------------------------------- */

        cardsError:
            readonly(
                cardsError
            ),

        raritiesError:
            readonly(
                raritiesError
            ),

        packsError:
            readonly(
                packsError
            ),

        collectionError:
            readonly(
                collectionError
            ),

        selectedCardError:
            readonly(
                selectedCardError
            ),


        /* -------------------------------------------------
           INITIALIZATION
        ------------------------------------------------- */

        initializeCards,

        initializeCollection,


        /* -------------------------------------------------
           LOAD
        ------------------------------------------------- */

        loadCards,

        loadRarities,

        loadPacks,

        loadCollection,

        loadCard,


        /* -------------------------------------------------
           HELPERS
        ------------------------------------------------- */

        isCardOwned,

        getCardQuantity,

        getRarityConfig,


        /* -------------------------------------------------
           FILTER ACTIONS
        ------------------------------------------------- */

        setSearch,

        setRarityFilter,

        setCategoryFilter,

        setOwnedFilter,

        setLimitedFilter,

        setSort,

        resetFilters,


        /* -------------------------------------------------
           REFRESH
        ------------------------------------------------- */

        refreshCards,

        refreshPacks,

        refreshCollection,


        /* -------------------------------------------------
           RESET
        ------------------------------------------------- */

        resetCollection

    };

}