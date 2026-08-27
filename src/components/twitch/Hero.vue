<script setup lang="ts">
import {
    onMounted,
    ref
} from "vue";

import {
    apiFetch
} from "../../services/api";
/* =========================================================
   TYPES
========================================================= */

interface TwitchFollowersResponse {
    success: boolean;

    data?: {
        followers: number;
    };

    message?: string;

    error?: string;
}


/* =========================================================
   STATE
========================================================= */

const followerCount =
    ref<number | null>(
        null
    );


const followersLoading =
    ref(true);


const followersError =
    ref<string | null>(
        null
    );


/* =========================================================
   TAGS
========================================================= */

const tags =
    [
        "🎮 Multi-Gaming",
        "👾 VTubeuse",
        "🇫🇷 Française",
        "💜 Safe Place",
        "🐙 Octopus",
        "🤝 Collab",
        "⚡ Énergie",
        "🌙 Chill",
        "🔞 +18"
    ];


/* =========================================================
   LOAD FOLLOWERS
========================================================= */

async function loadFollowers():
    Promise<void> {

    followersError.value =
        null;


    try {

        const result =
            await apiFetch<TwitchFollowersResponse>(
                "/api/twitch/followers"
            );


        if (
            !result.success ||
            !result.data
        ) {

            throw new Error(
                result.error ??
                result.message ??
                "Impossible de récupérer le nombre de followers."
            );

        }


        followerCount.value =
            result.data.followers;

    }

    catch (error: unknown) {

        console.error(
            "Erreur followers Twitch :",
            error
        );


        followersError.value =
            error instanceof Error
                ? error.message
                : "Une erreur inconnue est survenue.";

    }

    finally {

        followersLoading.value =
            false;

    }

}

/* =========================================================
   MOUNT
========================================================= */

onMounted(
    loadFollowers
);
</script>


<template>

    <section class="twitch-hero">

        <!-- =================================================
             TEXTE
        ================================================== -->

        <div class="twitch-hero__content">

            <span class="twitch-hero__eyebrow">
                CHAÎNE TWITCH
            </span>


            <h1 class="twitch-hero__title">

                Retrouve-moi
                <br>

                en direct sur

                <span class="twitch-hero__title-highlight">
                    Twitch
                </span>

            </h1>


            <p class="twitch-hero__description">

                Viens partager mes aventures,
                mes découvertes, mes jeux
                et mes moments de folie
                avec toute la communauté.

            </p>


            <!-- =============================================
                 FOLLOWERS
            ============================================== -->

            <p class="twitch-hero__followers">

                Vous êtes actuellement

                <strong v-if="followersLoading">
                    …
                </strong>


                <strong v-else-if="followerCount !== null">
                    {{ followerCount }}
                </strong>


                <strong v-else>
                    —
                </strong>

                à suivre les aventures de Couaxia sur Twitch !

            </p>


            <!-- =============================================
                 ERREUR FOLLOWERS
            ============================================== -->

            <p
                v-if="followersError"
                class="twitch-hero__followers-error"
            >
                Le nombre de followers est temporairement indisponible.
            </p>


            <!-- =============================================
                 TAGS
            ============================================== -->

            <div class="twitch-hero__tags">

                <span
                    v-for="tag in tags"
                    :key="tag"
                    class="twitch-hero__tag"
                >
                    {{ tag }}
                </span>

            </div>


            <!-- =============================================
                 BOUTON TWITCH
            ============================================== -->

            <div class="twitch-hero__actions">

                <a
                    href="https://www.twitch.tv/couaxia"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="twitch-hero__button"
                >

                    <span aria-hidden="true">
                        💬
                    </span>

                    Voir la chaîne Twitch

                    <span aria-hidden="true">
                        ↗
                    </span>

                </a>

            </div>

        </div>


        <!-- =================================================
             VISUEL
        ================================================== -->

        <div class="twitch-hero__visual">

            <div class="twitch-hero__image-wrapper">

                <img
                    src="https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/artworks/couple/Couaxia_Myo.png"
                    alt="Couaxia et Myo"
                    class="twitch-hero__image"
                >

            </div>

        </div>

    </section>

</template>