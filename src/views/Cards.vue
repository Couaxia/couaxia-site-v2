<script setup lang="ts">

/* =========================================================
   VUE
========================================================= */

import {
    computed,
    onMounted
} from "vue";


/* =========================================================
   COMPONENTS
========================================================= */

import CardItem from "../components/cards/CardItem.vue";


/* =========================================================
   COMPOSABLES
========================================================= */

import {
    useCards
} from "../composables/useCards";


/* =========================================================
   TYPES
========================================================= */

import type {
    Card,
    CardCategory,
    CardRarity,
    CardSort
} from "../types/card.types";


/* =========================================================
   CARDS SYSTEM
========================================================= */

const {

    cards,

    rarities,

    displayedCards,

    filters,

    sort,

    cardsLoading,

    raritiesLoading,

    cardsError,

    initializeCards,

    refreshCards,

    getRarityConfig,

    setSearch,

    setRarityFilter,

    setCategoryFilter,

    setLimitedFilter,

    setSort,

    resetFilters

} = useCards();


/* =========================================================
   CATEGORIES
========================================================= */

const categories:
    {
        id:
            CardCategory | "all";

        name:
            string;
    }[] =
    [

        {
            id:
                "all",

            name:
                "Toutes"
        },

        {
            id:
                "couaxia",

            name:
                "Couaxia"
        },

        {
            id:
                "natsu",

            name:
                "Natsu"
        },

        {
            id:
                "character",

            name:
                "Personnages"
        },

        {
            id:
                "lore",

            name:
                "Lore"
        },

        {
            id:
                "event",

            name:
                "Événements"
        },

        {
            id:
                "special",

            name:
                "Spéciales"
        }

    ];


/* =========================================================
   SORT OPTIONS
========================================================= */

const sortOptions:
    {
        value:
            CardSort;

        label:
            string;
    }[] =
    [

        {
            value:
                "number-asc",

            label:
                "Numéro croissant"
        },

        {
            value:
                "number-desc",

            label:
                "Numéro décroissant"
        },

        {
            value:
                "name-asc",

            label:
                "Nom A → Z"
        },

        {
            value:
                "name-desc",

            label:
                "Nom Z → A"
        },

        {
            value:
                "rarity",

            label:
                "Rareté"
        },

        {
            value:
                "newest",

            label:
                "Plus récentes"
        }

    ];


/* =========================================================
   TOTAL
========================================================= */

const totalCards =
    computed(
        () =>
            cards.value.length
    );


/* =========================================================
   DISPLAYED TOTAL
========================================================= */

const displayedTotal =
    computed(
        () =>
            displayedCards.value.length
    );


/* =========================================================
   LIMITED FILTER
========================================================= */

const limitedFilter =
    computed({

        get() {

            if (
                filters.value.limited ===
                true
            ) {

                return "limited";

            }


            if (
                filters.value.limited ===
                false
            ) {

                return "permanent";

            }


            return "all";

        },


        set(
            value: string
        ) {

            if (
                value ===
                "limited"
            ) {

                setLimitedFilter(
                    true
                );

                return;

            }


            if (
                value ===
                "permanent"
            ) {

                setLimitedFilter(
                    false
                );

                return;

            }


            setLimitedFilter(
                undefined
            );

        }

    });


/* =========================================================
   SELECT CARD

   Pour l'instant on prépare simplement l'événement.

   Plus tard :
   ouverture d'une modal avec le détail de la carte.
========================================================= */

function handleCardSelect(
    card: Card
) {

    console.log(
        "[Cards] Carte sélectionnée :",
        card
    );

}


/* =========================================================
   RETRY
========================================================= */

async function retry() {

    await refreshCards();

}


/* =========================================================
   INIT
========================================================= */

onMounted(
    async () => {

        await initializeCards();

    }
);

</script>


<template>

    <main
        class="cards-page"
    >

        <div
            class="cards-page__background"
            aria-hidden="true"
        >

            <div
                class="
                    cards-page__orb
                    cards-page__orb--pink
                "
            ></div>


            <div
                class="
                    cards-page__orb
                    cards-page__orb--cyan
                "
            ></div>


            <div
                class="
                    cards-page__orb
                    cards-page__orb--purple
                "
            ></div>

        </div>


        <div
            class="cards-page__container"
        >

            <!-- =================================================
                 HERO
            ================================================== -->

            <section
                class="cards-hero"
            >

                <div
                    class="cards-hero__eyebrow"
                >
                    COLLECTION
                </div>


                <h1
                    class="cards-hero__title"
                >
                    Les cartes
                    <span>
                        Couaxia
                    </span>
                </h1>


                <p
                    class="cards-hero__description"
                >
                    Découvre les cartes de l'univers de Couaxia,
                    leurs raretés et les éditions spéciales.
                </p>


                <div
                    class="cards-hero__stats"
                >

                    <div
                        class="cards-stat"
                    >

                        <strong>
                            {{ totalCards }}
                        </strong>

                        <span>
                            cartes
                        </span>

                    </div>


                    <div
                        class="cards-stat"
                    >

                        <strong>
                            {{ rarities.length }}
                        </strong>

                        <span>
                            raretés
                        </span>

                    </div>


                    <div
                        class="cards-stat"
                    >

                        <strong>
                            {{ displayedTotal }}
                        </strong>

                        <span>
                            affichées
                        </span>

                    </div>

                </div>

            </section>


            <!-- =================================================
                 TOOLBAR
            ================================================== -->

            <section
                class="cards-toolbar"
                aria-label="Filtres des cartes"
            >

                <!-- =============================================
                     SEARCH
                ============================================== -->

                <div
                    class="cards-search"
                >

                    <span
                        class="cards-search__icon"
                        aria-hidden="true"
                    >
                        ⌕
                    </span>


                    <input
                        class="cards-search__input"

                        type="search"

                        placeholder="Rechercher une carte..."

                        :value="
                            filters.search
                        "

                        @input="
                            setSearch(
                                (
                                    $event.target as HTMLInputElement
                                ).value
                            )
                        "
                    >

                </div>


                <!-- =============================================
                     SORT
                ============================================== -->

                <label
                    class="cards-select"
                >

                    <span>
                        Trier
                    </span>


                    <select
                        :value="sort"

                        @change="
                            setSort(
                                (
                                    $event.target as HTMLSelectElement
                                ).value as CardSort
                            )
                        "
                    >

                        <option
                            v-for="
                                option in sortOptions
                            "

                            :key="
                                option.value
                            "

                            :value="
                                option.value
                            "
                        >
                            {{ option.label }}
                        </option>

                    </select>

                </label>


                <!-- =============================================
                     LIMITED
                ============================================== -->

                <label
                    class="cards-select"
                >

                    <span>
                        Édition
                    </span>


                    <select
                        v-model="
                            limitedFilter
                        "
                    >

                        <option
                            value="all"
                        >
                            Toutes
                        </option>

                        <option
                            value="permanent"
                        >
                            Permanentes
                        </option>

                        <option
                            value="limited"
                        >
                            Limitées
                        </option>

                    </select>

                </label>


                <!-- =============================================
                     RESET
                ============================================== -->

                <button
                    class="cards-reset"

                    type="button"

                    @click="
                        resetFilters
                    "
                >
                    Réinitialiser
                </button>

            </section>


            <!-- =================================================
                 RARITIES
            ================================================== -->

            <section
                v-if="
                    !raritiesLoading
                "

                class="cards-filter-section"
            >

                <div
                    class="cards-filter-section__label"
                >
                    Rareté
                </div>


                <div
                    class="cards-filter-buttons"
                >

                    <button
                        type="button"

                        class="cards-filter-button"

                        :class="{
                            'cards-filter-button--active':
                                filters.rarity ===
                                'all'
                        }"

                        @click="
                            setRarityFilter(
                                'all'
                            )
                        "
                    >
                        Toutes
                    </button>


                    <button
                        v-for="
                            rarity in rarities
                        "

                        :key="
                            rarity.id
                        "

                        type="button"

                        class="
                            cards-filter-button
                            cards-filter-button--rarity
                        "

                        :class="{
                            'cards-filter-button--active':
                                filters.rarity ===
                                rarity.id
                        }"

                        :style="{
                            '--filter-color':
                                rarity.color,

                            '--filter-secondary':
                                rarity.secondaryColor ??
                                rarity.color
                        }"

                        @click="
                            setRarityFilter(
                                rarity.id as CardRarity
                            )
                        "
                    >

                        <span
                            class="cards-filter-button__dot"
                        ></span>

                        {{ rarity.name }}

                    </button>

                </div>

            </section>


            <!-- =================================================
                 CATEGORIES
            ================================================== -->

            <section
                class="cards-filter-section"
            >

                <div
                    class="cards-filter-section__label"
                >
                    Catégorie
                </div>


                <div
                    class="cards-filter-buttons"
                >

                    <button
                        v-for="
                            category in categories
                        "

                        :key="
                            category.id
                        "

                        type="button"

                        class="cards-filter-button"

                        :class="{
                            'cards-filter-button--active':
                                filters.category ===
                                category.id
                        }"

                        @click="
                            setCategoryFilter(
                                category.id
                            )
                        "
                    >
                        {{ category.name }}
                    </button>

                </div>

            </section>


            <!-- =================================================
                 RESULT COUNT
            ================================================== -->

            <div
                v-if="
                    !cardsLoading &&
                    !cardsError
                "

                class="cards-results"
            >

                <span>
                    {{ displayedTotal }}
                </span>

                {{
                    displayedTotal > 1
                        ? "cartes trouvées"
                        : "carte trouvée"
                }}

            </div>


            <!-- =================================================
                 LOADING
            ================================================== -->

            <section
                v-if="
                    cardsLoading
                "

                class="cards-state"
            >

                <div
                    class="cards-loader"
                ></div>


                <h2>
                    Chargement de la collection...
                </h2>


                <p>
                    Les tentacules fouillent les archives.
                </p>

            </section>


            <!-- =================================================
                 ERROR
            ================================================== -->

            <section
                v-else-if="
                    cardsError
                "

                class="
                    cards-state
                    cards-state--error
                "
            >

                <div
                    class="cards-state__symbol"
                >
                    !
                </div>


                <h2>
                    Impossible de charger les cartes
                </h2>


                <p>
                    {{ cardsError }}
                </p>


                <button
                    type="button"

                    class="cards-state__button"

                    @click="
                        retry
                    "
                >
                    Réessayer
                </button>

            </section>


            <!-- =================================================
                 EMPTY
            ================================================== -->

            <section
                v-else-if="
                    displayedCards.length ===
                    0
                "

                class="cards-state"
            >

                <div
                    class="cards-state__symbol"
                >
                    ?
                </div>


                <h2>
                    Aucune carte trouvée
                </h2>


                <p>
                    Essaie de modifier les filtres
                    ou la recherche.
                </p>


                <button
                    type="button"

                    class="cards-state__button"

                    @click="
                        resetFilters
                    "
                >
                    Effacer les filtres
                </button>

            </section>


            <!-- =================================================
                 CARDS GRID
            ================================================== -->

            <section
                v-else

                class="cards-grid"
            >

                <CardItem

                    v-for="
                        card in displayedCards
                    "

                    :key="
                        card.id
                    "

                    :card="
                        card
                    "

                    :rarity-config="
                        getRarityConfig(
                            card.rarity
                        )
                    "

                    @select="
                        handleCardSelect
                    "

                />

            </section>

        </div>

    </main>

</template>


<style scoped>

/* =========================================================
   PAGE
========================================================= */

.cards-page {
    position:
        relative;

    min-height:
        100vh;

    overflow:
        hidden;

    padding:
        135px
        28px
        100px;

    background:
        #100817;

    color:
        #ffffff;
}


/* =========================================================
   CONTAINER
========================================================= */

.cards-page__container {
    position:
        relative;

    z-index:
        2;

    width:
        min(
            1400px,
            100%
        );

    margin:
        0 auto;
}


/* =========================================================
   BACKGROUND
========================================================= */

.cards-page__background {
    position:
        absolute;

    z-index:
        0;

    inset:
        0;

    overflow:
        hidden;

    pointer-events:
        none;

    background:
        radial-gradient(
            circle
            at
            50%
            -10%,
            rgba(
                109,
                0,
                163,
                0.23
            ),
            transparent
            42%
        );
}


/* =========================================================
   ORBS
========================================================= */

.cards-page__orb {
    position:
        absolute;

    border-radius:
        50%;

    filter:
        blur(
            110px
        );

    opacity:
        0.15;
}


.cards-page__orb--pink {
    width:
        420px;

    height:
        420px;

    top:
        8%;

    left:
        -180px;

    background:
        #f22292;
}


.cards-page__orb--cyan {
    width:
        420px;

    height:
        420px;

    top:
        40%;

    right:
        -180px;

    background:
        #22f2ef;
}


.cards-page__orb--purple {
    width:
        480px;

    height:
        480px;

    bottom:
        -220px;

    left:
        35%;

    background:
        #6d00a3;
}


/* =========================================================
   HERO
========================================================= */

.cards-hero {
    max-width:
        760px;

    margin:
        0 auto
        55px;

    text-align:
        center;
}


/* =========================================================
   EYEBROW
========================================================= */

.cards-hero__eyebrow {
    margin-bottom:
        13px;

    color:
        #22f2ef;

    font-size:
        0.72rem;

    font-weight:
        900;

    letter-spacing:
        0.30em;
}


/* =========================================================
   TITLE
========================================================= */

.cards-hero__title {
    margin:
        0;

    color:
        #ffffff;

    font-size:
        clamp(
            2.5rem,
            7vw,
            5rem
        );

    font-weight:
        1000;

    line-height:
        0.95;

    letter-spacing:
        -0.055em;
}


.cards-hero__title span {
    background:
        linear-gradient(
            90deg,
            #f22292,
            #b759ff,
            #22f2ef
        );

    background-clip:
        text;

    -webkit-background-clip:
        text;

    color:
        transparent;

    -webkit-text-fill-color:
        transparent;
}


/* =========================================================
   DESCRIPTION
========================================================= */

.cards-hero__description {
    max-width:
        620px;

    margin:
        23px auto
        0;

    color:
        rgba(
            255,
            255,
            255,
            0.68
        );

    font-size:
        1rem;

    font-weight:
        600;

    line-height:
        1.7;
}


/* =========================================================
   STATS
========================================================= */

.cards-hero__stats {
    display:
        flex;

    align-items:
        stretch;

    justify-content:
        center;

    gap:
        12px;

    margin-top:
        30px;
}


/* =========================================================
   STAT
========================================================= */

.cards-stat {
    min-width:
        115px;

    padding:
        14px
        18px;

    border:
        1px solid
        rgba(
            255,
            255,
            255,
            0.08
        );

    border-radius:
        17px;

    background:
        rgba(
            255,
            255,
            255,
            0.035
        );

    backdrop-filter:
        blur(
            12px
        );
}


.cards-stat strong {
    display:
        block;

    color:
        #ffffff;

    font-size:
        1.35rem;

    font-weight:
        1000;
}


.cards-stat span {
    display:
        block;

    margin-top:
        2px;

    color:
        rgba(
            255,
            255,
            255,
            0.48
        );

    font-size:
        0.68rem;

    font-weight:
        800;

    letter-spacing:
        0.06em;

    text-transform:
        uppercase;
}


/* =========================================================
   TOOLBAR
========================================================= */

.cards-toolbar {
    display:
        grid;

    grid-template-columns:
        minmax(
            240px,
            1fr
        )
        auto
        auto
        auto;

    align-items:
        end;

    gap:
        12px;

    margin-bottom:
        20px;

    padding:
        15px;

    border:
        1px solid
        rgba(
            255,
            255,
            255,
            0.08
        );

    border-radius:
        20px;

    background:
        rgba(
            255,
            255,
            255,
            0.035
        );

    backdrop-filter:
        blur(
            15px
        );
}


/* =========================================================
   SEARCH
========================================================= */

.cards-search {
    position:
        relative;
}


.cards-search__icon {
    position:
        absolute;

    top:
        50%;

    left:
        15px;

    color:
        rgba(
            255,
            255,
            255,
            0.45
        );

    font-size:
        1.15rem;

    transform:
        translateY(
            -50%
        );

    pointer-events:
        none;
}


.cards-search__input {
    width:
        100%;

    height:
        45px;

    padding:
        0
        15px
        0
        42px;

    border:
        1px solid
        rgba(
            255,
            255,
            255,
            0.10
        );

    border-radius:
        13px;

    outline:
        none;

    background:
        rgba(
            0,
            0,
            0,
            0.22
        );

    color:
        #ffffff;

    font:
        inherit;

    font-size:
        0.86rem;

    font-weight:
        700;

    transition:
        border-color
        0.2s ease,
        box-shadow
        0.2s ease;
}


.cards-search__input::placeholder {
    color:
        rgba(
            255,
            255,
            255,
            0.32
        );
}


.cards-search__input:focus {
    border-color:
        rgba(
            34,
            242,
            239,
            0.55
        );

    box-shadow:
        0 0 0 3px
        rgba(
            34,
            242,
            239,
            0.08
        );
}


/* =========================================================
   SELECT
========================================================= */

.cards-select {
    display:
        flex;

    flex-direction:
        column;

    gap:
        5px;
}


.cards-select > span {
    padding-left:
        3px;

    color:
        rgba(
            255,
            255,
            255,
            0.45
        );

    font-size:
        0.62rem;

    font-weight:
        900;

    letter-spacing:
        0.08em;

    text-transform:
        uppercase;
}


.cards-select select {
    height:
        45px;

    padding:
        0
        38px
        0
        13px;

    border:
        1px solid
        rgba(
            255,
            255,
            255,
            0.10
        );

    border-radius:
        13px;

    outline:
        none;

    background:
        #1b1024;

    color:
        #ffffff;

    font:
        inherit;

    font-size:
        0.78rem;

    font-weight:
        800;

    cursor:
        pointer;
}


/* =========================================================
   RESET
========================================================= */

.cards-reset {
    height:
        45px;

    padding:
        0
        18px;

    border:
        1px solid
        rgba(
            242,
            34,
            146,
            0.28
        );

    border-radius:
        13px;

    background:
        rgba(
            242,
            34,
            146,
            0.08
        );

    color:
        #ff7ebe;

    font:
        inherit;

    font-size:
        0.74rem;

    font-weight:
        900;

    cursor:
        pointer;

    transition:
        background
        0.2s ease,
        transform
        0.2s ease;
}


.cards-reset:hover {
    background:
        rgba(
            242,
            34,
            146,
            0.16
        );

    transform:
        translateY(
            -1px
        );
}


/* =========================================================
   FILTER SECTION
========================================================= */

.cards-filter-section {
    display:
        grid;

    grid-template-columns:
        90px
        1fr;

    align-items:
        start;

    gap:
        14px;

    margin:
        15px
        0;
}


/* =========================================================
   FILTER LABEL
========================================================= */

.cards-filter-section__label {
    padding-top:
        9px;

    color:
        rgba(
            255,
            255,
            255,
            0.38
        );

    font-size:
        0.67rem;

    font-weight:
        900;

    letter-spacing:
        0.10em;

    text-transform:
        uppercase;
}


/* =========================================================
   FILTER BUTTONS
========================================================= */

.cards-filter-buttons {
    display:
        flex;

    flex-wrap:
        wrap;

    gap:
        8px;
}


/* =========================================================
   FILTER BUTTON
========================================================= */

.cards-filter-button {
    min-height:
        36px;

    padding:
        0
        14px;

    border:
        1px solid
        rgba(
            255,
            255,
            255,
            0.09
        );

    border-radius:
        999px;

    background:
        rgba(
            255,
            255,
            255,
            0.035
        );

    color:
        rgba(
            255,
            255,
            255,
            0.58
        );

    font:
        inherit;

    font-size:
        0.69rem;

    font-weight:
        900;

    cursor:
        pointer;

    transition:
        border-color
        0.2s ease,
        background
        0.2s ease,
        color
        0.2s ease,
        transform
        0.2s ease;
}


.cards-filter-button:hover {
    border-color:
        rgba(
            255,
            255,
            255,
            0.20
        );

    color:
        #ffffff;

    transform:
        translateY(
            -1px
        );
}


.cards-filter-button--active {
    border-color:
        rgba(
            34,
            242,
            239,
            0.45
        );

    background:
        rgba(
            34,
            242,
            239,
            0.10
        );

    color:
        #8ffffd;
}


/* =========================================================
   RARITY FILTER
========================================================= */

.cards-filter-button--rarity {
    --filter-color:
        #ffffff;

    --filter-secondary:
        #ffffff;
}


.cards-filter-button--rarity.cards-filter-button--active {
    border-color:
        color-mix(
            in srgb,
            var(
                --filter-color
            )
            65%,
            transparent
        );

    background:
        color-mix(
            in srgb,
            var(
                --filter-color
            )
            12%,
            transparent
        );

    color:
        var(
            --filter-secondary
        );
}


/* =========================================================
   DOT
========================================================= */

.cards-filter-button__dot {
    display:
        inline-block;

    width:
        7px;

    height:
        7px;

    margin-right:
        5px;

    border-radius:
        50%;

    background:
        var(
            --filter-color
        );

    box-shadow:
        0 0 7px
        var(
            --filter-color
        );
}


/* =========================================================
   RESULTS
========================================================= */

.cards-results {
    margin:
        28px
        0
        18px;

    color:
        rgba(
            255,
            255,
            255,
            0.46
        );

    font-size:
        0.75rem;

    font-weight:
        800;
}


.cards-results span {
    color:
        #22f2ef;

    font-weight:
        1000;
}


/* =========================================================
   GRID
========================================================= */

.cards-grid {
    display:
        grid;

    grid-template-columns:
        repeat(
            auto-fill,
            minmax(
                230px,
                1fr
            )
        );

    align-items:
        start;

    justify-items:
        center;

    gap:
        38px
        26px;

    padding:
        8px
        0
        40px;
}


/* =========================================================
   STATE
========================================================= */

.cards-state {
    display:
        flex;

    min-height:
        350px;

    flex-direction:
        column;

    align-items:
        center;

    justify-content:
        center;

    padding:
        50px
        20px;

    text-align:
        center;
}


.cards-state h2 {
    margin:
        18px
        0
        7px;

    color:
        #ffffff;

    font-size:
        1.3rem;
}


.cards-state p {
    max-width:
        460px;

    margin:
        0;

    color:
        rgba(
            255,
            255,
            255,
            0.48
        );

    font-size:
        0.84rem;

    line-height:
        1.6;
}


/* =========================================================
   STATE SYMBOL
========================================================= */

.cards-state__symbol {
    display:
        grid;

    place-items:
        center;

    width:
        65px;

    height:
        65px;

    border:
        1px solid
        rgba(
            34,
            242,
            239,
            0.25
        );

    border-radius:
        50%;

    background:
        rgba(
            34,
            242,
            239,
            0.06
        );

    color:
        #22f2ef;

    font-size:
        1.8rem;

    font-weight:
        1000;
}


/* =========================================================
   STATE BUTTON
========================================================= */

.cards-state__button {
    margin-top:
        22px;

    min-height:
        42px;

    padding:
        0
        20px;

    border:
        1px solid
        rgba(
            34,
            242,
            239,
            0.30
        );

    border-radius:
        12px;

    background:
        rgba(
            34,
            242,
            239,
            0.08
        );

    color:
        #8ffffd;

    font:
        inherit;

    font-size:
        0.76rem;

    font-weight:
        900;

    cursor:
        pointer;
}


/* =========================================================
   LOADER
========================================================= */

.cards-loader {
    width:
        48px;

    height:
        48px;

    border:
        4px solid
        rgba(
            255,
            255,
            255,
            0.08
        );

    border-top-color:
        #22f2ef;

    border-right-color:
        #f22292;

    border-radius:
        50%;

    animation:
        cardsLoader
        0.8s
        linear
        infinite;
}


@keyframes cardsLoader {

    to {
        transform:
            rotate(
                360deg
            );
    }

}


/* =========================================================
   ERROR
========================================================= */

.cards-state--error
.cards-state__symbol {
    border-color:
        rgba(
            242,
            34,
            146,
            0.35
        );

    background:
        rgba(
            242,
            34,
            146,
            0.08
        );

    color:
        #ff7ebe;
}


/* =========================================================
   LIGHT MODE
========================================================= */

:global(html[data-theme="light"])
.cards-page {
    background:
        #faf7fc;

    color:
        #3d1555;
}


:global(html[data-theme="light"])
.cards-hero__title {
    color:
        #3d1555;
}


:global(html[data-theme="light"])
.cards-hero__description {
    color:
        #725e7c;
}


:global(html[data-theme="light"])
.cards-stat {
    border-color:
        rgba(
            109,
            0,
            163,
            0.10
        );

    background:
        rgba(
            255,
            255,
            255,
            0.72
        );
}


:global(html[data-theme="light"])
.cards-stat strong {
    color:
        #3d1555;
}


:global(html[data-theme="light"])
.cards-stat span {
    color:
        #846f8d;
}


:global(html[data-theme="light"])
.cards-toolbar {
    border-color:
        rgba(
            109,
            0,
            163,
            0.10
        );

    background:
        rgba(
            255,
            255,
            255,
            0.72
        );
}


:global(html[data-theme="light"])
.cards-search__input {
    border-color:
        rgba(
            109,
            0,
            163,
            0.12
        );

    background:
        rgba(
            109,
            0,
            163,
            0.035
        );

    color:
        #3d1555;
}


:global(html[data-theme="light"])
.cards-search__input::placeholder {
    color:
        #9c8aa4;
}


:global(html[data-theme="light"])
.cards-select > span,
:global(html[data-theme="light"])
.cards-filter-section__label,
:global(html[data-theme="light"])
.cards-results {
    color:
        #846f8d;
}


:global(html[data-theme="light"])
.cards-select select {
    border-color:
        rgba(
            109,
            0,
            163,
            0.12
        );

    background:
        #ffffff;

    color:
        #3d1555;
}


:global(html[data-theme="light"])
.cards-filter-button {
    border-color:
        rgba(
            109,
            0,
            163,
            0.10
        );

    background:
        rgba(
            109,
            0,
            163,
            0.035
        );

    color:
        #725e7c;
}


:global(html[data-theme="light"])
.cards-filter-button:hover {
    color:
        #3d1555;
}


:global(html[data-theme="light"])
.cards-state h2 {
    color:
        #3d1555;
}


:global(html[data-theme="light"])
.cards-state p {
    color:
        #846f8d;
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (
    max-width:
    950px
) {

    .cards-toolbar {
        grid-template-columns:
            1fr
            1fr;
    }


    .cards-search {
        grid-column:
            1 / -1;
    }


    .cards-reset {
        align-self:
            end;
    }

}


@media (
    max-width:
    650px
) {

    .cards-page {
        padding:
            110px
            16px
            80px;
    }


    .cards-hero {
        margin-bottom:
            38px;
    }


    .cards-hero__stats {
        gap:
            7px;
    }


    .cards-stat {
        min-width:
            0;

        flex:
            1;

        padding:
            12px
            8px;
    }


    .cards-toolbar {
        grid-template-columns:
            1fr;
    }


    .cards-search {
        grid-column:
            auto;
    }


    .cards-filter-section {
        grid-template-columns:
            1fr;

        gap:
            7px;
    }


    .cards-filter-section__label {
        padding-top:
            0;
    }


    .cards-grid {
        grid-template-columns:
            repeat(
                auto-fill,
                minmax(
                    190px,
                    1fr
                )
            );

        gap:
            30px
            16px;
    }

}


@media (
    max-width:
    460px
) {

    .cards-grid {
        grid-template-columns:
            minmax(
                0,
                1fr
            );
    }

}


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (
    prefers-reduced-motion:
    reduce
) {

    .cards-loader {
        animation:
            none;
    }


    .cards-filter-button,
    .cards-reset {
        transition:
            none;
    }

}

</style>