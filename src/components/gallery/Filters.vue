<script setup lang="ts">

import {
    ref
} from "vue";


/* =========================================================
   TYPES
========================================================= */

type CreditsFilterValue =
    | "couaxia"
    | "forme-2"
    | "forme-3"
    | "compagnons"
    | "stream"
    | "collab"
    | "couple"
    | "fanart"
    | "favorites";


interface CreditsFilter {

    value:
        CreditsFilterValue;

    label:
        string;

    icon:
        string;

    messages:
        string[];

}


/* =========================================================
   FILTERS
========================================================= */

const filters:
    CreditsFilter[] = [

        {
            value:
                "couaxia",

            label:
                "Toutes les œuvres",

            icon:
                "🎨",

            messages: [
                "On commence par toutes les œuvres de Couaxia ? 🎨",
                "Ici tu peux voir toute la galerie principale ! 💜",
                "Beaucoup trop d'illustrations à regarder... et c'est tant mieux !"
            ]
        },

        {
            value:
                "forme-2",

            label:
                "Forme 2",

            icon:
                "✨",

            messages: [
                "Voici ma deuxième forme ! ✨",
                "Tu veux voir cette version de Couaxia ? 👀",
                "La Forme 2 a quand même son petit charme, non ?"
            ]
        },

        {
            value:
                "forme-3",

            label:
                "Forme 3",

            icon:
                "🌌",

            messages: [
                "Ma Forme 3 ! 🌌",
                "C'est ici que tu trouveras mon design le plus récent.",
                "Encore plus de détails, de tentacules et de chaos ! 🐙"
            ]
        },

        {
            value:
                "compagnons",

            label:
                "Compagnons",

            icon:
                "🐉",

            messages: [
                "Mes compagnons ont aussi droit à leur galerie ! 🐉",
                "Natsu et les autres ne sont jamais très loin.",
                "Une aventure sans compagnons serait beaucoup moins amusante !"
            ]
        },

        {
            value:
                "stream",

            label:
                "Stream",

            icon:
                "🎬",

            messages: [
                "Quelques créations directement liées aux streams ! 🎬",
                "Des souvenirs de live par ici !",
                "Le chaos Twitch a aussi droit à ses illustrations. 👀"
            ]
        },

        {
            value:
                "collab",

            label:
                "Collabs",

            icon:
                "🤝",

            messages: [
                "Les collaborations donnent toujours de super créations ! 🤝",
                "Plus on est nombreux, plus il y a de chaos.",
                "Voici quelques souvenirs de collabs ! 💜"
            ]
        },

        {
            value:
                "couple",

            label:
                "Couples",

            icon:
                "💕",

            messages: [
                "Oh ? Cette catégorie t'intéresse ? 👀💕",
                "Un peu de romance dans tout ce chaos !",
                "Je ne ferai aucun commentaire supplémentaire. 👀"
            ]
        },

        {
            value:
                "fanart",

            label:
                "Fan Arts",

            icon:
                "🖌️",

            messages: [
                "Les fan arts me font toujours énormément plaisir ! 💜",
                "Regarde-moi toutes ces créations incroyables !",
                "Merci à toutes les personnes qui prennent le temps de me dessiner. 🎨"
            ]
        },

        {
            value:
                "favorites",

            label:
                "Favoris",

            icon:
                "♥",

            messages: [
                "Voyons les œuvres que tu as mises de côté ! ♥",
                "Tes petites préférées sont ici ! 💜",
                "Tu as bon goût, évidemment. 👀"
            ]
        }

    ];


/* =========================================================
   STATE
========================================================= */

const activeFilter =
    ref<CreditsFilterValue>(
        "couaxia"
    );


let mascotHoverTimer:
    number | null =
        null;


/* =========================================================
   RANDOM MESSAGE
========================================================= */

function getRandomMessage(
    messages:
        string[]
):
    string {

    if (
        messages.length === 0
    ) {

        return "";

    }


    return (
        messages[
            Math.floor(
                Math.random() *
                messages.length
            )
        ]
        ??
        ""
    );

}


/* =========================================================
   MASCOT
========================================================= */

function sendMascotMessage(
    message:
        string
) {

    if (
        !message.trim()
    ) {

        return;

    }


    window.dispatchEvent(
        new CustomEvent(
            "couaxia-mascot-message",
            {
                detail: {
                    message
                }
            }
        )
    );

}


/* =========================================================
   HOVER
========================================================= */

function startMascotHover(
    messages:
        string[]
) {

    stopMascotHover();


    mascotHoverTimer =
        window.setTimeout(
            () => {

                sendMascotMessage(
                    getRandomMessage(
                        messages
                    )
                );


                mascotHoverTimer =
                    null;

            },
            450
        );

}


function stopMascotHover() {

    if (
        mascotHoverTimer ===
        null
    ) {

        return;

    }


    window.clearTimeout(
        mascotHoverTimer
    );


    mascotHoverTimer =
        null;

}


/* =========================================================
   SELECT
========================================================= */

function selectFilter(
    filter:
        CreditsFilterValue
) {

    activeFilter.value =
        filter;


    window.dispatchEvent(
        new CustomEvent(
            "couaxia-credits-filter",
            {
                detail: {
                    filter
                }
            }
        )
    );

}

</script>


<template>

    <section
        class="credits-filters"
        aria-labelledby="credits-filters-title"
    >

        <div class="credits-filters__header">

            <div>

                <p class="credits-filters__eyebrow">
                    🔎 EXPLORER
                </p>


                <h2
                    id="credits-filters-title"
                    class="credits-filters__title"
                >
                    Explorer la galerie
                </h2>

            </div>

        </div>


        <div
            class="credits-filters__list"
            role="group"
            aria-label="Filtrer les œuvres"
        >

            <button
                v-for="filter in filters"
                :key="filter.value"
                type="button"

                class="credits-filters__button"

                :class="{
                    'credits-filters__button--active':
                        activeFilter ===
                        filter.value
                }"

                :aria-pressed="
                    activeFilter ===
                    filter.value
                "

                @click="
                    selectFilter(
                        filter.value
                    )
                "

                @mouseenter="
                    startMascotHover(
                        filter.messages
                    )
                "

                @mouseleave="
                    stopMascotHover
                "

                @focus="
                    startMascotHover(
                        filter.messages
                    )
                "

                @blur="
                    stopMascotHover
                "
            >

                <span
                    class="credits-filters__icon"
                    aria-hidden="true"
                >
                    {{ filter.icon }}
                </span>


                <span>
                    {{ filter.label }}
                </span>

            </button>

        </div>

    </section>

</template>