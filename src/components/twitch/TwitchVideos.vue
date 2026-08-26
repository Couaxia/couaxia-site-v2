<script setup lang="ts">
import {
    computed,
    onMounted,
    ref
} from "vue";
import AppLoader from "../ui/AppLoader.vue";


/* =========================================================
   TYPES
========================================================= */

interface TwitchVideo {
    id: string;

    title: string;

    description: string;

    url: string;

    thumbnailUrl: string;

    views: number;

    createdAt: string;

    publishedAt: string;

    duration: string;

    language: string;

    type: string;
}


interface TwitchVideosResponse {
    success: boolean;

    data?: TwitchVideo[];

    total?: number;

    message?: string;

    error?: string;
}


/* =========================================================
   CONFIG
========================================================= */

const VIDEOS_PER_PAGE =
    4;


/* =========================================================
   STATE
========================================================= */

const videos =
    ref<TwitchVideo[]>([]);


const loading =
    ref(true);


const errorMessage =
    ref<string | null>(
        null
    );


const currentPage =
    ref(1);


/* =========================================================
   TOTAL PAGES
========================================================= */

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


/* =========================================================
   VIDEOS DE LA PAGE
========================================================= */

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


/* =========================================================
   PAGINATION
========================================================= */

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
   LOAD VIDEOS
========================================================= */

async function loadVideos():
    Promise<void> {

    loading.value =
        true;


    errorMessage.value =
        null;


    try {

        const response =
            await fetch(
                "/api/twitch/videos?first=100"
            );


        const result: TwitchVideosResponse =
            await response.json();


        if (
            !response.ok ||
            !result.success ||
            !result.data
        ) {

            throw new Error(
                result.error ??
                result.message ??
                "Impossible de récupérer les vidéos Twitch."
            );

        }


        videos.value =
            result.data;


        currentPage.value =
            1;

    }

    catch (error: unknown) {

        console.error(
            "Erreur vidéos Twitch :",
            error
        );


        errorMessage.value =
            error instanceof Error
                ? error.message
                : "Une erreur inconnue est survenue.";

    }

    finally {

        loading.value =
            false;

    }

}


/* =========================================================
   PREVIOUS PAGE
========================================================= */

function previousPage() {

    if (
        !canGoPrevious.value
    ) {

        return;

    }


    currentPage.value -=
        1;


    scrollToVideos();

}


/* =========================================================
   NEXT PAGE
========================================================= */

function nextPage() {

    if (
        !canGoNext.value
    ) {

        return;

    }


    currentPage.value +=
        1;


    scrollToVideos();

}


/* =========================================================
   SCROLL
========================================================= */

function scrollToVideos() {

    window.requestAnimationFrame(
        () => {

            document
                .querySelector(
                    ".twitch-videos"
                )
                ?.scrollIntoView({
                    behavior:
                        "smooth",

                    block:
                        "start"
                });

        }
    );

}


/* =========================================================
   FORMAT VIEWS
========================================================= */

function formatViews(
    value: number
) {

    return value.toLocaleString(
        "fr-FR"
    );

}


/* =========================================================
   FORMAT DATE
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
                "numeric"
        }
    ).format(
        date
    );

}


/* =========================================================
   FORMAT THUMBNAIL
========================================================= */

function formatThumbnail(
    url: string
) {

    return url
        .replace(
            "%{width}",
            "640"
        )
        .replace(
            "%{height}",
            "360"
        )
        .replace(
            "{width}",
            "640"
        )
        .replace(
            "{height}",
            "360"
        );

}


/* =========================================================
   FORMAT TYPE
========================================================= */

function formatVideoType(
    type: string
) {

    switch (
        type
    ) {

        case "archive":

            return "Rediffusion";


        case "highlight":

            return "Temps fort";


        case "upload":

            return "Vidéo";


        default:

            return "Vidéo";

    }

}


/* =========================================================
   MOUNT
========================================================= */

onMounted(
    loadVideos
);
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


                <p class="twitch-videos__description">

                    Tu as raté un live ?
                    Retrouve ici mes dernières
                    rediffusions Twitch.

                </p>

            </div>


            <a
                href="https://www.twitch.tv/couaxia/videos"
                target="_blank"
                rel="noopener noreferrer"
                class="twitch-videos__all"
            >

                Toutes les vidéos

                <span aria-hidden="true">
                    ↗
                </span>

            </a>

        </header>


        <!-- =================================================
             LOADING
        ================================================== -->

        <AppLoader
            v-if="loading"
            text="Chargement des vidéos..."
        />


        <!-- =================================================
             ERROR
        ================================================== -->

        <div
            v-else-if="errorMessage"
            class="twitch-videos__error"
            role="alert"
        >

            <strong>
                Impossible de charger les vidéos.
            </strong>


            <p>
                {{ errorMessage }}
            </p>

        </div>


        <!-- =================================================
             CONTENT
        ================================================== -->

        <template v-else>

            <!-- =============================================
                 VIDEOS GRID
            ============================================== -->

            <div
                v-if="paginatedVideos.length > 0"
                class="twitch-videos__grid"
            >

                <article
                    v-for="video in paginatedVideos"
                    :key="video.id"
                    class="twitch-video-card"
                >

                    <!-- =====================================
                         THUMBNAIL
                    ====================================== -->

                    <a
                        :href="video.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="twitch-video-card__thumbnail-link"
                    >

                        <img
                            :src="
                                formatThumbnail(
                                    video.thumbnailUrl
                                )
                            "
                            :alt="
                                `Miniature de ${video.title}`
                            "
                            class="twitch-video-card__thumbnail"
                            loading="lazy"
                        >


                        <!-- =================================
                             TYPE
                        ================================== -->

                        <span class="twitch-video-card__type">

                            {{
                                formatVideoType(
                                    video.type
                                )
                            }}

                        </span>


                        <!-- =================================
                             DURATION
                        ================================== -->

                        <span class="twitch-video-card__duration">

                            {{ video.duration }}

                        </span>


                        <!-- =================================
                             PLAY
                        ================================== -->

                        <span
                            class="twitch-video-card__play"
                            aria-hidden="true"
                        >
                            ▶
                        </span>

                    </a>


                    <!-- =====================================
                         CONTENT
                    ====================================== -->

                    <div class="twitch-video-card__content">

                        <!-- =================================
                             TITLE
                        ================================== -->

                        <a
                            :href="video.url"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="twitch-video-card__title"
                        >

                            {{ video.title }}

                        </a>


                        <!-- =================================
                             META
                        ================================== -->

                        <div class="twitch-video-card__meta">

                            <span>

                                👁

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

                            </span>


                            <time
                                :datetime="video.createdAt"
                            >

                                {{
                                    formatDate(
                                        video.createdAt
                                    )
                                }}

                            </time>

                        </div>


                        <!-- =================================
                             DESCRIPTION
                        ================================== -->

                        <p
                            v-if="video.description"
                            class="twitch-video-card__description"
                        >

                            {{ video.description }}

                        </p>


                        <!-- =================================
                             BUTTON
                        ================================== -->

                        <a
                            :href="video.url"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="twitch-video-card__button"
                        >

                            Regarder

                            <span aria-hidden="true">
                                ↗
                            </span>

                        </a>

                    </div>

                </article>

            </div>


            <!-- =============================================
                 EMPTY
            ============================================== -->

            <div
                v-else
                class="twitch-videos__empty"
            >

                <span aria-hidden="true">
                    📺
                </span>


                <strong>
                    Aucune rediffusion disponible.
                </strong>


                <p>
                    Les prochaines rediffusions
                    apparaîtront automatiquement ici.
                </p>

            </div>


            <!-- =============================================
                 PAGINATION
            ============================================== -->

            <nav
                v-if="totalPages > 1"
                class="twitch-videos__pagination"
                aria-label="Pagination des vidéos Twitch"
            >

                <button
                    type="button"
                    class="twitch-videos__pagination-button"
                    :disabled="!canGoPrevious"
                    @click="previousPage"
                >
                    ← Précédent
                </button>


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


                <button
                    type="button"
                    class="twitch-videos__pagination-button"
                    :disabled="!canGoNext"
                    @click="nextPage"
                >
                    Suivant →
                </button>

            </nav>

        </template>

    </section>

</template>