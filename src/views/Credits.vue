<script setup lang="ts">

import CreditsHero
    from "../components/gallery/Hero.vue";

import CreditsFilters
    from "../components/gallery/Filters.vue";

import CreditsRandom
    from "../components/gallery/Random.vue";

import CreditsGallery
    from "../components/gallery/Gallery.vue";

import "../assets/styles/pages/gallery.css";

</script>


<template>

    <main class="credits-page">

        <CreditsHero />

        <CreditsFilters />

        <CreditsRandom />

        <CreditsGallery />

    </main>

</template>