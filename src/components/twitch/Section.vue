<script setup lang="ts">

import {
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

interface TwitchLiveData {

    isLive:
        boolean;

    userId:
        string;

    login:
        string;

    displayName:
        string;

    profileImageUrl:
        string;

    offlineImageUrl:
        string;

    title:
        string | null;

    gameId:
        string | null;

    gameName:
        string | null;

    viewers:
        number;

    startedAt:
        string | null;

    language:
        string | null;

    thumbnailUrl:
        string | null;

    isMature:
        boolean;

}


interface TwitchLiveResponse {

    success:
        boolean;

    data?:
        TwitchLiveData;

    message?:
        string;

    error?:
        string;

}


/* =========================================================
   API URL
========================================================= */

const rawApiUrl =
    import.meta.env.VITE_API_URL;


const apiUrl =
    rawApiUrl
        ? rawApiUrl.replace(/\/+$/, "")
        : "";


if (
    !apiUrl
) {

    throw new Error(
        "VITE_API_URL est manquante."
    );

}


/* =========================================================
   STATE
========================================================= */

const twitch =
    ref<TwitchLiveData | null>(
        null
    );


const loading =
    ref(
        true
    );


const errorMessage =
    ref<string | null>(
        null
    );


/* =========================================================
   MASCOT TIMER
========================================================= */

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

function speakAboutTwitchSection() {

    if (
        loading.value
    ) {

        startMascotHover(
            [
                "Je vérifie Twitch... une seconde ! 👀",
                "Voyons voir si je suis en direct...",
                "Mes tentacules interrogent Twitch ! 🐙"
            ]
        );


        return;

    }


    if (
        !twitch.value
    ) {

        startMascotHover(
            [
                "Hmm... Twitch ne répond pas pour le moment.",
                "Impossible de récupérer les informations actuellement.",
                "On réessaiera un peu plus tard !"
            ]
        );


        return;

    }


    if (
        twitch.value.isLive
    ) {

        startMascotHover(
            [
                "Je suis actuellement en live ! 🔴",
                `Je suis en train de jouer à ${twitch.value.gameName ?? "quelque chose de mystérieux"} ! 🎮`,
                "Viens rejoindre les Poups en direct ! 💜",
                `${formatViewers(twitch.value.viewers)} personne${twitch.value.viewers > 1 ? "s" : ""} regarde${twitch.value.viewers > 1 ? "nt" : ""} actuellement le live !`,
                "Le chaos est actuellement en cours sur Twitch. 👀"
            ]
        );


        return;

    }


    startMascotHover(
        [
            "Pas de live pour le moment. 🌙",
            "Je suis actuellement hors ligne !",
            "Même une Kraduk doit se reposer de temps en temps. 💤",
            "Le prochain stream arrivera bientôt !",
            "Tu peux quand même découvrir ma chaîne Twitch en attendant. 💜"
        ]
    );

}


/* =========================================================
   STATUS MESSAGES
========================================================= */

function speakAboutStatus() {

    if (
        !twitch.value
    ) {

        return;

    }


    if (
        twitch.value.isLive
    ) {

        startMascotHover(
            [
                "Le petit voyant est allumé : je suis en live ! 🔴",
                "Oui oui, le stream est bien lancé !",
                "C'est le moment de rejoindre Twitch ! 👀",
                "Les Poups sont actuellement en direct avec moi ! 💜"
            ]
        );

    }

    else {

        startMascotHover(
            [
                "Le voyant est éteint pour le moment. 🌙",
                "Pas de stream actuellement !",
                "La chaîne est hors ligne, mais pas pour toujours.",
                "Reviens au prochain live ! 🐙"
            ]
        );

    }

}


/* =========================================================
   VISUAL MESSAGES
========================================================= */

function speakAboutVisual() {

    if (
        !twitch.value
    ) {

        return;

    }


    if (
        twitch.value.isLive
    ) {

        startMascotHover(
            [
                "Voici un aperçu du live en cours ! 📺",
                `Tu peux me voir actuellement sur ${twitch.value.gameName ?? "Twitch"} !`,
                "Oui, c'est bien le stream du moment ! 👀",
                "Clique sur Regarder le live pour venir directement sur Twitch. 💜"
            ]
        );

    }

    else {

        startMascotHover(
            [
                "Pas de preview aujourd'hui, je suis hors ligne. 🌙",
                "Tu vois ma petite tête à la place du live !",
                "La prochaine preview apparaîtra au prochain stream.",
                "Même hors ligne, je garde un œil sur le site. 👀"
            ]
        );

    }

}


/* =========================================================
   IDENTITY MESSAGES
========================================================= */

function speakAboutIdentity() {

    if (
        !twitch.value
    ) {

        return;

    }


    startMascotHover(
        [
            `C'est bien moi : ${twitch.value.displayName} ! 🐙`,
            `Tu peux me retrouver sur Twitch sous @${twitch.value.login}.`,
            "Oui oui, cette petite tête est bien la mienne !",
            "Bienvenue sur mon petit coin Twitch. 💜"
        ]
    );

}


/* =========================================================
   GAME MESSAGES
========================================================= */

function speakAboutGame() {

    if (
        !twitch.value
        ||
        !twitch.value.isLive
        ||
        !twitch.value.gameName
    ) {

        return;

    }


    startMascotHover(
        [
            `Je joue actuellement à ${twitch.value.gameName} ! 🎮`,
            `${twitch.value.gameName} occupe mes tentacules en ce moment ! 🐙`,
            `Tu connais ${twitch.value.gameName} ? 👀`,
            `${twitch.value.gameName} est l'aventure du jour !`,
            `Direction le live si tu veux me voir jouer à ${twitch.value.gameName} !`
        ]
    );

}


/* =========================================================
   VIEWERS MESSAGES
========================================================= */

function speakAboutViewers() {

    if (
        !twitch.value
        ||
        !twitch.value.isLive
    ) {

        return;

    }


    const count =
        twitch.value.viewers;


    const formatted =
        formatViewers(
            count
        );


    startMascotHover(
        [
            `${formatted} personne${count > 1 ? "s" : ""} regarde${count > 1 ? "nt" : ""} le live ! 👀`,
            `Nous sommes ${formatted} sur le stream actuellement ! 💜`,
            `Merci aux ${formatted} spectateur${count > 1 ? "s" : ""} présent${count > 1 ? "s" : ""} !`,
            "Plus on est nombreux, plus le chaos augmente. 😂",
            `${formatted} Pou${count > 1 ? "ps" : "p"} devant les aventures de Couaxia ! 🐙`
        ]
    );

}


/* =========================================================
   STREAM TITLE MESSAGES
========================================================= */

function speakAboutStreamTitle() {

    if (
        !twitch.value
        ||
        !twitch.value.isLive
        ||
        !twitch.value.title
    ) {

        return;

    }


    startMascotHover(
        [
            `Le titre actuel est : « ${twitch.value.title} »`,
            "Oui, c'est bien le titre du live actuel !",
            "Mes titres sont parfois... très inspirés. 😂",
            "Le titre donne peut-être quelques indices sur le chaos du jour. 👀"
        ]
    );

}


/* =========================================================
   LIVE BUTTON MESSAGES
========================================================= */

function speakAboutLiveButton() {

    if (
        !twitch.value
    ) {

        return;

    }


    startMascotHover(
        [
            "Tu veux rejoindre le live ? C'est par ici ! 🔴",
            "Direction Twitch ! 💜",
            `Viens me voir directement sur twitch.tv/${twitch.value.login} !`,
            "Le live t'attend ! 👀",
            "Clique et rejoins les Poups en direct !"
        ]
    );

}


/* =========================================================
   TWITCH PAGE BUTTON MESSAGES
========================================================= */

const twitchPageMessages = [

    "Tu veux découvrir toute ma page Twitch ? 💜",

    "Il y a encore plus d'informations sur ma chaîne juste ici !",

    "Clips, live, recommandations... direction la page Twitch !",

    "Tu veux explorer tout mon univers Twitch ? 🐙",

    "Cette page n'est qu'un petit aperçu ! 👀"

];


/* =========================================================
   LOAD TWITCH
========================================================= */

async function loadTwitch():
    Promise<void> {

    loading.value =
        true;


    errorMessage.value =
        null;


    try {

        const result =
            await apiFetch<TwitchLiveResponse>(
                "/api/twitch/live"
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
                "Impossible de récupérer les informations Twitch."
            );

        }


        /* =================================================
           SUCCESS
        ================================================= */

        twitch.value =
            result.data;

    }

    catch (
        error:
            unknown
    ) {

        console.error(
            "Erreur TwitchSection :",
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
   FORMAT VIEWERS
========================================================= */

function formatViewers(
    viewers:
        number
):
    string {

    return viewers.toLocaleString(
        "fr-FR"
    );

}


/* =========================================================
   MOUNT
========================================================= */

onMounted(
    loadTwitch
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
        class="home-twitch"
        aria-labelledby="home-twitch-title"

        @mouseenter="
            speakAboutTwitchSection
        "

        @mouseleave="
            stopMascotHover
        "
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header class="home-twitch__header">

            <span class="home-twitch__eyebrow">
                TWITCH
            </span>


            <h2
                id="home-twitch-title"
                class="home-twitch__title"
            >
                Retrouve-moi en live
            </h2>


            <p class="home-twitch__description">

                Du gaming, du chaos et surtout beaucoup
                de bonne humeur !

            </p>

        </header>


        <!-- =================================================
             LOADING
        ================================================== -->

        <AppLoader
            v-if="loading"
            text="Chargement de Twitch..."
            size="small"
        />


        <!-- =================================================
             ERROR
        ================================================== -->

        <div
            v-else-if="errorMessage"
            class="home-twitch__error"
            role="alert"
        >

            <strong>
                Impossible de charger Twitch.
            </strong>


            <p>
                {{ errorMessage }}
            </p>

        </div>


        <!-- =================================================
             TWITCH CARD
        ================================================== -->

        <article
            v-else-if="twitch"

            class="home-twitch__card"

            :class="{
                'home-twitch__card--live':
                    twitch.isLive
            }"

            tabindex="0"

            @mouseenter.stop="
                speakAboutTwitchSection
            "

            @mouseleave.stop="
                stopMascotHover
            "

            @focus.stop="
                speakAboutTwitchSection
            "

            @blur.stop="
                stopMascotHover
            "
        >

            <!-- =============================================
                 IMAGE / PREVIEW
            ============================================== -->

            <div
                class="home-twitch__visual"

                tabindex="0"

                @mouseenter.stop="
                    speakAboutVisual
                "

                @mouseleave.stop="
                    stopMascotHover
                "

                @focus.stop="
                    speakAboutVisual
                "

                @blur.stop="
                    stopMascotHover
                "
            >

                <!-- LIVE PREVIEW -->

                <img
                    v-if="
                        twitch.isLive &&
                        twitch.thumbnailUrl
                    "

                    :src="
                        twitch.thumbnailUrl
                    "

                    :alt="
                        `Live Twitch de ${twitch.displayName}`
                    "

                    class="
                        home-twitch__preview
                    "
                >


                <!-- OFFLINE -->

                <div
                    v-else
                    class="
                        home-twitch__offline
                    "
                >

                    <img
                        :src="
                            twitch.profileImageUrl
                        "

                        :alt="
                            `Photo de profil Twitch de ${twitch.displayName}`
                        "

                        class="
                            home-twitch__avatar
                        "
                    >

                </div>


                <!-- =========================================
                     STATUS
                ========================================== -->

                <span
                    class="
                        home-twitch__status
                    "

                    :class="{
                        'home-twitch__status--live':
                            twitch.isLive,

                        'home-twitch__status--offline':
                            !twitch.isLive
                    }"

                    tabindex="0"

                    @mouseenter.stop="
                        speakAboutStatus
                    "

                    @mouseleave.stop="
                        stopMascotHover
                    "

                    @focus.stop="
                        speakAboutStatus
                    "

                    @blur.stop="
                        stopMascotHover
                    "
                >

                    <span
                        class="
                            home-twitch__status-dot
                        "

                        aria-hidden="true"
                    ></span>


                    {{
                        twitch.isLive
                            ? "EN LIVE"
                            : "HORS LIGNE"
                    }}

                </span>

            </div>


            <!-- =============================================
                 CONTENT
            ============================================== -->

            <div class="home-twitch__content">

                <!-- =========================================
                     IDENTITY
                ========================================== -->

                <div
                    class="home-twitch__identity"

                    tabindex="0"

                    @mouseenter.stop="
                        speakAboutIdentity
                    "

                    @mouseleave.stop="
                        stopMascotHover
                    "

                    @focus.stop="
                        speakAboutIdentity
                    "

                    @blur.stop="
                        stopMascotHover
                    "
                >

                    <img
                        :src="
                            twitch.profileImageUrl
                        "

                        alt=""

                        class="
                            home-twitch__profile
                        "
                    >


                    <div>

                        <h3 class="home-twitch__name">
                            {{ twitch.displayName }}
                        </h3>


                        <span class="home-twitch__login">
                            @{{ twitch.login }}
                        </span>

                    </div>

                </div>


                <!-- =========================================
                     LIVE
                ========================================== -->

                <template v-if="twitch.isLive">

                    <h4
                        v-if="
                            twitch.title
                        "

                        class="
                            home-twitch__stream-title
                        "

                        tabindex="0"

                        @mouseenter.stop="
                            speakAboutStreamTitle
                        "

                        @mouseleave.stop="
                            stopMascotHover
                        "

                        @focus.stop="
                            speakAboutStreamTitle
                        "

                        @blur.stop="
                            stopMascotHover
                        "
                    >
                        {{ twitch.title }}
                    </h4>


                    <div class="home-twitch__meta">

                        <!-- GAME -->

                        <span
                            v-if="
                                twitch.gameName
                            "

                            class="
                                home-twitch__game
                            "

                            tabindex="0"

                            @mouseenter.stop="
                                speakAboutGame
                            "

                            @mouseleave.stop="
                                stopMascotHover
                            "

                            @focus.stop="
                                speakAboutGame
                            "

                            @blur.stop="
                                stopMascotHover
                            "
                        >

                            🎮

                            {{ twitch.gameName }}

                        </span>


                        <!-- VIEWERS -->

                        <span
                            class="
                                home-twitch__viewers
                            "

                            tabindex="0"

                            @mouseenter.stop="
                                speakAboutViewers
                            "

                            @mouseleave.stop="
                                stopMascotHover
                            "

                            @focus.stop="
                                speakAboutViewers
                            "

                            @blur.stop="
                                stopMascotHover
                            "
                        >

                            👁


                            {{
                                formatViewers(
                                    twitch.viewers
                                )
                            }}

                            spectateur{{

                                twitch.viewers > 1
                                    ? "s"
                                    : ""

                            }}

                        </span>

                    </div>

                </template>


                <!-- =========================================
                     OFFLINE
                ========================================== -->

                <p
                    v-else
                    class="
                        home-twitch__offline-text
                    "

                    tabindex="0"

                    @mouseenter.stop="
                        speakAboutTwitchSection
                    "

                    @mouseleave.stop="
                        stopMascotHover
                    "

                    @focus.stop="
                        speakAboutTwitchSection
                    "

                    @blur.stop="
                        stopMascotHover
                    "
                >

                    Je ne suis pas en live pour le moment,
                    mais tu peux retrouver mes dernières
                    aventures sur Twitch !

                </p>


                <!-- =========================================
                     BUTTONS
                ========================================== -->

                <div class="home-twitch__actions">

                    <!-- LIVE BUTTON -->

                    <a
                        v-if="
                            twitch.isLive
                        "

                        :href="
                            `https://www.twitch.tv/${twitch.login}`
                        "

                        target="_blank"

                        rel="
                            noopener noreferrer
                        "

                        class="
                            home-twitch__button
                            home-twitch__button--primary
                        "

                        @mouseenter.stop="
                            speakAboutLiveButton
                        "

                        @mouseleave.stop="
                            stopMascotHover
                        "

                        @focus.stop="
                            speakAboutLiveButton
                        "

                        @blur.stop="
                            stopMascotHover
                        "
                    >

                        Regarder le live


                        <span aria-hidden="true">
                            ↗
                        </span>

                    </a>


                    <!-- TWITCH PAGE -->

                    <RouterLink
                        to="/twitch"

                        class="
                            home-twitch__button
                            home-twitch__button--secondary
                        "

                        @mouseenter.stop="
                            startMascotHover(
                                twitchPageMessages
                            )
                        "

                        @mouseleave.stop="
                            stopMascotHover
                        "

                        @focus.stop="
                            startMascotHover(
                                twitchPageMessages
                            )
                        "

                        @blur.stop="
                            stopMascotHover
                        "
                    >

                        Découvrir ma chaîne


                        <span aria-hidden="true">
                            →
                        </span>

                    </RouterLink>

                </div>

            </div>

        </article>

    </section>

</template>