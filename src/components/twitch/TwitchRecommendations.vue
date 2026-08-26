<script setup lang="ts">
import {
    onMounted,
    ref
} from "vue";
import AppLoader from "../ui/AppLoader.vue";

/* =========================================================
   TYPES
========================================================= */

type StreamerStatus =
    | "online"
    | "offline";


interface Streamer {
    login: string;

    displayName: string;

    avatar: string;

    url: string;

    status: StreamerStatus;

    gameName: string | null;

    viewers: number;
}


interface RecommendationGroup {
    id: string;

    title: string;

    description: string;

    icon: string;

    logins: string[];

    streamers: Streamer[];
}


interface TwitchRecommendationsResponse {
    success: boolean;

    data?: Streamer[];

    message?: string;

    error?: string;
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
    ref(true);


const errorMessage =
    ref<string | null>(
        null
    );


/* =========================================================
   ONLINE COUNT
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


/* =========================================================
   LOAD GROUP
========================================================= */

async function loadGroup(
    group: RecommendationGroup
): Promise<void> {

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


    const response =
        await fetch(
            `/api/twitch/recommendations?${params.toString()}`
        );


    const result: TwitchRecommendationsResponse =
        await response.json();


    if (
        !response.ok ||
        !result.success ||
        !result.data
    ) {

        throw new Error(
            result.error ??
            result.message ??
            "Impossible de récupérer les streamers recommandés."
        );

    }


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

    catch (error: unknown) {

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
</script>


<template>

    <section class="twitch-recommendations">

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
                :key="group.id"
                class="twitch-recommendation-group"
                :class="
                    `twitch-recommendation-group--${group.id}`
                "
            >

                <!-- =========================================
                     HEADER GROUPE
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
                        :key="streamer.login"
                        class="twitch-streamer"
                    >

                        <a
                            :href="streamer.url"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="twitch-streamer__avatar-link"
                            :aria-label="
                                `Voir la chaîne Twitch de ${streamer.displayName}`
                            "
                        >

                            <div class="twitch-streamer__avatar-wrapper">

                                <img
                                    :src="streamer.avatar"
                                    :alt="
                                        `Avatar Twitch de ${streamer.displayName}`
                                    "
                                    class="twitch-streamer__avatar"
                                    loading="lazy"
                                >


                                <span
                                    class="twitch-streamer__external"
                                    aria-hidden="true"
                                >
                                    ↗
                                </span>


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


                        <a
                            :href="streamer.url"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="twitch-streamer__name"
                        >
                            {{ streamer.displayName }}
                        </a>


                        <span
                            v-if="streamer.status === 'online'"
                            class="twitch-streamer__live-info"
                        >

                            {{ streamer.gameName }}

                            <template
                                v-if="streamer.viewers > 0"
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