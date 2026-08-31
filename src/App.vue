<script setup lang="ts">
import { RouterView } from "vue-router";

import AppHeader
    from "./components/layout/AppHeader.vue";


import Mascot
    from "./components/mascot/Mascot.vue";
import ScrollPage
    from "./components/layout/ScrollPage.vue";    
</script>


<template>

    <AppHeader />

    <RouterView />

    <Mascot />

    <ScrollPage/>
</template>