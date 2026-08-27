<script setup lang="ts">
/* =========================================================
   STYLES
========================================================= */

import "../assets/styles/pages/twitch.css";


/* =========================================================
   COMPOSANTS
========================================================= */



import TwitchHero from "../components/twitch/Hero.vue";   
    
import TwitchLive from "../components/twitch/Live.vue"   

import TwitchRecommendations from "../components/twitch/Recommendations.vue"

import TwitchClips from "../components/twitch/Clips.vue"

import TwitchVideos from "../components/twitch/Videos.vue"

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