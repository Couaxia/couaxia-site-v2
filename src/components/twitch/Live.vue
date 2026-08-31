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
   STATE
========================================================= */

const liveData =
    ref<TwitchLiveData | null>(
        null
    );


const loading =
    ref(
        true
    );


const refreshing =
    ref(
        false
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
   COMPUTED
========================================================= */

const isLive =
    computed(
        () => {

            return (
                liveData.value?.isLive
                ??
                false
            );

        }
    );


const liveStatusText =
    computed(
        () => {

            if (
                loading.value
            ) {

                return "Vérification…";

            }


            return (
                isLive.value
                    ? "En direct"
                    : "Hors ligne"
            );

        }
    );


const gameName =
    computed(
        () => {

            return (
                liveData.value?.gameName
                ??
                "Hors ligne"
            );

        }
    );


const viewers =
    computed(
        () => {

            return (
                liveData.value?.viewers
                ??
                0
            );

        }
    );


const streamTitle =
    computed(
        () => {

            return (
                liveData.value?.title
                ??
                "Couaxia est actuellement hors ligne."
            );

        }
    );


const twitchPlayerUrl =
    computed(
        () => {

            const parent =
                window.location.hostname;


            return (
                "https://player.twitch.tv/"
                +
                "?channel=couaxia"
                +
                `&parent=${parent}`
                +
                "&muted=true"
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

function speakAboutLive() {

    if (
        loading.value
    ) {

        startMascotHover(
            [
                "Je vérifie Twitch... une seconde ! 👀",
                "Voyons voir si je suis actuellement en live...",
                "Mes tentacules interrogent Twitch ! 🐙"
            ]
        );


        return;

    }


    if (
        isLive.value
    ) {

        startMascotHover(
            [
                "Je suis actuellement en direct ! 🔴",
                `Je suis en train de jouer à ${gameName.value} ! 🎮`,
                "Pourquoi es-tu encore ici ? Viens sur le live ! 👀",
                "Le stream est lancé, rejoins les Poups ! 💜",
                `${viewers.value} personne${viewers.value > 1 ? "s" : ""} regarde${viewers.value > 1 ? "nt" : ""} actuellement le live !`
            ]
        );


        return;

    }


    startMascotHover(
        [
            "Pas de live pour le moment. 🌙",
            "Je suis actuellement hors ligne !",
            "Même une Kraduk doit dormir de temps en temps. 💤",
            "Pas de panique, il y aura d'autres aventures !",
            "En attendant, tu peux regarder les clips et les vidéos ! 💜"
        ]
    );

}


/* =========================================================
   STATUS MESSAGES
========================================================= */

function speakAboutStatus() {

    if (
        isLive.value
    ) {

        startMascotHover(
            [
                "Le petit point est allumé : je suis en live ! 🔴",
                "EN DIRECT ! C'est le moment de rejoindre Twitch !",
                "Oui oui, le stream est bien lancé ! 👀",
                "Les Poups sont actuellement en live avec moi ! 💜"
            ]
        );

    }

    else {

        startMascotHover(
            [
                "Le live est actuellement hors ligne. 🌙",
                "Pas de stream pour le moment !",
                "Le prochain live arrivera bientôt !",
                "Profite de ce moment pour explorer le reste du site. 🐙"
            ]
        );

    }

}


/* =========================================================
   GAME MESSAGES
========================================================= */

function speakAboutGame() {

    if (
        !isLive.value
    ) {

        startMascotHover(
            [
                "Pas de jeu en cours pour le moment ! 🎮",
                "Il faudra attendre le prochain live pour découvrir le prochain jeu.",
                "La prochaine aventure reste encore un mystère... 👀"
            ]
        );


        return;

    }


    startMascotHover(
        [
            `Aujourd'hui, je joue à ${gameName.value} ! 🎮`,
            `${gameName.value} occupe actuellement mes tentacules ! 🐙`,
            `Tu connais ${gameName.value} ?`,
            `Direction Twitch si tu veux me voir jouer à ${gameName.value} !`,
            `${gameName.value} est l'aventure du moment !`
        ]
    );

}


/* =========================================================
   VIEWERS MESSAGES
========================================================= */

function speakAboutViewers() {

    if (
        !isLive.value
    ) {

        startMascotHover(
            [
                "Personne sur le live puisqu'il est hors ligne. 🌙",
                "Le compteur attend tranquillement le prochain stream !",
                "Les Poups reviendront au prochain live ! 💜"
            ]
        );


        return;

    }


    const count =
        viewers.value;


    startMascotHover(
        [
            `${count} personne${count > 1 ? "s" : ""} regarde${count > 1 ? "nt" : ""} le live actuellement ! 👀`,

            `Nous sommes ${count} sur le live ! 💜`,

            `${count} Pou${count > 1 ? "ps" : "p"} devant mes aventures ! 🐙`,

            "Merci à toutes les personnes présentes sur le live !",

            "Plus on est nombreux, plus le chaos augmente ! 😂"
        ]
    );

}


/* =========================================================
   PLAYER MESSAGES
========================================================= */

function speakAboutPlayer() {

    if (
        isLive.value
    ) {

        startMascotHover(
            [
                "Tu peux regarder le live directement ici ! 📺",
                "Oui, le stream fonctionne directement sur mon site !",
                "Tu peux rester ici... ou venir discuter directement sur Twitch. 💜",
                `Tu peux me regarder jouer à ${gameName.value} juste ici !`,
                "Attention, le chaos peut commencer à tout moment. 👀"
            ]
        );

    }

    else {

        startMascotHover(
            [
                "Le player attend le prochain live. 🌙",
                "Rien à voir en direct pour le moment !",
                "Reviens au prochain stream et cette zone prendra vie ! ✨",
                "Le calme avant la prochaine tempête... 🐙"
            ]
        );

    }

}


/* =========================================================
   STREAM TITLE MESSAGES
========================================================= */

function speakAboutTitle() {

    if (
        !isLive.value
    ) {

        return;

    }


    startMascotHover(
        [
            `Le live s'appelle : « ${streamTitle.value} »`,
            "Oui, c'est bien le titre actuel du stream !",
            "Mes titres de live sont parfois... très inspirés. 😂",
            "Le titre peut donner quelques indices sur le chaos du jour !"
        ]
    );

}


/* =========================================================
   TWITCH BUTTON MESSAGES
========================================================= */

const twitchButtonMessages = [

    "Direction Twitch ! 💜",

    "Tu veux ouvrir directement ma chaîne ?",

    "Viens rejoindre les Poups sur Twitch ! 🐙",

    "Un petit clic et tu arrives directement sur ma chaîne !",

    "On se retrouve de l'autre côté ! 👀"

];


/* =========================================================
   REFRESH MESSAGES
========================================================= */

const refreshMessages = [

    "Tu veux vérifier si quelque chose a changé ? 👀",

    "Actualisation des informations Twitch !",

    "Voyons si Twitch a quelque chose de nouveau à raconter.",

    "Mes tentacules vont interroger Twitch une nouvelle fois ! 🐙",

    "Actualisons tout ça ! ↻"

];


/* =========================================================
   LOAD LIVE DATA
========================================================= */

async function loadTwitchLive() {

    errorMessage.value =
        null;


    try {

        const result =
            await apiFetch<TwitchLiveResponse>(
                "/api/twitch/live"
            );


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


        liveData.value =
            result.data;

    }

    catch (
        error:
            unknown
    ) {

        console.error(
            "Erreur Twitch :",
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
   REFRESH
========================================================= */

async function refreshLive() {

    if (
        refreshing.value
    ) {

        return;

    }


    refreshing.value =
        true;


    /*
     * Message immédiat au clic.
     */

    sendMascotMessage(
        getRandomMessage(
            refreshMessages
        )
    );


    try {

        await loadTwitchLive();

    }

    finally {

        refreshing.value =
            false;

    }

}


/* =========================================================
   MOUNT
========================================================= */

onMounted(
    loadTwitchLive
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
        id="live"
        class="twitch-live"

        @mouseenter="
            speakAboutLive
        "

        @mouseleave="
            stopMascotHover
        "
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header class="twitch-live__header">

            <div class="twitch-live__heading">

                <div class="twitch-live__label-row">

                    <span class="twitch-live__eyebrow">
                        STREAM
                    </span>


                    <span
                        class="twitch-live__status"

                        :class="{
                            'twitch-live__status--online':
                                isLive,

                            'twitch-live__status--offline':
                                !isLive
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
                            class="twitch-live__status-dot"
                            aria-hidden="true"
                        ></span>


                        {{ liveStatusText }}

                    </span>

                </div>


                <h2 class="twitch-live__title">
                    En direct sur Twitch
                </h2>

            </div>


            <!-- =============================================
                 ACTIONS
            ============================================== -->

            <div class="twitch-live__actions">

                <a
                    href="https://www.twitch.tv/couaxia"

                    target="_blank"

                    rel="noopener noreferrer"

                    class="twitch-live__twitch-link"

                    @mouseenter.stop="
                        startMascotHover(
                            twitchButtonMessages
                        )
                    "

                    @mouseleave.stop="
                        stopMascotHover
                    "

                    @focus.stop="
                        startMascotHover(
                            twitchButtonMessages
                        )
                    "

                    @blur.stop="
                        stopMascotHover
                    "
                >

                    Twitch

                    <span aria-hidden="true">
                        ↗
                    </span>

                </a>


                <button
                    type="button"

                    class="twitch-live__refresh"

                    :disabled="refreshing"

                    @mouseenter.stop="
                        startMascotHover(
                            refreshMessages
                        )
                    "

                    @mouseleave.stop="
                        stopMascotHover
                    "

                    @focus.stop="
                        startMascotHover(
                            refreshMessages
                        )
                    "

                    @blur.stop="
                        stopMascotHover
                    "

                    @click.stop="
                        refreshLive
                    "
                >

                    <span
                        class="twitch-live__refresh-icon"

                        :class="{
                            'twitch-live__refresh-icon--loading':
                                refreshing
                        }"

                        aria-hidden="true"
                    >
                        ↻
                    </span>


                    <span>

                        {{
                            refreshing
                                ? "Actualisation..."
                                : "Actualiser"
                        }}

                    </span>

                </button>

            </div>

        </header>


        <!-- =================================================
             ERREUR
        ================================================== -->

        <div
            v-if="errorMessage"
            class="twitch-live__error"
            role="alert"
        >

            <strong>
                Impossible de récupérer Twitch.
            </strong>


            <p>
                {{ errorMessage }}
            </p>

        </div>


        <!-- =================================================
             LOADING
        ================================================== -->

        <div
            v-else-if="loading"
            class="twitch-live__loading"
        >

            <span
                class="twitch-live__loading-spinner"
                aria-hidden="true"
            >
                ↻
            </span>


            <span>
                Vérification du statut Twitch...
            </span>

        </div>


        <template v-else>

            <!-- =============================================
                 PLAYER
            ============================================== -->

            <div
                class="twitch-live__player"

                tabindex="0"

                @mouseenter.stop="
                    speakAboutPlayer
                "

                @mouseleave.stop="
                    stopMascotHover
                "

                @focus.stop="
                    speakAboutPlayer
                "

                @blur.stop="
                    stopMascotHover
                "
            >

                <span
                    class="twitch-live__player-status"

                    :class="{
                        'twitch-live__player-status--online':
                            isLive
                    }"
                >

                    {{
                        isLive
                            ? "EN DIRECT"
                            : "HORS LIGNE"
                    }}

                </span>


                <iframe
                    class="twitch-live__iframe"
                    :src="twitchPlayerUrl"
                    title="Live Twitch de Couaxia"
                    allow="autoplay; fullscreen"
                    allowfullscreen
                ></iframe>

            </div>


            <!-- =============================================
                 INFORMATIONS
            ============================================== -->

            <div class="twitch-live__infos">

                <!-- =========================================
                     GAME
                ========================================== -->

                <div
                    class="twitch-live__info"

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

                    <span class="twitch-live__info-label">
                        Catégorie
                    </span>


                    <strong>
                        {{ gameName }}
                    </strong>

                </div>


                <!-- =========================================
                     VIEWERS
                ========================================== -->

                <div
                    class="twitch-live__info"

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

                    <span class="twitch-live__info-label">
                        Viewers
                    </span>


                    <strong>
                        {{ viewers }}
                    </strong>

                </div>

            </div>


            <!-- =============================================
                 TITRE DU STREAM
            ============================================== -->

            <div
                v-if="isLive"

                class="twitch-live__stream-details"

                tabindex="0"

                @mouseenter.stop="
                    speakAboutTitle
                "

                @mouseleave.stop="
                    stopMascotHover
                "

                @focus.stop="
                    speakAboutTitle
                "

                @blur.stop="
                    stopMascotHover
                "
            >

                <span class="twitch-live__stream-label">
                    Titre du live
                </span>


                <strong>
                    {{ streamTitle }}
                </strong>

            </div>


            <!-- =============================================
                 HORS LIGNE
            ============================================== -->

            <div
                v-else

                class="twitch-live__offline-message"

                tabindex="0"

                @mouseenter.stop="
                    speakAboutLive
                "

                @mouseleave.stop="
                    stopMascotHover
                "

                @focus.stop="
                    speakAboutLive
                "

                @blur.stop="
                    stopMascotHover
                "
            >

                <span
                    class="twitch-live__offline-icon"
                    aria-hidden="true"
                >
                    🌙
                </span>


                <div>

                    <strong>
                        Couaxia est actuellement hors ligne.
                    </strong>


                    <p>
                        Tu peux retrouver les derniers clips
                        et les dernières vidéos juste en dessous.
                    </p>

                </div>

            </div>

        </template>

    </section>

</template>