
<script setup lang="ts">

import { RouterLink } from "vue-router";

import "../assets/styles/pages/not-found.css";

</script>

<template>

    <main class="not-found-page">

        <!-- ÉTOILES DÉCORATIVES -->

        <div
            class="not-found-page__stars"
            aria-hidden="true"
        ></div>

        <section class="not-found-page__content">

            <span class="not-found-page__eyebrow">
                ✦ OUPS... PLANÈTE INTROUVABLE ✦
            </span>

            <div class="not-found-page__number">
                404
            </div>

            <div
                class="not-found-page__planet"
                aria-hidden="true"
            >
                <span class="not-found-page__planet-ring"></span>
                <span class="not-found-page__planet-core"></span>
            </div>

            <h1 class="not-found-page__title">
                Perdue dans l'espace ?
            </h1>

            <p class="not-found-page__description">
                Oh non ! Cette planète ne figure pas
                sur la carte de l'Avadora...
                <br />
                Mais ne t'inquiète pas, Couaxia
                connaît le chemin du retour ! 🐙
            </p>

            <RouterLink
                to="/"
                class="not-found-page__button"
            >
                🚀 Retour à l'accueil
            </RouterLink>

            <span class="not-found-page__signature">
                ✦ Un univers, mille tentacules ✦
            </span>

        </section>

    </main>

</template>
