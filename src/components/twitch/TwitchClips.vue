<script setup lang="ts">
import {
    computed,
    ref
} from "vue";


/* =========================================================
   TYPES
========================================================= */

interface TwitchClip {
    id: string;

    title: string;

    creatorName: string;

    thumbnailUrl: string;

    url: string;

    views: number;

    createdAt: string;
}


/* =========================================================
   CONFIGURATION
========================================================= */

const CLIPS_PER_PAGE =
    4;


/* =========================================================
   DONNÉES TEMPORAIRES

   Plus tard, on branchera l'API Twitch.
========================================================= */

const clips =
    ref<TwitchClip[]>([

        {
            id:
                "clip-1",

            title:
                "On est bien accueilli dite donc !",

            creatorName:
                "Couaxia",

            thumbnailUrl:
                "/images/twitch/clips/clip-1.jpg",

            url:
                "https://www.twitch.tv/couaxia/clips",

            views:
                307,

            createdAt:
                "2023-12-19T23:52:00Z"
        },

        {
            id:
                "clip-2",

            title:
                "En duo avec PIcaro ! On va tout casser !",

            creatorName:
                "Couaxia",

            thumbnailUrl:
                "/images/twitch/clips/clip-2.jpg",

            url:
                "https://www.twitch.tv/couaxia/clips",

            views:
                99,

            createdAt:
                "2025-04-26T23:27:00Z"
        },

        {
            id:
                "clip-3",

            title:
                "LA BAGARR !",

            creatorName:
                "kaka_o_lulu_vert",

            thumbnailUrl:
                "/images/twitch/clips/clip-3.jpg",

            url:
                "https://www.twitch.tv/couaxia/clips",

            views:
                78,

            createdAt:
                "2025-10-15T22:13:00Z"
        },

        {
            id:
                "clip-4",

            title:
                "Euh d'accord MDR",

            creatorName:
                "NaTsu_Le_Dragonnet",

            thumbnailUrl:
                "/images/twitch/clips/clip-4.jpg",

            url:
                "https://www.twitch.tv/couaxia/clips",

            views:
                78,

            createdAt:
                "2025-12-30T19:55:00Z"
        },

        {
            id:
                "clip-5",

            title:
                "Encore un moment totalement normal",

            creatorName:
                "Couaxia",

            thumbnailUrl:
                "/images/twitch/clips/clip-5.jpg",

            url:
                "https://www.twitch.tv/couaxia/clips",

            views:
                65,

            createdAt:
                "2026-01-12T20:10:00Z"
        }

    ]);


/* =========================================================
   PAGINATION
========================================================= */

const currentPage =
    ref(1);


const totalPages =
    computed(() => {

        return Math.max(
            1,
            Math.ceil(
                clips.value.length /
                CLIPS_PER_PAGE
            )
        );

    });


const paginatedClips =
    computed(() => {

        const start =
            (
                currentPage.value -
                1
            ) *
            CLIPS_PER_PAGE;


        const end =
            start +
            CLIPS_PER_PAGE;


        return clips.value.slice(
            start,
            end
        );

    });


const canGoPrevious =
    computed(() => {

        return currentPage.value >
            1;

    });


const canGoNext =
    computed(() => {

        return currentPage.value <
            totalPages.value;

    });


/* =========================================================
   PAGINATION — ACTIONS
========================================================= */

function previousPage() {

    if (
        !canGoPrevious.value
    ) {

        return;
    }


    currentPage.value -=
        1;

}


function nextPage() {

    if (
        !canGoNext.value
    ) {

        return;
    }


    currentPage.value +=
        1;

}


/* =========================================================
   FORMATAGE
========================================================= */

function formatViews(
    value: number
) {

    return value.toLocaleString(
        "fr-FR"
    );

}


function formatDate(
    value: string
) {

    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";
    }


    return new Intl.DateTimeFormat(
        "fr-FR",
        {
            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit"
        }
    ).format(
        date
    );

}
</script>


<template>

    <section class="twitch-clips">

        <!-- =================================================
             HEADER
        ================================================== -->

        <header class="twitch-clips__header">

            <div>

                <span class="twitch-clips__eyebrow">
                    MOMENTS FORTS
                </span>


                <h2 class="twitch-clips__title">
                    Mes derniers clips
                </h2>

            </div>


            <a
                href="https://www.twitch.tv/couaxia/clips"
                target="_blank"
                rel="noopener noreferrer"
                class="twitch-clips__all"
            >
                Voir tous les clips

                <span aria-hidden="true">
                    ↗
                </span>
            </a>

        </header>


        <!-- =================================================
             GRILLE
        ================================================== -->

        <div
            v-if="paginatedClips.length > 0"
            class="twitch-clips__grid"
        >

            <article
                v-for="clip in paginatedClips"
                :key="clip.id"
                class="twitch-clip-card"
            >

                <!-- =========================================
                     IMAGE
                ========================================== -->

                <a
                    :href="clip.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="twitch-clip-card__thumbnail-link"
                >

                    <img
                        :src="clip.thumbnailUrl"
                        :alt="`Miniature du clip ${clip.title}`"
                        class="twitch-clip-card__thumbnail"
                        loading="lazy"
                    >


                    <span class="twitch-clip-card__type">
                        Clip
                    </span>

                </a>


                <!-- =========================================
                     CONTENU
                ========================================== -->

                <div class="twitch-clip-card__content">

                    <a
                        :href="clip.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="twitch-clip-card__title"
                    >
                        {{ clip.title }}
                    </a>


                    <p class="twitch-clip-card__creator">

                        Par

                        <strong>
                            {{ clip.creatorName }}
                        </strong>

                    </p>


                    <p class="twitch-clip-card__views">

                        {{
                            formatViews(
                                clip.views
                            )
                        }}

                        vue{{
                            clip.views > 1
                                ? "s"
                                : ""
                        }}

                    </p>


                    <time
                        class="twitch-clip-card__date"
                        :datetime="clip.createdAt"
                    >
                        {{
                            formatDate(
                                clip.createdAt
                            )
                        }}
                    </time>

                </div>

            </article>

        </div>


        <!-- =================================================
             VIDE
        ================================================== -->

        <div
            v-else
            class="twitch-clips__empty"
        >

            <span aria-hidden="true">
                🎬
            </span>


            <strong>
                Aucun clip disponible.
            </strong>

        </div>


        <!-- =================================================
             PAGINATION
        ================================================== -->

        <nav
            v-if="totalPages > 1"
            class="twitch-clips__pagination"
            aria-label="Pagination des clips Twitch"
        >

            <button
                type="button"
                class="twitch-clips__pagination-button"
                :disabled="!canGoPrevious"
                @click="previousPage"
            >
                ← Précédent
            </button>


            <span class="twitch-clips__page">

                Page

                <strong>
                    {{ currentPage }}
                </strong>

                /

                <strong>
                    {{ totalPages }}
                </strong>

            </span>


            <button
                type="button"
                class="twitch-clips__pagination-button"
                :disabled="!canGoNext"
                @click="nextPage"
            >
                Suivant →
            </button>

        </nav>

    </section>

</template>