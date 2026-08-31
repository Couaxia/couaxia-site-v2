<script setup lang="ts">

/* =========================================================
   STYLES
========================================================= */

import "../assets/styles/pages/history.css";


/* =========================================================
   COMPONENTS
========================================================= */

import HistoryHero
    from "../components/history/Hero.vue";

import HistoryTimeline
    from "../components/history/Timeline.vue";

import HistoryCharacters
    from "../components/history/Characters.vue";

import HistoryUniverse
    from "../components/history/Universe.vue";

import HistoryGallery
    from "../components/history/Gallery.vue";

import StoryBook
    from "../components/history/StoryBook.vue";

import HistoryFinal
    from "../components/history/Final.vue";

</script>


<template>

    <main class="history-page">

        <!-- =================================================
             HERO
        ================================================== -->

        <HistoryHero />


        <!-- =================================================
             TIMELINE
        ================================================== -->

        <HistoryTimeline />


        <!-- =================================================
             CHAPTERS
        ================================================== -->

        <StoryBook />

        <!-- =================================================
             CHARACTERS
        ================================================== -->

        <HistoryCharacters />
        

        <!-- =================================================
             UNIVERSE
        ================================================== -->

        <HistoryUniverse />


        <!-- =================================================
             GALLERY
        ================================================== -->

        <HistoryGallery />


        <!-- =================================================
             FINAL
        ================================================== -->

        <HistoryFinal />

        

    </main>

</template>