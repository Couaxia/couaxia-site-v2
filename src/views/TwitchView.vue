<script setup lang="ts">
/* =========================================================
   STYLES
========================================================= */

import "../assets/styles/pages/twitch.css";


/* =========================================================
   COMPOSANTS
========================================================= */

import TwitchSection
    from "../components/twitch/TwitchSection.vue";

import TwitchHero
    from "../components/twitch/TwitchHero.vue";   
    
import TwitchLive from "../components/twitch/TwitchLive.vue"   

import TwitchRecommendations from "../components/twitch/witchRecommendations.vue"

import TwitchClips from "../components/twitch/TwitchClips.vue"

import TwitchVideos from "../components/twitch/TwitchVideos.vue"

</script>

<template>

    <main class="twitch-page">

        <div class="page-container">

            <!-- =============================================
                 PRÉSENTATION TWITCH
            ============================================== -->

            <TwitchHero />


            <!-- =============================================
                 LIVE
            ============================================== -->

            <TwitchLive />


            <!-- =============================================
                 STREAMERS RECOMMANDÉS
            ============================================== -->

            <TwitchRecommendations />


            <!-- =============================================
                 CLIPS
            ============================================== -->

            <TwitchClips />


            <!-- =============================================
                 VIDÉOS
            ============================================== -->

            <TwitchVideos />

        </div>

    </main>

</template>