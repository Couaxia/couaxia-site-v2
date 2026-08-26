<script setup lang="ts">

import AboutHero from "../components/about/AboutHero.vue";
import AboutInfo from "../components/about/AboutInfo.vue";
import AboutTastes from "../components/about/AboutTastes.vue";
import AboutStory from "../components/about/AboutStory.vue";
import AboutReferences from "../components/about/AboutReferences.vue";
import AboutPalette from "../components/about/AboutPalette.vue";
import AboutJourney from "../components/about/AboutJourney.vue";
import AboutPreferences from "../components/about/AboutPreferences.vue";
import AboutFinal from "../components/about/AboutFinal.vue";

import "../assets/styles/pages/about.css";

</script>


<template>

    <main class="about-page">

        <!-- ==========================================
             PRÉSENTATION PRINCIPALE
        =========================================== -->

        <div class="page-container">

            <AboutHero />


        <!-- ==========================================
             INFORMATIONS RAPIDES
        =========================================== -->

            <AboutInfo />


        <!-- ==========================================
             GOÛTS ET PRÉFÉRENCES
        =========================================== -->

            <AboutTastes />


        <!-- ==========================================
             QUI SUIS-JE ?
        =========================================== -->

            <AboutStory />


        <!-- ==========================================
             RÉFÉRENCES DU PERSONNAGE
        =========================================== -->

            <AboutReferences />


        <!-- ==========================================
             PALETTE
        =========================================== -->

            <AboutPalette />


        <!-- ==========================================
             MON PARCOURS
        =========================================== -->

            <AboutJourney />


        <!-- ==========================================
             PERSONNALITÉ ET PRÉFÉRENCES
        =========================================== -->

            <AboutPreferences />


        <!-- ==========================================
             APPEL FINAL
        =========================================== -->

            <AboutFinal />
 
        </div>
    </main>

</template>