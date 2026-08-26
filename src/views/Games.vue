<script setup lang="ts">

import GamesHero from "../components/games/GamesHero.vue";
import GamesFavorites from "../components/games/GamesFavorites.vue";
import GamesCurrently from "../components/games/GamesCurrently.vue";
import GamesCategories from "../components/games/GamesCategories.vue";
import GamesFinal from "../components/games/GamesFinal.vue";
import GamesStats from "../components/games/GamesStats.vue";

import "../assets/styles/pages/games.css";

</script>


<template>

    <main class="games-page">

        <div class="page-container">

            <GamesHero />

            <GamesStats />
            
            <GamesFavorites />

            <GamesCurrently />

            <GamesCategories />

            <GamesFinal />

        </div>

    </main>

</template>