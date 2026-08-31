<script setup lang="ts">

/* =========================================================
   VUE
========================================================= */

import {
    onMounted,
    onBeforeUnmount
} from "vue";

import {
    RouterView
} from "vue-router";


/* =========================================================
   LAYOUT
========================================================= */

import AppHeader
    from "./components/layout/AppHeader.vue";

import ScrollPage
    from "./components/layout/ScrollPage.vue";


/* =========================================================
   MASCOT
========================================================= */

import Mascot
    from "./components/mascot/Mascot.vue";


/* =========================================================
   CONTENT PROTECTION
========================================================= */

import {
    disableContentProtection,
    enableContentProtection
} from "./composables/useImageProtection";


/* =========================================================
   ENABLE CONTENT PROTECTION
========================================================= */

onMounted(
    () => {

        enableContentProtection();

    }
);


/* =========================================================
   DISABLE CONTENT PROTECTION
========================================================= */

onBeforeUnmount(
    () => {

        disableContentProtection();

    }
);

</script>


<template>

    <!-- =====================================================
         HEADER
    ====================================================== -->

    <AppHeader />


    <!-- =====================================================
         CURRENT PAGE
    ====================================================== -->

    <RouterView />


    <!-- =====================================================
         GLOBAL MASCOT
    ====================================================== -->

    <Mascot />


    <!-- =====================================================
         GLOBAL SCROLL BUTTONS
    ====================================================== -->

    <ScrollPage />

</template>