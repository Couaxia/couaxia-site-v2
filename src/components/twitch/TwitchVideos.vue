<script setup lang="ts">
import {
    computed,
    ref
} from "vue";


/* =========================================================
   TYPES
========================================================= */

interface TwitchVideo {
    id: string;

    title: string;

    thumbnailUrl: string;

    url: string;

    views: number;

    duration: string;

    createdAt: string;
}


/* =========================================================
   CONFIGURATION
========================================================= */

const VIDEOS_PER_PAGE =
    4;


/* =========================================================
   DONNÉES TEMPORAIRES

   Plus tard :
   les vidéos viendront directement de l'API Twitch.
========================================================= */

const videos =
    ref<TwitchVideo[]>([

        {
            id:
                "video-1",

            title:
                "Dernier live de Couaxia",

            thumbnailUrl:
                "/images/twitch/videos/video-1.jpg",

            url:
                "https://www.twitch.tv/couaxia/videos",

            views:
                120,

            duration:
                "03:42:18",

            createdAt:
                "2026-08-20T20:00:00Z"
        },

        {
            id:
                "video-2",

            title:
                "Soirée multigaming avec la communauté",

            thumbnailUrl:
                "/images/twitch/videos/video-2.jpg",

            url:
                "https://www.twitch.tv/couaxia/videos",

            views:
                98,

            duration:
                "04:15:32",

            createdAt:
                "2026-08-16T20:30:00Z"
        },

        {
            id:
                "video-3",

            title:
                "On découvre un nouveau jeu !",

            thumbnailUrl:
                "/images/twitch/videos/video-3.jpg",

            url:
                "https://www.twitch.tv/couaxia/videos",

            views:
                86,

            duration:
                "02:58:41",

            createdAt:
                "2026-08-12T19:45:00Z"
        },

        {
            id:
                "video-4",

            title:
                "Encore une soirée totalement normale",

            thumbnailUrl:
                "/images/twitch/videos/video-4.jpg",

            url:
                "https://www.twitch.tv/couaxia/videos",

            views:
                74,

            duration:
                "05:08:13",

            createdAt:
                "2026-08-08T21:00:00Z"
        },

        {
            id:
                "video-5",

            title:
                "Les aventures continuent !",

            thumbnailUrl:
                "/images/twitch/videos/video-5.jpg",

            url:
                "https://www.twitch.tv/couaxia/videos",

            views:
                62,

            duration:
                "03:27:54",

            createdAt:
                "2026-08-04T20:15:00Z"
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
                videos.value.length /
                VIDEOS_PER_PAGE
            )
        );

    });


const paginatedVideos =
    computed(() => {

        const start =
            (
                currentPage.value -
                1
            ) *
            VIDEOS_PER_PAGE;


        const end =
            start +
            VIDEOS_PER_PAGE;


        return videos.value.slice(
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
   FORMATAGE DES VUES
========================================================= */

function formatViews(
    value: number
) {

    return value.toLocaleString(
        "fr-FR"
    );

}


/* =========================================================
   FORMATAGE DATE
========================================================= */

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

    <section class="twitch-videos">

        <!-- =================================================
             HEADER
        ================================================== -->

        <header class="twitch-videos__header">

            <div>

                <span class="twitch-videos__eyebrow">
                    REDIFFUSIONS
                </span>


                <h2 class="twitch-videos__title">
                    Mes dernières vidéos
                </h2>

            </div>


            <a
                href="https://www.twitch.tv/couaxia/videos"
                target="_blank"
                rel="noopener noreferrer"
                class="twitch-videos__all"
            >

                Voir toutes les vidéos

                <span aria-hidden="true">
                    ↗
                </span>

            </a>

        </header>


        <!-- =================================================
             GRILLE DES VIDÉOS
        ================================================== -->

        <div
            v-if="paginatedVideos.length > 0"
            class="twitch-videos__grid"
        >

            <article
                v-for="video in paginatedVideos"
                :key="video.id"
                class="twitch-video-card"
            >

                <!-- =========================================
                     MINIATURE
                ========================================== -->

                <a
                    :href="video.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="twitch-video-card__thumbnail-link"
                >

                    <img
                        :src="video.thumbnailUrl"
                        :alt="`Miniature de ${video.title}`"
                        class="twitch-video-card__thumbnail"
                        loading="lazy"
                    >


                    <!-- =====================================
                         TYPE
                    ====================================== -->

                    <span class="twitch-video-card__type">
                        Vidéo
                    </span>


                    <!-- =====================================
                         DURÉE
                    ====================================== -->

                    <span class="twitch-video-card__duration">

                        {{ video.duration }}

                    </span>


                    <!-- =====================================
                         PLAY
                    ====================================== -->

                    <span
                        class="twitch-video-card__play"
                        aria-hidden="true"
                    >
                        ▶
                    </span>

                </a>


                <!-- =========================================
                     CONTENU
                ========================================== -->

                <div class="twitch-video-card__content">

                    <a
                        :href="video.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="twitch-video-card__title"
                    >

                        {{ video.title }}

                    </a>


                    <!-- =====================================
                         VUES
                    ====================================== -->

                    <p class="twitch-video-card__views">

                        {{
                            formatViews(
                                video.views
                            )
                        }}

                        vue{{
                            video.views > 1
                                ? "s"
                                : ""
                        }}

                    </p>


                    <!-- =====================================
                         DATE
                    ====================================== -->

                    <time
                        class="twitch-video-card__date"
                        :datetime="video.createdAt"
                    >

                        {{
                            formatDate(
                                video.createdAt
                            )
                        }}

                    </time>

                </div>

            </article>

        </div>


        <!-- =================================================
             AUCUNE VIDÉO
        ================================================== -->

        <div
            v-else
            class="twitch-videos__empty"
        >

            <span aria-hidden="true">
                📺
            </span>


            <strong>
                Aucune vidéo disponible.
            </strong>

        </div>


        <!-- =================================================
             PAGINATION
        ================================================== -->

        <nav
            v-if="totalPages > 1"
            class="twitch-videos__pagination"
            aria-label="Pagination des vidéos Twitch"
        >

            <!-- =============================================
                 PRÉCÉDENT
            ============================================== -->

            <button
                type="button"
                class="twitch-videos__pagination-button"
                :disabled="!canGoPrevious"
                @click="previousPage"
            >

                ← Précédent

            </button>


            <!-- =============================================
                 PAGE
            ============================================== -->

            <span class="twitch-videos__page">

                Page

                <strong>
                    {{ currentPage }}
                </strong>

                /

                <strong>
                    {{ totalPages }}
                </strong>

            </span>


            <!-- =============================================
                 SUIVANT
            ============================================== -->

            <button
                type="button"
                class="twitch-videos__pagination-button"
                :disabled="!canGoNext"
                @click="nextPage"
            >

                Suivant →

            </button>

        </nav>

    </section>

</template>