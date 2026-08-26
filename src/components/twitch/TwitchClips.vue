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

interface TwitchClip {
    id: string;

    title: string;

    creatorName: string;

    url: string;

    embedUrl: string;

    thumbnailUrl: string;

    views: number;

    createdAt: string;

    duration: number;

    gameId: string;

    videoId: string;
}


interface TwitchClipsResponse {
    success: boolean;

    data?: TwitchClip[];

    total?: number;

    message?: string;

    error?: string;
}


/* =========================================================
   CONFIG
========================================================= */

const CLIPS_PER_PAGE =
    4;


/* =========================================================
   STATE
========================================================= */

const clips =
    ref<TwitchClip[]>([]);


const loading =
    ref(true);


const errorMessage =
    ref<string | null>(
        null
    );


const currentPage =
    ref(1);


/* =========================================================
   COMPUTED — TOTAL PAGES
========================================================= */

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


/* =========================================================
   COMPUTED — CLIPS PAGE ACTUELLE
========================================================= */

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


/* =========================================================
   COMPUTED — PAGINATION
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
   LOAD CLIPS
========================================================= */

async function loadClips():
    Promise<void> {

    loading.value =
        true;


    errorMessage.value =
        null;


    try {

        const response =
            await fetch(
                "/api/twitch/clips?first=100"
            );


        const result: TwitchClipsResponse =
            await response.json();


        if (
            !response.ok ||
            !result.success ||
            !result.data
        ) {

            throw new Error(
                result.error ??
                result.message ??
                "Impossible de récupérer les clips Twitch."
            );

        }


        clips.value =
            result.data;


        currentPage.value =
            1;

    }

    catch (error: unknown) {

        console.error(
            "Erreur clips Twitch :",
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
   PAGINATION — PRÉCÉDENT
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


/* =========================================================
   PAGINATION — SUIVANT
========================================================= */

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


/* =========================================================
   FORMAT DURATION
========================================================= */

function formatDuration(
    value: number
) {

    const totalSeconds =
        Math.max(
            0,
            Math.floor(
                value
            )
        );


    const minutes =
        Math.floor(
            totalSeconds /
            60
        );


    const seconds =
        totalSeconds %
        60;


    return (
        `${minutes}:` +
        `${seconds
            .toString()
            .padStart(
                2,
                "0"
            )}`
    );

}


/* =========================================================
   MOUNT
========================================================= */

onMounted(
    loadClips
);
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

                <p class="twitch-clips__description">

                    Des fails, des fous rires 
                    et du chaos 
                    : retrouve ici les 
                    meilleurs moments de mes lives !

                </p>

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
             LOADING
        ================================================== -->

        <AppLoader
            v-if="loading"
            text="Chargement des clips..."
        />


        <!-- =================================================
             ERROR
        ================================================== -->

        <div
            v-else-if="errorMessage"
            class="twitch-clips__error"
            role="alert"
        >

            <strong>
                Impossible de charger les clips.
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
                 GRID
            ============================================== -->

            <div
                v-if="paginatedClips.length > 0"
                class="twitch-clips__grid"
            >

                <article
                    v-for="clip in paginatedClips"
                    :key="clip.id"
                    class="twitch-clip-card"
                >

                    <!-- =====================================
                         THUMBNAIL
                    ====================================== -->

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


                        <!-- =================================
                             TYPE
                        ================================== -->

                        <span class="twitch-clip-card__type">
                            Clip
                        </span>


                        <!-- =================================
                             DURÉE
                        ================================== -->

                        <span class="twitch-clip-card__duration">

                            {{
                                formatDuration(
                                    clip.duration
                                )
                            }}

                        </span>


                        <!-- =================================
                             PLAY
                        ================================== -->

                        <span
                            class="twitch-clip-card__play"
                            aria-hidden="true"
                        >
                            ▶
                        </span>

                    </a>


                    <!-- =====================================
                         CONTENT
                    ====================================== -->

                    <div class="twitch-clip-card__content">

                        <!-- =================================
                             TITLE
                        ================================== -->

                        <a
                            :href="clip.url"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="twitch-clip-card__title"
                        >
                            {{ clip.title }}
                        </a>


                        <!-- =================================
                             CREATOR
                        ================================== -->

                        <p class="twitch-clip-card__creator">

                            Par

                            <strong>
                                {{ clip.creatorName }}
                            </strong>

                        </p>


                        <!-- =================================
                             VIEWS
                        ================================== -->

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


                        <!-- =================================
                             DATE
                        ================================== -->

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


            <!-- =============================================
                 EMPTY
            ============================================== -->

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


            <!-- =============================================
                 PAGINATION
            ============================================== -->

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

        </template>

    </section>

</template>