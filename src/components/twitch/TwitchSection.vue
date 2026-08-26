<script setup lang="ts">
import {
    onMounted,
    ref
} from "vue";

import AppLoader from "../ui/AppLoader.vue";


/* =========================================================
   TYPES
========================================================= */

interface TwitchLiveData {
    isLive: boolean;

    userId: string;

    login: string;

    displayName: string;

    profileImageUrl: string;

    offlineImageUrl: string;

    title: string | null;

    gameId: string | null;

    gameName: string | null;

    viewers: number;

    startedAt: string | null;

    language: string | null;

    thumbnailUrl: string | null;

    isMature: boolean;
}


interface TwitchLiveResponse {
    success: boolean;

    data?: TwitchLiveData;

    message?: string;

    error?: string;
}


/* =========================================================
   STATE
========================================================= */

const twitch =
    ref<TwitchLiveData | null>(
        null
    );


const loading =
    ref(true);


const errorMessage =
    ref<string | null>(
        null
    );


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

        const response =
            await fetch(
                "/api/twitch/live"
            );


        const result =
            await response.json() as TwitchLiveResponse;


        if (
            !response.ok ||
            !result.success ||
            !result.data
        ) {

            throw new Error(
                result.error ??
                result.message ??
                "Impossible de récupérer les informations Twitch."
            );

        }


        twitch.value =
            result.data;

    }

    catch (error: unknown) {

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
    viewers: number
): string {

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
</script>


<template>

    <section
        class="home-twitch"
        aria-labelledby="home-twitch-title"
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
        >

            <!-- =============================================
                 IMAGE / PREVIEW
            ============================================== -->

            <div class="home-twitch__visual">

                <img
                    v-if="
                        twitch.isLive &&
                        twitch.thumbnailUrl
                    "
                    :src="twitch.thumbnailUrl"
                    :alt="
                        `Live Twitch de ${twitch.displayName}`
                    "
                    class="home-twitch__preview"
                >


                <div
                    v-else
                    class="home-twitch__offline"
                >

                    <img
                        :src="twitch.profileImageUrl"
                        :alt="
                            `Photo de profil Twitch de ${twitch.displayName}`
                        "
                        class="home-twitch__avatar"
                    >

                </div>


                <!-- =========================================
                     STATUS
                ========================================== -->

                <span
                    class="home-twitch__status"
                    :class="{
                        'home-twitch__status--live':
                            twitch.isLive,

                        'home-twitch__status--offline':
                            !twitch.isLive
                    }"
                >

                    <span
                        class="home-twitch__status-dot"
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

                <div class="home-twitch__identity">

                    <img
                        :src="twitch.profileImageUrl"
                        alt=""
                        class="home-twitch__profile"
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
                        v-if="twitch.title"
                        class="home-twitch__stream-title"
                    >
                        {{ twitch.title }}
                    </h4>


                    <div class="home-twitch__meta">

                        <span
                            v-if="twitch.gameName"
                            class="home-twitch__game"
                        >
                            🎮
                            {{ twitch.gameName }}
                        </span>


                        <span class="home-twitch__viewers">
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
                    class="home-twitch__offline-text"
                >
                    Je ne suis pas en live pour le moment,
                    mais tu peux retrouver mes dernières
                    aventures sur Twitch !
                </p>


                <!-- =========================================
                     BUTTONS
                ========================================== -->

                <div class="home-twitch__actions">

                    <a
                        v-if="twitch.isLive"
                        :href="
                            `https://www.twitch.tv/${twitch.login}`
                        "
                        target="_blank"
                        rel="noopener noreferrer"
                        class="
                            home-twitch__button
                            home-twitch__button--primary
                        "
                    >
                        Regarder le live
                        <span aria-hidden="true">
                            ↗
                        </span>
                    </a>


                    <RouterLink
                        to="/twitch"
                        class="
                            home-twitch__button
                            home-twitch__button--secondary
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