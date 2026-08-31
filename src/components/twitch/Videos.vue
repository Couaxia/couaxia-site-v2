<script setup lang="ts">

import {
    computed,
    onBeforeUnmount,
    onMounted,
    ref
} from "vue";

import AppLoader
    from "../ui/AppLoader.vue";

import {
    apiFetch
} from "../../services/api.ts";


/* =========================================================
   TYPES
========================================================= */

interface TwitchVideo {

    id:
        string;

    title:
        string;

    description:
        string;

    url:
        string;

    thumbnailUrl:
        string;

    views:
        number;

    createdAt:
        string;

    publishedAt:
        string;

    duration:
        string;

    language:
        string;

    type:
        string;

}


interface TwitchVideosResponse {

    success:
        boolean;

    data?:
        TwitchVideo[];

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

const VIDEOS_PER_PAGE =
    4;


/* =========================================================
   STATE
========================================================= */

const videos =
    ref<TwitchVideo[]>(
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
   TOTAL PAGES
========================================================= */

const totalPages =
    computed(
        () => {

            return Math.max(
                1,
                Math.ceil(
                    videos.value.length
                    /
                    VIDEOS_PER_PAGE
                )
            );

        }
    );


/* =========================================================
   VIDEOS DE LA PAGE
========================================================= */

const paginatedVideos =
    computed(
        () => {

            const start =
                (
                    currentPage.value -
                    1
                )
                *
                VIDEOS_PER_PAGE;


            const end =
                start +
                VIDEOS_PER_PAGE;


            return videos.value.slice(
                start,
                end
            );

        }
    );


/* =========================================================
   PAGINATION
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

const videosMessages = [

    "Tu as raté un live ? Pas de panique ! 📺",

    "Bienvenue dans les archives de mes anciennes aventures !",

    "Ici, tu peux rattraper quelques streams que tu as manqués. 💜",

    "Des heures de Couaxia disponibles en rediffusion... courage ! 😂",

    "Tu veux revoir certaines de nos anciennes aventures ?",

    "Les rediffusions sont parfaites quand tu arrives trop tard pour le direct ! 🐙"

];


/* =========================================================
   ALL VIDEOS MESSAGES
========================================================= */

const allVideosMessages = [

    "Tu veux encore plus de rediffusions ? 👀",

    "Toutes mes vidéos Twitch t'attendent juste ici !",

    "Direction Twitch pour explorer toutes les archives ! 📺",

    "Attention, tu risques de partir pour plusieurs heures de vidéos. 😂",

    "Il reste encore beaucoup d'anciennes aventures à découvrir !",

    "Tu veux vraiment fouiller toutes mes archives ? 🐙"

];


/* =========================================================
   VIDEO MESSAGES
========================================================= */

function speakAboutVideo(
    video:
        TwitchVideo
) {

    const views =
        formatViews(
            video.views
        );


    startMascotHover(
        [

            `Cette vidéo s'appelle « ${video.title} » ! 📺`,

            `Tu veux revoir « ${video.title} » ?`,

            `Cette rediffusion possède ${views} vue${video.views > 1 ? "s" : ""} !`,

            `${video.duration} de Couaxia... tu es prêt ? 👀`,

            `Cette aventure date du ${formatDate(video.createdAt)} !`,

            `Type : ${formatVideoType(video.type)}.`,

            "Attention, cette vidéo peut contenir beaucoup trop de chaos. 😂",

            "Installe-toi confortablement, la rediffusion t'attend ! 💜"

        ]
    );

}


/* =========================================================
   TITLE MESSAGES
========================================================= */

function speakAboutTitle(
    video:
        TwitchVideo
) {

    startMascotHover(
        [

            `« ${video.title} »... voilà le titre de cette aventure !`,

            `Tu te souviens de « ${video.title} » ? 👀`,

            "Clique sur le titre si tu veux ouvrir la vidéo directement sur Twitch.",

            "Mes titres de streams sont parfois très inspirés... parfois. 😂"

        ]
    );

}


/* =========================================================
   TYPE MESSAGES
========================================================= */

function speakAboutType(
    video:
        TwitchVideo
) {

    const type =
        formatVideoType(
            video.type
        );


    startMascotHover(
        [

            `Cette vidéo est classée comme « ${type} » !`,

            `${type} : voilà le type de cette vidéo Twitch.`,

            `Twitch considère cette aventure comme une ${type.toLowerCase()}.`,

            "Une petite information pour savoir ce que tu t'apprêtes à regarder. 👀"

        ]
    );

}


/* =========================================================
   DURATION MESSAGES
========================================================= */

function speakAboutDuration(
    video:
        TwitchVideo
) {

    startMascotHover(
        [

            `Cette vidéo dure ${video.duration} ! ⏱️`,

            `${video.duration} d'aventure... prévois peut-être quelque chose à boire. 😂`,

            `Tu as ${video.duration} devant toi ?`,

            "Installe-toi confortablement, ça peut durer un moment ! 💜"

        ]
    );

}


/* =========================================================
   VIEWS MESSAGES
========================================================= */

function speakAboutViews(
    video:
        TwitchVideo
) {

    const count =
        formatViews(
            video.views
        );


    startMascotHover(
        [

            `${count} vue${video.views > 1 ? "s" : ""} sur cette vidéo ! 👀`,

            `Vous êtes déjà ${count} à avoir regardé cette aventure !`,

            `${count} vue${video.views > 1 ? "s" : ""}... ça commence à faire du monde !`,

            "Merci à toutes les personnes qui regardent mes rediffusions ! 💜",

            "Même hors live, mes aventures continuent d'être regardées ! 🐙"

        ]
    );

}


/* =========================================================
   DATE MESSAGES
========================================================= */

function speakAboutDate(
    video:
        TwitchVideo
) {

    const date =
        formatDate(
            video.createdAt
        );


    startMascotHover(
        [

            `Cette aventure date du ${date}.`,

            `Le ${date}... encore un souvenir rangé dans les archives !`,

            "Ça commence déjà à dater un peu, non ? 👀",

            `Voilà une petite capsule temporelle du ${date} !`

        ]
    );

}


/* =========================================================
   DESCRIPTION MESSAGES
========================================================= */

function speakAboutDescription(
    video:
        TwitchVideo
) {

    startMascotHover(
        [

            "Un petit résumé pour savoir ce qui t'attend !",

            "La description peut parfois donner quelques indices sur la vidéo. 👀",

            `Cette rediffusion raconte : ${video.description}`,

            "Attention, la description ne raconte sûrement pas tout le chaos du stream. 😂"

        ]
    );

}


/* =========================================================
   WATCH BUTTON MESSAGES
========================================================= */

function speakAboutWatchButton(
    video:
        TwitchVideo
) {

    startMascotHover(
        [

            `Tu veux regarder « ${video.title} » ? ▶️`,

            "Clique ici pour ouvrir la vidéo sur Twitch !",

            "Prépare le popcorn, la rediffusion t'attend. 🍿",

            `Direction Twitch pour ${video.title} !`,

            "Bonne rediffusion ! 💜",

            "Attention, aucun remboursement de dignité après avoir regardé. 😂"

        ]
    );

}


/* =========================================================
   EMPTY MESSAGES
========================================================= */

const emptyMessages = [

    "Aucune rediffusion ? Les archives sont vides ! 📺",

    "Rien à regarder ici pour le moment.",

    "Les prochaines rediffusions apparaîtront automatiquement !",

    "Il va falloir refaire quelques streams pour remplir tout ça. 👀"

];


/* =========================================================
   PAGINATION MESSAGES
========================================================= */

function speakAboutPreviousPage() {

    startMascotHover(
        [

            "Retour vers les vidéos précédentes !",

            `Direction la page ${Math.max(1, currentPage.value - 1)} !`,

            "On remonte un peu dans les archives. 📺",

            "Tu veux revoir les aventures précédentes ?"

        ]
    );

}


function speakAboutNextPage() {

    startMascotHover(
        [

            "Encore plus de rediffusions ! 👀",

            `Direction la page ${Math.min(totalPages.value, currentPage.value + 1)} !`,

            "Continuons notre exploration des archives !",

            "Tu n'en as toujours pas assez ? 😂",

            "Encore quelques heures de Couaxia juste après ! 🐙"

        ]
    );

}


function speakAboutPagination() {

    startMascotHover(
        [

            `Tu es actuellement à la page ${currentPage.value} sur ${totalPages.value}.`,

            `${totalPages.value} page${totalPages.value > 1 ? "s" : ""} de vidéos à explorer !`,

            "Les rediffusions sont rangées par pages pour éviter de faire exploser le site. 😂",

            "Tu peux naviguer tranquillement dans les archives !"

        ]
    );

}


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

        const result =
            await apiFetch<TwitchVideosResponse>(
                "/api/twitch/videos?first=100"
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
                "Impossible de récupérer les vidéos Twitch."
            );

        }


        /* =================================================
           SUCCESS
        ================================================= */

        videos.value =
            result.data;


        currentPage.value =
            1;

    }

    catch (
        error:
            unknown
    ) {

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


    sendMascotMessage(
        getRandomMessage(
            [
                `Bienvenue à la page ${currentPage.value} !`,
                "Retour vers quelques anciennes aventures ! 📺",
                "Voyons les vidéos précédentes !"
            ]
        )
    );


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


    sendMascotMessage(
        getRandomMessage(
            [
                `Bienvenue à la page ${currentPage.value} !`,
                "Encore plus de rediffusions à découvrir ! 👀",
                "Continuons notre exploration ! 🐙"
            ]
        )
    );


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
                ?.scrollIntoView(
                    {
                        behavior:
                            "smooth",

                        block:
                            "start"
                    }
                );

        }
    );

}


/* =========================================================
   FORMAT VIEWS
========================================================= */

function formatViews(
    value:
        number
) {

    return value.toLocaleString(
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
    url:
        string
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
    type:
        string
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
        class="twitch-videos"

        @mouseenter="
            startMascotHover(
                videosMessages
            )
        "

        @mouseleave="
            stopMascotHover
        "
    >

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

                class="
                    twitch-videos__all
                "

                @mouseenter.stop="
                    startMascotHover(
                        allVideosMessages
                    )
                "

                @mouseleave.stop="
                    stopMascotHover
                "

                @focus.stop="
                    startMascotHover(
                        allVideosMessages
                    )
                "

                @blur.stop="
                    stopMascotHover
                "
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
            v-else-if="
                errorMessage
            "

            class="
                twitch-videos__error
            "

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
                v-if="
                    paginatedVideos.length > 0
                "

                class="
                    twitch-videos__grid
                "
            >

                <article
                    v-for="
                        video in paginatedVideos
                    "

                    :key="
                        video.id
                    "

                    class="
                        twitch-video-card
                    "

                    tabindex="0"

                    @mouseenter.stop="
                        speakAboutVideo(
                            video
                        )
                    "

                    @mouseleave.stop="
                        stopMascotHover
                    "

                    @focus.stop="
                        speakAboutVideo(
                            video
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
                            video.url
                        "

                        target="_blank"

                        rel="
                            noopener noreferrer
                        "

                        class="
                            twitch-video-card__thumbnail-link
                        "

                        @mouseenter.stop="
                            speakAboutVideo(
                                video
                            )
                        "

                        @mouseleave.stop="
                            stopMascotHover
                        "

                        @focus.stop="
                            speakAboutVideo(
                                video
                            )
                        "

                        @blur.stop="
                            stopMascotHover
                        "
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

                            class="
                                twitch-video-card__thumbnail
                            "

                            loading="lazy"
                        >


                        <!-- =================================
                             TYPE
                        ================================== -->

                        <span
                            class="
                                twitch-video-card__type
                            "

                            tabindex="0"

                            @mouseenter.stop="
                                speakAboutType(
                                    video
                                )
                            "

                            @mouseleave.stop="
                                stopMascotHover
                            "

                            @focus.stop="
                                speakAboutType(
                                    video
                                )
                            "

                            @blur.stop="
                                stopMascotHover
                            "
                        >

                            {{
                                formatVideoType(
                                    video.type
                                )
                            }}

                        </span>


                        <!-- =================================
                             DURATION
                        ================================== -->

                        <span
                            class="
                                twitch-video-card__duration
                            "

                            tabindex="0"

                            @mouseenter.stop="
                                speakAboutDuration(
                                    video
                                )
                            "

                            @mouseleave.stop="
                                stopMascotHover
                            "

                            @focus.stop="
                                speakAboutDuration(
                                    video
                                )
                            "

                            @blur.stop="
                                stopMascotHover
                            "
                        >

                            {{ video.duration }}

                        </span>


                        <!-- =================================
                             PLAY
                        ================================== -->

                        <span
                            class="
                                twitch-video-card__play
                            "

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
                            :href="
                                video.url
                            "

                            target="_blank"

                            rel="
                                noopener noreferrer
                            "

                            class="
                                twitch-video-card__title
                            "

                            @mouseenter.stop="
                                speakAboutTitle(
                                    video
                                )
                            "

                            @mouseleave.stop="
                                stopMascotHover
                            "

                            @focus.stop="
                                speakAboutTitle(
                                    video
                                )
                            "

                            @blur.stop="
                                stopMascotHover
                            "
                        >

                            {{ video.title }}

                        </a>


                        <!-- =================================
                             META
                        ================================== -->

                        <div class="twitch-video-card__meta">

                            <!-- VIEWS -->

                            <span
                                tabindex="0"

                                @mouseenter.stop="
                                    speakAboutViews(
                                        video
                                    )
                                "

                                @mouseleave.stop="
                                    stopMascotHover
                                "

                                @focus.stop="
                                    speakAboutViews(
                                        video
                                    )
                                "

                                @blur.stop="
                                    stopMascotHover
                                "
                            >

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


                            <!-- DATE -->

                            <time
                                :datetime="
                                    video.createdAt
                                "

                                tabindex="0"

                                @mouseenter.stop="
                                    speakAboutDate(
                                        video
                                    )
                                "

                                @mouseleave.stop="
                                    stopMascotHover
                                "

                                @focus.stop="
                                    speakAboutDate(
                                        video
                                    )
                                "

                                @blur.stop="
                                    stopMascotHover
                                "
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
                            v-if="
                                video.description
                            "

                            class="
                                twitch-video-card__description
                            "

                            tabindex="0"

                            @mouseenter.stop="
                                speakAboutDescription(
                                    video
                                )
                            "

                            @mouseleave.stop="
                                stopMascotHover
                            "

                            @focus.stop="
                                speakAboutDescription(
                                    video
                                )
                            "

                            @blur.stop="
                                stopMascotHover
                            "
                        >

                            {{ video.description }}

                        </p>


                        <!-- =================================
                             BUTTON
                        ================================== -->

                        <a
                            :href="
                                video.url
                            "

                            target="_blank"

                            rel="
                                noopener noreferrer
                            "

                            class="
                                twitch-video-card__button
                            "

                            @mouseenter.stop="
                                speakAboutWatchButton(
                                    video
                                )
                            "

                            @mouseleave.stop="
                                stopMascotHover
                            "

                            @focus.stop="
                                speakAboutWatchButton(
                                    video
                                )
                            "

                            @blur.stop="
                                stopMascotHover
                            "
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

                class="
                    twitch-videos__empty
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
                v-if="
                    totalPages > 1
                "

                class="
                    twitch-videos__pagination
                "

                aria-label="
                    Pagination des vidéos Twitch
                "
            >

                <!-- PREVIOUS -->

                <button
                    type="button"

                    class="
                        twitch-videos__pagination-button
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
                        twitch-videos__page
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
                        twitch-videos__pagination-button
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