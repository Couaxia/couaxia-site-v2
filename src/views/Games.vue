<script setup lang="ts">

import GamesHero from "../components/games/Hero.vue";
import GamesFavorites from "../components/games/Favorites.vue";
import GamesCurrently from "../components/games/Currently.vue";
import GamesCategories from "../components/games/Categories.vue";
import GamesFinal from "../components/games/Final.vue";
import GamesStats from "../components/games/Stats.vue";

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