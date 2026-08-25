<script setup lang="ts">
import {
    computed,
    ref
} from "vue";


/* =========================================================
   ÉTAT TEMPORAIRE
   Sera remplacé ensuite par l'API Twitch
========================================================= */

const isLive =
    ref(false);


const isRefreshing =
    ref(false);


/* =========================================================
   STATUT
========================================================= */

const liveStatusText =
    computed(() => {

        return isLive.value
            ? "En direct"
            : "Hors ligne";

    });


/* =========================================================
   ACTUALISATION
========================================================= */

const refreshLive =
    async () => {

        if (isRefreshing.value) {
            return;
        }


        isRefreshing.value =
            true;


        try {

            /*
             * Plus tard :
             *
             * const response =
             *     await fetch("/api/twitch/live");
             *
             * const data =
             *     await response.json();
             *
             * isLive.value =
             *     data.isLive;
             */

            console.log(
                "Actualisation du statut Twitch..."
            );

        }

        catch (error) {

            console.error(
                "Impossible d'actualiser Twitch :",
                error
            );

        }

        finally {

            isRefreshing.value =
                false;

        }

    };
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

                    <span aria-hidden="true">
                        💬
                    </span>

                    Twitch

                    <span aria-hidden="true">
                        ↗
                    </span>

                </a>


                <button
                    type="button"
                    class="twitch-live__refresh"
                    :disabled="isRefreshing"
                    @click="refreshLive"
                >

                    <span
                        class="twitch-live__refresh-icon"
                        :class="{
                            'twitch-live__refresh-icon--loading':
                                isRefreshing
                        }"
                        aria-hidden="true"
                    >
                        ↻
                    </span>


                    <span>
                        {{
                            isRefreshing
                                ? "Actualisation..."
                                : "Actualiser"
                        }}
                    </span>

                </button>

            </div>

        </header>


        <!-- =================================================
             LECTEUR TWITCH
        ================================================== -->

        <div class="twitch-live__player">

            <!-- =============================================
                 BADGE DANS LE PLAYER
            ============================================== -->

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


            <!-- =============================================
                 TWITCH EMBED
            ============================================== -->

            <iframe
                class="twitch-live__iframe"
                src="https://player.twitch.tv/?channel=couaxia&parent=localhost&muted=true"
                title="Live Twitch de Couaxia"
                allowfullscreen
            ></iframe>

        </div>


        <!-- =================================================
             MESSAGE HORS LIGNE
        ================================================== -->

        <div
            v-if="!isLive"
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
                    Tu peux tout de même retrouver les dernières
                    rediffusions, vidéos et clips juste en dessous.
                </p>

            </div>

        </div>

    </section>

</template>