<script setup lang="ts">
/* =========================================================
   TYPES
========================================================= */

type StreamerStatus =
    | "online"
    | "offline";


interface Streamer {
    id: number;

    name: string;

    avatar: string;

    url: string;

    status: StreamerStatus;
}


interface RecommendationGroup {
    id: string;

    title: string;

    description: string;

    icon: string;

    streamers: Streamer[];
}


/* =========================================================
   DONNÉES TEMPORAIRES
   On remplacera ensuite par API / Supabase
========================================================= */

const recommendationGroups:
    RecommendationGroup[] =
    [

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

            streamers: [

                {
                    id:
                        1,

                    name:
                        "lea reine poulpe",

                    avatar:
                        "/images/twitch/streamers/lea-reine-poulpe.png",

                    url:
                        "https://www.twitch.tv/",

                    status:
                        "online"
                },

                {
                    id:
                        2,

                    name:
                        "YuTo_Mbc",

                    avatar:
                        "/images/twitch/streamers/yuto-mbc.png",

                    url:
                        "https://www.twitch.tv/",

                    status:
                        "online"
                },

                {
                    id:
                        3,

                    name:
                        "000dracko000",

                    avatar:
                        "/images/twitch/streamers/000dracko000.png",

                    url:
                        "https://www.twitch.tv/",

                    status:
                        "offline"
                },

                {
                    id:
                        4,

                    name:
                        "babyhawk_vt",

                    avatar:
                        "/images/twitch/streamers/babyhawk-vt.png",

                    url:
                        "https://www.twitch.tv/",

                    status:
                        "offline"
                }

            ]
        },


        /* =====================================================
           INTERNATIONAL
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

            streamers: [

                {
                    id:
                        101,

                    name:
                        "AuroraLeonisVT",

                    avatar:
                        "/images/twitch/streamers/auroraleonisvt.png",

                    url:
                        "https://www.twitch.tv/",

                    status:
                        "offline"
                },

                {
                    id:
                        102,

                    name:
                        "ironmouse",

                    avatar:
                        "/images/twitch/streamers/ironmouse.png",

                    url:
                        "https://www.twitch.tv/ironmouse",

                    status:
                        "offline"
                },

                {
                    id:
                        103,

                    name:
                        "LaynaLazar",

                    avatar:
                        "/images/twitch/streamers/laynalazar.png",

                    url:
                        "https://www.twitch.tv/",

                    status:
                        "offline"
                },

                {
                    id:
                        104,

                    name:
                        "Sinder",

                    avatar:
                        "/images/twitch/streamers/sinder.png",

                    url:
                        "https://www.twitch.tv/",

                    status:
                        "offline"
                }

            ]
        },


        /* =====================================================
           FAVORIS
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

            streamers: [

                {
                    id:
                        201,

                    name:
                        "Biyona",

                    avatar:
                        "/images/twitch/streamers/biyona.png",

                    url:
                        "https://www.twitch.tv/",

                    status:
                        "offline"
                },

                {
                    id:
                        202,

                    name:
                        "Fengaryx",

                    avatar:
                        "/images/twitch/streamers/fengaryx.png",

                    url:
                        "https://www.twitch.tv/",

                    status:
                        "offline"
                },

                {
                    id:
                        203,

                    name:
                        "kammy64",

                    avatar:
                        "/images/twitch/streamers/kammy64.png",

                    url:
                        "https://www.twitch.tv/",

                    status:
                        "offline"
                },

                {
                    id:
                        204,

                    name:
                        "WankilStudio",

                    avatar:
                        "/images/twitch/streamers/wankilstudio.png",

                    url:
                        "https://www.twitch.tv/wankilstudio",

                    status:
                        "offline"
                }

            ]
        }

    ];


/* =========================================================
   COMPTEURS
========================================================= */

function getOnlineCount(
    group: RecommendationGroup
) {

    return group.streamers.filter(
        streamer =>
            streamer.status ===
            "online"
    ).length;
}
</script>


<template>

    <section class="twitch-recommendations">

        <!-- =================================================
             EN-TÊTE GÉNÉRAL
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
             GROUPES
        ================================================== -->

        <div class="twitch-recommendations__groups">

            <section
                v-for="group in recommendationGroups"
                :key="group.id"
                class="twitch-recommendation-group"
                :class="
                    `twitch-recommendation-group--${group.id}`
                "
            >

                <!-- =========================================
                     HEADER DU GROUPE
                ========================================== -->

                <header class="twitch-recommendation-group__header">

                    <div class="twitch-recommendation-group__heading">

                        <span
                            class="twitch-recommendation-group__icon"
                            aria-hidden="true"
                        >
                            {{ group.icon }}
                        </span>


                        <div>

                            <h3 class="twitch-recommendation-group__title">
                                {{ group.title }}
                            </h3>


                            <p class="twitch-recommendation-group__description">
                                {{ group.description }}
                            </p>

                        </div>

                    </div>


                    <!-- =====================================
                         COMPTEUR
                    ====================================== -->

                    <span class="twitch-recommendation-group__count">

                        {{ group.streamers.length }}
                        chaîne{{
                            group.streamers.length > 1
                                ? "s"
                                : ""
                        }}

                        <template
                            v-if="getOnlineCount(group) > 0"
                        >
                            •
                            {{ getOnlineCount(group) }}
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
                        :key="streamer.id"
                        class="twitch-streamer"
                    >

                        <!-- =================================
                             AVATAR
                        ================================== -->

                        <a
                            :href="streamer.url"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="twitch-streamer__avatar-link"
                            :aria-label="
                                `Voir la chaîne Twitch de ${streamer.name}`
                            "
                        >

                            <div class="twitch-streamer__avatar-wrapper">

                                <img
                                    :src="streamer.avatar"
                                    :alt="
                                        `Avatar Twitch de ${streamer.name}`
                                    "
                                    class="twitch-streamer__avatar"
                                    loading="lazy"
                                >


                                <!-- =========================
                                     LIEN EXTERNE
                                ========================== -->

                                <span
                                    class="twitch-streamer__external"
                                    aria-hidden="true"
                                >
                                    ↗
                                </span>


                                <!-- =========================
                                     STATUT
                                ========================== -->

                                <span
                                    class="twitch-streamer__status"
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
                                ></span>

                            </div>

                        </a>


                        <!-- =================================
                             NOM
                        ================================== -->

                        <a
                            :href="streamer.url"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="twitch-streamer__name"
                        >
                            {{ streamer.name }}
                        </a>

                    </article>

                </div>

            </section>

        </div>

    </section>

</template>