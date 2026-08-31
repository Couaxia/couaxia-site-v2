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
} from "../../services/api";


/* =========================================================
   TYPES
========================================================= */

type StreamerStatus =
    | "online"
    | "offline";


interface Streamer {

    login:
        string;

    displayName:
        string;

    avatar:
        string;

    url:
        string;

    status:
        StreamerStatus;

    gameName:
        string | null;

    viewers:
        number;

}


interface RecommendationGroup {

    id:
        string;

    title:
        string;

    description:
        string;

    icon:
        string;

    logins:
        string[];

    streamers:
        Streamer[];

}


interface TwitchRecommendationsResponse {

    success:
        boolean;

    data?:
        Streamer[];

    message?:
        string;

    error?:
        string;

}


/* =========================================================
   GROUPES
========================================================= */

const recommendationGroups =
    ref<RecommendationGroup[]>([

        /* =====================================================
           MES AMIS
        ====================================================== */

        {
            id:
                "friends",

            title:
                "Mes amis",

            description:
                "Les personnes avec qui je joue, collabore et partage mes aventures.",

            icon:
                "💜",

            logins: [

                "leareinepoulpe",
                "yuto_mbc",
                "000dracko000",
                "babyhawk_vt",
                "celanyavt",
                "dreagonm",
                "frouxyi",
                "kimori_004",
                "louxifr",
                "lunyvee",
                "maiyasu",
                "maman_mikii",
                "myo_faunette",
                "nymya_vt",
                "omelyth",
                "petiteorca",
                "piikanva",
                "rybyabyss",
                "selini_s",
                "sorine_e",
                "subbarath",
                "vaxiria",
                "yuutooushiro",
                "Jxst_Kely",
                "missouille57",
                "ithalaine_VT",
                "Captain_Gros_Cheh6",
                "Zwar_vtuber"

            ],

            streamers:
                []
        },


        /* =====================================================
           À DÉCOUVRIR DANS LE MONDE
        ====================================================== */

        {
            id:
                "world",

            title:
                "À découvrir dans le monde",

            description:
                "Des créateurs internationaux que j'aime suivre et vous faire découvrir.",

            icon:
                "🌍",

            logins: [

                "auroraleonisvt",
                "ironmouse",
                "laynalazar",
                "natomiie",
                "queenie",
                "sinder",
                "yesseniaVO",
                "SussySonia"

            ],

            streamers:
                []
        },


        /* =====================================================
           MES FAVORIS
        ====================================================== */

        {
            id:
                "favorites",

            title:
                "Mes favoris",

            description:
                "Les streamers que j'aime regarder et qui m'inspirent.",

            icon:
                "⭐",

            logins: [

                "biyona",
                "fengaryx",
                "kammy64",
                "keola",
                "lykamonarch",
                "meilbeillue",
                "mrbutler_17",
                "nallena_vwolf",
                "pakvotille",
                "sayarhe",
                "sunray",
                "vtyukiuWu",
                "wankilstudio",
                "RiFoxVT",
                "Kaalish_VT",
                "Nebulys_VT",
                "shoucah",
                "LuluFaeVT",
                "avril_fantome",
                "CherryLily_and_Loukamii",
                "Yuka_Portesonges",
                "Nysselya_vt",
                "Meizy_11",
                "mokaa_cafe",
                "SaturneSmile"

            ],

            streamers:
                []
        }

    ]);


/* =========================================================
   STATE
========================================================= */

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

const recommendationMessages = [

    "Tu veux découvrir quelques streamers que j'apprécie ? 💜",

    "Bienvenue dans ma petite sélection Twitch !",

    "Il y a plein de créateurs incroyables à découvrir ici !",

    "Mes tentacules ont préparé quelques recommandations pour toi. 🐙",

    "Attention... tu risques de repartir avec encore plus de chaînes à suivre ! 👀",

    "Voici quelques personnes qui méritent un petit détour sur Twitch !"

];


/* =========================================================
   GROUP MESSAGES
========================================================= */

function speakAboutGroup(
    group:
        RecommendationGroup
) {

    const onlineCount =
        getOnlineCount(
            group
        );


    const messages:
        Record<
            string,
            string[]
        > = {

            friends: [

                "Voici mes amis et compagnons de chaos ! 💜",

                "Avec eux, même une partie tranquille peut devenir n'importe quoi.",

                "Ce sont les personnes avec qui je partage beaucoup d'aventures !",

                `${group.streamers.length} chaîne${group.streamers.length > 1 ? "s" : ""} dans ce groupe !`,

                onlineCount > 0
                    ? `${onlineCount} de mes amis ${onlineCount > 1 ? "sont" : "est"} actuellement en direct ! 👀`
                    : "Personne n'est en direct ici pour le moment."

            ],


            world: [

                "Direction le reste du monde ! 🌍",

                "J'aime découvrir des créateurs venus de plein d'endroits différents.",

                "Il y a tellement de VTubers et streamers à découvrir !",

                `${group.streamers.length} chaîne${group.streamers.length > 1 ? "s" : ""} à explorer ici !`,

                onlineCount > 0
                    ? `${onlineCount} chaîne${onlineCount > 1 ? "s sont" : " est"} actuellement en direct !`
                    : "Tout le monde est hors ligne pour le moment."

            ],


            favorites: [

                "Voici quelques-unes de mes chaînes favorites ! ⭐",

                "Ce sont des créateurs que j'aime particulièrement regarder.",

                "Attention, cette section peut sérieusement agrandir ta liste de follows ! 👀",

                `${group.streamers.length} streamer${group.streamers.length > 1 ? "s" : ""} parmi mes favoris !`,

                onlineCount > 0
                    ? `${onlineCount} de mes favoris ${onlineCount > 1 ? "sont" : "est"} en live !`
                    : "Pas de live dans mes favoris pour le moment."

            ]

        };


    startMascotHover(
        messages[
            group.id
        ]
        ??
        [
            "Encore quelques chaînes à découvrir !"
        ]
    );

}


/* =========================================================
   STREAMER MESSAGES
========================================================= */

function speakAboutStreamer(
    streamer:
        Streamer
) {

    if (
        streamer.status ===
        "online"
    ) {

        const game =
            streamer.gameName
            ??
            "un jeu mystérieux";


        const viewerText =
            streamer.viewers > 0
                ? ` avec ${streamer.viewers} viewer${streamer.viewers > 1 ? "s" : ""}`
                : "";


        startMascotHover(
            [

                `${streamer.displayName} est actuellement en direct ! 🔴`,

                `${streamer.displayName} joue à ${game} ! 🎮`,

                `Tu peux aller faire un petit coucou à ${streamer.displayName} ! 💜`,

                `${streamer.displayName} est en live${viewerText} !`,

                `Oh ! ${streamer.displayName} est en ligne, va jeter un œil ! 👀`,

                `${game} chez ${streamer.displayName} ? Ça peut être sympa !`

            ]
        );


        return;

    }


    startMascotHover(
        [

            `${streamer.displayName} est hors ligne pour le moment. 🌙`,

            `${streamer.displayName} reviendra sûrement bientôt en live !`,

            `Pas de stream chez ${streamer.displayName} actuellement.`,

            `Tu peux quand même aller découvrir la chaîne de ${streamer.displayName} ! 💜`,

            `Même les streamers doivent dormir parfois ! ${streamer.displayName} est hors ligne.`

        ]
    );

}


/* =========================================================
   STREAMER STATUS
========================================================= */

function speakAboutStatus(
    streamer:
        Streamer
) {

    if (
        streamer.status ===
        "online"
    ) {

        startMascotHover(
            [

                `${streamer.displayName} est bien en direct ! 🔴`,

                `Le petit point est allumé : ${streamer.displayName} est en live !`,

                `C'est le bon moment pour rejoindre ${streamer.displayName} !`,

                streamer.gameName
                    ? `${streamer.displayName} joue actuellement à ${streamer.gameName}.`
                    : `${streamer.displayName} est actuellement en live !`

            ]
        );

    }

    else {

        startMascotHover(
            [

                `${streamer.displayName} est hors ligne. 🌙`,

                `Pas de live chez ${streamer.displayName} pour le moment.`,

                `Il faudra revenir plus tard pour voir ${streamer.displayName} en direct !`

            ]
        );

    }

}


/* =========================================================
   STREAMER GAME
========================================================= */

function speakAboutGame(
    streamer:
        Streamer
) {

    if (
        streamer.status !==
        "online"
        ||
        !streamer.gameName
    ) {

        return;

    }


    startMascotHover(
        [

            `${streamer.displayName} joue à ${streamer.gameName} ! 🎮`,

            `Tu connais ${streamer.gameName} ?`,

            `${streamer.gameName} est le jeu du moment chez ${streamer.displayName} !`,

            `Si tu veux voir du ${streamer.gameName}, c'est par ici !`

        ]
    );

}


/* =========================================================
   ONLINE COUNT
========================================================= */

function getOnlineCount(
    group:
        RecommendationGroup
) {

    return group.streamers.filter(
        streamer =>
            streamer.status ===
            "online"
    ).length;

}


/* =========================================================
   LOAD GROUP
========================================================= */

async function loadGroup(
    group:
        RecommendationGroup
):
    Promise<void> {

    const params =
        new URLSearchParams();


    group.logins.forEach(
        login => {

            params.append(
                "login",
                login
            );

        }
    );


    /* =====================================================
       API
    ====================================================== */

    const result =
        await apiFetch<TwitchRecommendationsResponse>(
            `/api/twitch/recommendations?${params.toString()}`
        );


    /* =====================================================
       ERROR
    ====================================================== */

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
            "Impossible de récupérer les streamers recommandés."
        );

    }


    /* =====================================================
       SUCCESS
    ====================================================== */

    group.streamers =
        result.data;

}


/* =========================================================
   LOAD ALL
========================================================= */

async function loadRecommendations():
    Promise<void> {

    loading.value =
        true;


    errorMessage.value =
        null;


    try {

        await Promise.all(
            recommendationGroups.value.map(
                group =>
                    loadGroup(
                        group
                    )
            )
        );

    }

    catch (
        error:
            unknown
    ) {

        console.error(
            "Erreur recommandations Twitch :",
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
   MOUNT
========================================================= */

onMounted(
    loadRecommendations
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
        class="twitch-recommendations"

        @mouseenter="
            startMascotHover(
                recommendationMessages
            )
        "

        @mouseleave="
            stopMascotHover
        "
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header class="twitch-recommendations__header">

            <span class="twitch-recommendations__eyebrow">
                💜 LA SÉLECTION DE COUAXIA
            </span>


            <h2 class="twitch-recommendations__title">
                Couaxia vous recommande ces streamers
            </h2>


            <p class="twitch-recommendations__description">

                Découvrez des créateurs et créatrices
                que j'apprécie et avec qui je partage parfois
                mes aventures !

            </p>

        </header>


        <!-- =================================================
             LOADING
        ================================================== -->

        <AppLoader
            v-if="loading"
            text="Chargement des suggestions..."
        />


        <!-- =================================================
             ERROR
        ================================================== -->

        <div
            v-else-if="errorMessage"
            class="twitch-recommendations__error"
        >

            <strong>
                Impossible de charger les recommandations.
            </strong>


            <p>
                {{ errorMessage }}
            </p>

        </div>


        <!-- =================================================
             GROUPES
        ================================================== -->

        <div
            v-else
            class="twitch-recommendations__groups"
        >

            <section
                v-for="group in recommendationGroups"

                :key="
                    group.id
                "

                class="
                    twitch-recommendation-group
                "

                :class="
                    `twitch-recommendation-group--${group.id}`
                "

                tabindex="0"

                @mouseenter.stop="
                    speakAboutGroup(
                        group
                    )
                "

                @mouseleave.stop="
                    stopMascotHover
                "

                @focus.stop="
                    speakAboutGroup(
                        group
                    )
                "

                @blur.stop="
                    stopMascotHover
                "
            >

                <!-- =========================================
                     HEADER GROUPE
                ========================================== -->

                <header
                    class="
                        twitch-recommendation-group__header
                    "
                >

                    <div
                        class="
                            twitch-recommendation-group__heading
                        "
                    >

                        <span
                            class="
                                twitch-recommendation-group__icon
                            "

                            aria-hidden="true"
                        >
                            {{ group.icon }}
                        </span>


                        <div>

                            <h3
                                class="
                                    twitch-recommendation-group__title
                                "
                            >
                                {{ group.title }}
                            </h3>


                            <p
                                class="
                                    twitch-recommendation-group__description
                                "
                            >
                                {{ group.description }}
                            </p>

                        </div>

                    </div>


                    <span
                        class="
                            twitch-recommendation-group__count
                        "
                    >

                        {{ group.streamers.length }}

                        chaîne{{
                            group.streamers.length > 1
                                ? "s"
                                : ""
                        }}


                        <template
                            v-if="
                                getOnlineCount(
                                    group
                                ) > 0
                            "
                        >

                            •

                            {{
                                getOnlineCount(
                                    group
                                )
                            }}

                            en direct

                        </template>

                    </span>

                </header>


                <!-- =========================================
                     STREAMERS
                ========================================== -->

                <div class="twitch-streamers-grid">

                    <article
                        v-for="streamer in group.streamers"

                        :key="
                            streamer.login
                        "

                        class="
                            twitch-streamer
                        "

                        tabindex="0"

                        @mouseenter.stop="
                            speakAboutStreamer(
                                streamer
                            )
                        "

                        @mouseleave.stop="
                            stopMascotHover
                        "

                        @focus.stop="
                            speakAboutStreamer(
                                streamer
                            )
                        "

                        @blur.stop="
                            stopMascotHover
                        "
                    >

                        <!-- =================================
                             AVATAR
                        ================================== -->

                        <a
                            :href="
                                streamer.url
                            "

                            target="_blank"

                            rel="
                                noopener noreferrer
                            "

                            class="
                                twitch-streamer__avatar-link
                            "

                            :aria-label="
                                `Voir la chaîne Twitch de ${streamer.displayName}`
                            "

                            @mouseenter.stop="
                                speakAboutStreamer(
                                    streamer
                                )
                            "

                            @mouseleave.stop="
                                stopMascotHover
                            "

                            @focus.stop="
                                speakAboutStreamer(
                                    streamer
                                )
                            "

                            @blur.stop="
                                stopMascotHover
                            "
                        >

                            <div
                                class="
                                    twitch-streamer__avatar-wrapper
                                "
                            >

                                <img
                                    :src="
                                        streamer.avatar
                                    "

                                    :alt="
                                        `Avatar Twitch de ${streamer.displayName}`
                                    "

                                    class="
                                        twitch-streamer__avatar
                                    "

                                    loading="lazy"
                                >


                                <span
                                    class="
                                        twitch-streamer__external
                                    "

                                    aria-hidden="true"
                                >
                                    ↗
                                </span>


                                <!-- =========================
                                     STATUS
                                ========================== -->

                                <span
                                    class="
                                        twitch-streamer__status
                                    "

                                    :class="{
                                        'twitch-streamer__status--online':
                                            streamer.status ===
                                            'online',

                                        'twitch-streamer__status--offline':
                                            streamer.status ===
                                            'offline'
                                    }"

                                    :title="
                                        streamer.status ===
                                            'online'
                                            ? 'En direct'
                                            : 'Hors ligne'
                                    "

                                    @mouseenter.stop="
                                        speakAboutStatus(
                                            streamer
                                        )
                                    "

                                    @mouseleave.stop="
                                        stopMascotHover
                                    "
                                ></span>

                            </div>

                        </a>


                        <!-- =================================
                             NAME
                        ================================== -->

                        <a
                            :href="
                                streamer.url
                            "

                            target="_blank"

                            rel="
                                noopener noreferrer
                            "

                            class="
                                twitch-streamer__name
                            "

                            @mouseenter.stop="
                                speakAboutStreamer(
                                    streamer
                                )
                            "

                            @mouseleave.stop="
                                stopMascotHover
                            "

                            @focus.stop="
                                speakAboutStreamer(
                                    streamer
                                )
                            "

                            @blur.stop="
                                stopMascotHover
                            "
                        >
                            {{ streamer.displayName }}
                        </a>


                        <!-- =================================
                             LIVE INFO
                        ================================== -->

                        <span
                            v-if="
                                streamer.status ===
                                'online'
                            "

                            class="
                                twitch-streamer__live-info
                            "

                            tabindex="0"

                            @mouseenter.stop="
                                speakAboutGame(
                                    streamer
                                )
                            "

                            @mouseleave.stop="
                                stopMascotHover
                            "

                            @focus.stop="
                                speakAboutGame(
                                    streamer
                                )
                            "

                            @blur.stop="
                                stopMascotHover
                            "
                        >

                            {{ streamer.gameName }}


                            <template
                                v-if="
                                    streamer.viewers > 0
                                "
                            >

                                •

                                {{ streamer.viewers }}

                                viewers

                            </template>

                        </span>

                    </article>

                </div>

            </section>

        </div>

    </section>

</template>