<script setup lang="ts">
import { ref } from 'vue';
import GamesHero from '../components/games/Hero.vue';
import GamesFavorites from '../components/games/Favorites.vue';
import GamesCurrently from '../components/games/Currently.vue';
import GamesCategories from '../components/games/Categories.vue';
import GamesFinal from '../components/games/Final.vue';
import GamesStats from '../components/games/Stats.vue';
import TentacleRunLightbox from '../components/easter-eggs/TentacleRunLightbox.vue';
import '../assets/styles/pages/games.css';
const gameOpen = ref(false);
</script>
<template>
  <main class="games-page">
    <div class="page-container">
      <GamesHero />
      <GamesStats />
      <GamesFavorites />
      <GamesCurrently />
      <GamesCategories />
      <GamesFinal @open-tentacle-run="gameOpen = true" />
    </div>
    <TentacleRunLightbox :open="gameOpen" @close="gameOpen = false" />
  </main>
</template>
