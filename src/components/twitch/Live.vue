<script setup lang="ts">
import {
    computed,
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

const liveData =
    ref<TwitchLiveData | null>(
        null
    );


const loading =
    ref(true);


const refreshing =
    ref(false);


const errorMessage =
    ref<string | null>(
        null
    );


/* =========================================================
   COMPUTED
========================================================= */

const isLive =
    computed(() => {

        return liveData.value?.isLive
            ?? false;

    });


const liveStatusText =
    computed(() => {

        if (loading.value) {

            return "Vérification…";

        }


        return isLive.value
            ? "En direct"
            : "Hors ligne";

    });


const gameName =
    computed(() => {

        return liveData.value?.gameName
            ?? "Hors ligne";

    });


const viewers =
    computed(() => {

        return liveData.value?.viewers
            ?? 0;

    });


const streamTitle =
    computed(() => {

        return liveData.value?.title
            ?? "Couaxia est actuellement hors ligne.";

    });


const twitchPlayerUrl =
    computed(() => {

        const parent =
            window.location.hostname;


        return (
            "https://player.twitch.tv/" +
            "?channel=couaxia" +
            `&parent=${parent}` +
            "&muted=true"
        );

    });

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
            !result.success ||
            !result.data
        ) {

            throw new Error(
                result.error
                ?? result.message
                ?? "Impossible de récupérer les informations Twitch."
            );

        }


        liveData.value =
            result.data;

    }

    catch (error: unknown) {

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

    if (refreshing.value) {

        return;

    }


    refreshing.value =
        true;


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
</script>


<template>

    <section
        id="live"
        class="twitch-live"
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
                    @click="refreshLive"
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

            <div class="twitch-live__player">

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

                <div class="twitch-live__info">

                    <span class="twitch-live__info-label">
                        Catégorie
                    </span>

                    <strong>
                        {{ gameName }}
                    </strong>

                </div>


                <div class="twitch-live__info">

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