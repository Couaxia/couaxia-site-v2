<script setup lang="ts">

import {
    computed,
    onBeforeUnmount,
    onMounted,
    ref
} from "vue";

import {
    apiFetch
} from "../../services/api";

import AppLoader
    from "../ui/AppLoader.vue";


/* =========================================================
   TYPES
========================================================= */

interface TwitchClip {

    id:
        string;

    title:
        string;

    creatorName:
        string;

    url:
        string;

    embedUrl:
        string;

    thumbnailUrl:
        string;

    views:
        number;

    createdAt:
        string;

    duration:
        number;

    gameId:
        string;

    videoId:
        string;

}


interface TwitchClipsResponse {

    success:
        boolean;

    data?:
        TwitchClip[];

    total?:
        number;

    message?:
        string;

    error?:
        string;

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
    ref<TwitchClip[]>(
        []
    );


const loading =
    ref(
        true
    );


const errorMessage =
    ref<string | null>(
        null
    );


const currentPage =
    ref(
        1
    );


/* =========================================================
   MASCOT TIMER
========================================================= */

let mascotHoverTimer:
    number | null =
        null;


/* =========================================================
   COMPUTED — TOTAL PAGES
========================================================= */

const totalPages =
    computed(
        () => {

            return Math.max(
                1,
                Math.ceil(
                    clips.value.length
                    /
                    CLIPS_PER_PAGE
                )
            );

        }
    );


/* =========================================================
   COMPUTED — CLIPS PAGE ACTUELLE
========================================================= */

const paginatedClips =
    computed(
        () => {

            const start =
                (
                    currentPage.value -
                    1
                )
                *
                CLIPS_PER_PAGE;


            const end =
                start +
                CLIPS_PER_PAGE;


            return clips.value.slice(
                start,
                end
            );

        }
    );


/* =========================================================
   COMPUTED — PAGINATION
========================================================= */

const canGoPrevious =
    computed(
        () => {

            return (
                currentPage.value >
                1
            );

        }
    );


const canGoNext =
    computed(
        () => {

            return (
                currentPage.value <
                totalPages.value
            );

        }
    );


/* =========================================================
   RANDOM MASCOT MESSAGE
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


    const randomIndex =
        Math.floor(
            Math.random()
            *
            messages.length
        );


    return (
        messages[randomIndex]
        ??
        ""
    );

}


/* =========================================================
   SEND MASCOT MESSAGE
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
   START MASCOT HOVER
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
            400
        );

}


/* =========================================================
   STOP MASCOT HOVER
========================================================= */

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
   SECTION MESSAGES
========================================================= */

const clipsMessages = [

    "Bienvenue dans les archives du chaos ! 🎬",

    "Ici, tu peux retrouver certains des meilleurs moments des lives !",

    "Des fails, des cris et beaucoup trop de moments absurdes... 😂",

    "Les clips sont les preuves officielles de mes catastrophes en stream.",

    "Pourquoi est-ce que les Poups clippent toujours mes pires moments ? 👀",

    "Il y a beaucoup trop de preuves contre moi dans cette section... 🐙"

];


/* =========================================================
   ALL CLIPS MESSAGES
========================================================= */

const allClipsMessages = [

    "Tu veux voir encore plus de clips ? 👀",

    "Attention, Twitch contient encore beaucoup plus de preuves !",

    "Direction Twitch pour découvrir tous les clips ! 🎬",

    "Tu es vraiment certain de vouloir fouiller les archives ? 😂",

    "Les Poups ont clippé beaucoup trop de choses...",

    "Il y en a encore plein directement sur Twitch ! 💜"

];


/* =========================================================
   CLIP MESSAGES
========================================================= */

function speakAboutClip(
    clip:
        TwitchClip
) {

    startMascotHover(
        [

            `Ce clip s'appelle « ${clip.title} » ! 🎬`,

            `Ah... « ${clip.title} »... je me souviens de celui-là. 👀`,

            `${clip.creatorName} est responsable de ce clip ! 😂`,

            `Merci ${clip.creatorName} d'avoir immortalisé ce moment ! 💜`,

            `Ce clip possède déjà ${formatViews(clip.views)} vue${clip.views > 1 ? "s" : ""} !`,

            `${formatViews(clip.views)} vue${clip.views > 1 ? "s" : ""} sur cette preuve compromettante...`,

            "Pourquoi est-ce que ce moment a été clippé ? 😭",

            "Je refuse toute responsabilité concernant ce qui se passe dans ce clip. 🐙"

        ]
    );

}


/* =========================================================
   CLIP TITLE MESSAGES
========================================================= */

function speakAboutClipTitle(
    clip:
        TwitchClip
) {

    startMascotHover(
        [

            `« ${clip.title} »... quel titre ! 😂`,

            `Tu veux regarder « ${clip.title} » ?`,

            `Ce moment a été immortalisé par ${clip.creatorName} !`,

            "Clique dessus si tu veux découvrir ce qui s'est passé ! 👀",

            "Attention, je ne garantis absolument pas ma dignité dans ce clip."

        ]
    );

}


/* =========================================================
   CREATOR MESSAGES
========================================================= */

function speakAboutCreator(
    clip:
        TwitchClip
) {

    startMascotHover(
        [

            `Ce clip a été créé par ${clip.creatorName} ! 💜`,

            `${clip.creatorName} était là au bon moment !`,

            `Merci pour le clip, ${clip.creatorName} ! 🐙`,

            `${clip.creatorName} possède maintenant une preuve contre moi... 👀`

        ]
    );

}


/* =========================================================
   VIEWS MESSAGES
========================================================= */

function speakAboutViews(
    clip:
        TwitchClip
) {

    const count =
        formatViews(
            clip.views
        );


    startMascotHover(
        [

            `${count} vue${clip.views > 1 ? "s" : ""} sur ce clip ! 👀`,

            `Vous êtes vraiment ${count} à avoir regardé ça ?!`,

            `${count} vue${clip.views > 1 ? "s" : ""}... ma dignité diminue à chaque clic. 😂`,

            `Ce moment a déjà été vu ${count} fois !`,

            "Pourquoi vous regardez autant mes catastrophes ? 😭"

        ]
    );

}


/* =========================================================
   EMPTY MESSAGES
========================================================= */

const emptyMessages = [

    "Aucun clip ? Ma dignité est sauvée ! 😂",

    "Les archives sont vides pour le moment.",

    "Pas encore de preuves compromettantes ici !",

    "Il faudra créer quelques clips pendant les prochains streams ! 🎬"

];


/* =========================================================
   PAGINATION MESSAGES
========================================================= */

function speakAboutPreviousPage() {

    startMascotHover(
        [

            "On retourne voir les clips précédents !",

            "Retour dans les archives ! 🎬",

            `Direction la page ${Math.max(1, currentPage.value - 1)} !`,

            "Tu veux revoir les catastrophes précédentes ? 😂"

        ]
    );

}


function speakAboutNextPage() {

    startMascotHover(
        [

            "Encore plus de clips ! 👀",

            "Voyons les prochaines preuves contre moi...",

            `Direction la page ${Math.min(totalPages.value, currentPage.value + 1)} !`,

            "Tu continues vraiment à fouiller les archives ? 😂",

            "Il y a encore du chaos à découvrir ! 🐙"

        ]
    );

}


function speakAboutPagination() {

    startMascotHover(
        [

            `Tu es actuellement à la page ${currentPage.value} sur ${totalPages.value}.`,

            `${totalPages.value} page${totalPages.value > 1 ? "s" : ""} de clips... ça commence à faire beaucoup de preuves. 👀`,

            "Tu peux naviguer entre les différentes pages de clips !",

            "Les archives sont organisées... contrairement à mes streams. 😂"

        ]
    );

}


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

        const result =
            await apiFetch<TwitchClipsResponse>(
                "/api/twitch/clips?first=100"
            );


        /* =================================================
           API ERROR
        ================================================= */

        if (
            !result.success
            ||
            !result.data
        ) {

            throw new Error(
                result.error
                ??
                result.message
                ??
                "Impossible de récupérer les clips Twitch."
            );

        }


        /* =================================================
           SUCCESS
        ================================================= */

        clips.value =
            result.data;


        currentPage.value =
            1;

    }

    catch (
        error:
            unknown
    ) {

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


    sendMascotMessage(
        getRandomMessage(
            [
                `Bienvenue à la page ${currentPage.value} !`,
                "Encore quelques souvenirs par ici ! 🎬",
                "Retour vers les clips précédents !"
            ]
        )
    );

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


    sendMascotMessage(
        getRandomMessage(
            [
                `Bienvenue à la page ${currentPage.value} !`,
                "Encore plus de clips à découvrir ! 👀",
                "Continuons notre exploration des archives ! 🐙"
            ]
        )
    );

}


/* =========================================================
   FORMAT VIEWS
========================================================= */

function formatViews(
    value:
        number | null | undefined
):
    string {

    const safeValue =
        Number(
            value
            ??
            0
        );


    if (
        !Number.isFinite(
            safeValue
        )
    ) {

        return "0";

    }


    return safeValue.toLocaleString(
        "fr-FR"
    );

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
    value:
        string
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
    value:
        number
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
        `${minutes}:`
        +
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


/* =========================================================
   CLEANUP
========================================================= */

onBeforeUnmount(
    () => {

        stopMascotHover();

    }
);

</script>


<template>

    <section
        class="twitch-clips"

        @mouseenter="
            startMascotHover(
                clipsMessages
            )
        "

        @mouseleave="
            stopMascotHover
        "
    >

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
                    et du chaos :
                    retrouve ici les
                    meilleurs moments de mes lives !

                </p>

            </div>


            <a
                href="https://www.twitch.tv/couaxia/clips"

                target="_blank"

                rel="noopener noreferrer"

                class="twitch-clips__all"

                @mouseenter.stop="
                    startMascotHover(
                        allClipsMessages
                    )
                "

                @mouseleave.stop="
                    stopMascotHover
                "

                @focus.stop="
                    startMascotHover(
                        allClipsMessages
                    )
                "

                @blur.stop="
                    stopMascotHover
                "
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

                    :key="
                        clip.id
                    "

                    class="
                        twitch-clip-card
                    "

                    tabindex="0"

                    @mouseenter.stop="
                        speakAboutClip(
                            clip
                        )
                    "

                    @mouseleave.stop="
                        stopMascotHover
                    "

                    @focus.stop="
                        speakAboutClip(
                            clip
                        )
                    "

                    @blur.stop="
                        stopMascotHover
                    "
                >

                    <!-- =====================================
                         THUMBNAIL
                    ====================================== -->

                    <a
                        :href="
                            clip.url
                        "

                        target="_blank"

                        rel="noopener noreferrer"

                        class="
                            twitch-clip-card__thumbnail-link
                        "

                        @mouseenter.stop="
                            speakAboutClip(
                                clip
                            )
                        "

                        @mouseleave.stop="
                            stopMascotHover
                        "

                        @focus.stop="
                            speakAboutClip(
                                clip
                            )
                        "

                        @blur.stop="
                            stopMascotHover
                        "
                    >

                        <img
                            :src="
                                clip.thumbnailUrl
                            "

                            :alt="
                                `Miniature du clip ${clip.title}`
                            "

                            class="
                                twitch-clip-card__thumbnail
                            "

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
                            :href="
                                clip.url
                            "

                            target="_blank"

                            rel="noopener noreferrer"

                            class="
                                twitch-clip-card__title
                            "

                            @mouseenter.stop="
                                speakAboutClipTitle(
                                    clip
                                )
                            "

                            @mouseleave.stop="
                                stopMascotHover
                            "

                            @focus.stop="
                                speakAboutClipTitle(
                                    clip
                                )
                            "

                            @blur.stop="
                                stopMascotHover
                            "
                        >
                            {{ clip.title }}
                        </a>


                        <!-- =================================
                             CREATOR
                        ================================== -->

                        <p
                            class="
                                twitch-clip-card__creator
                            "

                            tabindex="0"

                            @mouseenter.stop="
                                speakAboutCreator(
                                    clip
                                )
                            "

                            @mouseleave.stop="
                                stopMascotHover
                            "

                            @focus.stop="
                                speakAboutCreator(
                                    clip
                                )
                            "

                            @blur.stop="
                                stopMascotHover
                            "
                        >

                            Par


                            <strong>
                                {{ clip.creatorName }}
                            </strong>

                        </p>


                        <!-- =================================
                             VIEWS
                        ================================== -->

                        <p
                            class="
                                twitch-clip-card__views
                            "

                            tabindex="0"

                            @mouseenter.stop="
                                speakAboutViews(
                                    clip
                                )
                            "

                            @mouseleave.stop="
                                stopMascotHover
                            "

                            @focus.stop="
                                speakAboutViews(
                                    clip
                                )
                            "

                            @blur.stop="
                                stopMascotHover
                            "
                        >

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
                            class="
                                twitch-clip-card__date
                            "

                            :datetime="
                                clip.createdAt
                            "
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

                class="
                    twitch-clips__empty
                "

                tabindex="0"

                @mouseenter.stop="
                    startMascotHover(
                        emptyMessages
                    )
                "

                @mouseleave.stop="
                    stopMascotHover
                "

                @focus.stop="
                    startMascotHover(
                        emptyMessages
                    )
                "

                @blur.stop="
                    stopMascotHover
                "
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
                v-if="
                    totalPages > 1
                "

                class="
                    twitch-clips__pagination
                "

                aria-label="
                    Pagination des clips Twitch
                "
            >

                <!-- PREVIOUS -->

                <button
                    type="button"

                    class="
                        twitch-clips__pagination-button
                    "

                    :disabled="
                        !canGoPrevious
                    "

                    @mouseenter.stop="
                        speakAboutPreviousPage
                    "

                    @mouseleave.stop="
                        stopMascotHover
                    "

                    @focus.stop="
                        speakAboutPreviousPage
                    "

                    @blur.stop="
                        stopMascotHover
                    "

                    @click.stop="
                        previousPage
                    "
                >
                    ← Précédent
                </button>


                <!-- PAGE -->

                <span
                    class="
                        twitch-clips__page
                    "

                    tabindex="0"

                    @mouseenter.stop="
                        speakAboutPagination
                    "

                    @mouseleave.stop="
                        stopMascotHover
                    "

                    @focus.stop="
                        speakAboutPagination
                    "

                    @blur.stop="
                        stopMascotHover
                    "
                >

                    Page


                    <strong>
                        {{ currentPage }}
                    </strong>


                    /


                    <strong>
                        {{ totalPages }}
                    </strong>

                </span>


                <!-- NEXT -->

                <button
                    type="button"

                    class="
                        twitch-clips__pagination-button
                    "

                    :disabled="
                        !canGoNext
                    "

                    @mouseenter.stop="
                        speakAboutNextPage
                    "

                    @mouseleave.stop="
                        stopMascotHover
                    "

                    @focus.stop="
                        speakAboutNextPage
                    "

                    @blur.stop="
                        stopMascotHover
                    "

                    @click.stop="
                        nextPage
                    "
                >
                    Suivant →
                </button>

            </nav>

        </template>

    </section>

</template>