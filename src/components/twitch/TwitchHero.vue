<script setup lang="ts">
/* =========================================================
   TWITCH HERO — COUAXIA
========================================================= */

const followerCount =
    902;


const tags =
    [
        "🎮 Multi-Gaming",
        "👾 VTubueuse",
        "🇫🇷 Française",
        "💜 Safe Place",
        "🐙 Octopus",
        "🤝 Collab",
        "⚡ Énergie",
        "🌙 Chill",
        "🔞 +18"
    ];
</script>


<template>

    <section class="twitch-hero">

        <div class="twitch-hero__content">


            <!-- =========================================
                 LABEL
            ========================================== -->

            <span class="twitch-hero__eyebrow">
                CHAÎNE TWITCH
            </span>


            <!-- =========================================
                 TITRE
            ========================================== -->

            <h1 class="twitch-hero__title">

                Retrouve-moi
                <br>

                en direct sur

                <span class="twitch-hero__title-highlight">
                    Twitch
                </span>

            </h1>


            <!-- =========================================
                 DESCRIPTION
            ========================================== -->

            <p class="twitch-hero__description">

                Viens partager mes aventures,
                mes découvertes, mes jeux
                et mes moments de folie
                avec toute la communauté.

            </p>


            <!-- =========================================
                 FOLLOWERS
            ========================================== -->

            <p class="twitch-hero__followers">

                Vous êtes actuellement

                <strong>
                    {{ followerCount }}
                </strong>

                à suivre les aventures de Couaxia sur Twitch !

            </p>


            <!-- =========================================
                 TAGS
            ========================================== -->

            <div class="twitch-hero__tags">

                <span
                    v-for="tag in tags"
                    :key="tag"
                    class="twitch-hero__tag"
                >
                    {{ tag }}
                </span>

            </div>


            <!-- =========================================
                 BOUTON
            ========================================== -->

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


        <!-- =============================================
             VISUEL
        ============================================== -->

        <div class="twitch-hero__visual">

            <div class="twitch-hero__image-wrapper">

                <!--
                    TEMPORAIRE :
                    on remplacera par ton vrai artwork
                    ensuite.
                -->

                <div class="twitch-hero__placeholder">
                    🐙
                </div>

            </div>

        </div>

    </section>

</template>