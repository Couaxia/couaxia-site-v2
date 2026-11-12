<script setup lang="ts">

/* =========================================================
   VUE
========================================================= */

import {
    onMounted,
    onBeforeUnmount,
    ref
} from "vue";

import {
    RouterView,
    useRouter
} from "vue-router";

/* =========================================================
   LAYOUT
========================================================= */

import AppHeader from "./components/layout/AppHeader.vue";

import ScrollPage from "./components/layout/ScrollPage.vue";

/* =========================================================
   MASCOT
========================================================= */

import Mascot from "./components/mascot/Mascot.vue";

import CustomCursor from "./components/ui/CustomCursor.vue";

/* =========================================================
   GLOBAL LOADER
========================================================= */

import AppLoader from "././components/ui/AppLoader.vue";

/* =========================================================
   CONTENT PROTECTION
========================================================= */

import {
    disableContentProtection,
    enableContentProtection
} from "./composables/useImageProtection";

/* =========================================================
   ROUTER
========================================================= */

const router = useRouter();

/* =========================================================
   LOADING STATE
========================================================= */

const isPageLoading = ref(false);

let loadingTimer: ReturnType<typeof setTimeout> | null = null;

/* =========================================================
   START LOADING
========================================================= */

function startLoading() {

    if (loadingTimer) {
        clearTimeout(loadingTimer);
        loadingTimer = null;
    }

    isPageLoading.value = true;

}

/* =========================================================
   STOP LOADING
========================================================= */

function stopLoading() {

    if (loadingTimer) {
        clearTimeout(loadingTimer);
    }

    loadingTimer = setTimeout(() => {

        isPageLoading.value = false;
        loadingTimer = null;

    }, 250);

}

/* =========================================================
   ROUTER LOADING
========================================================= */

const removeBeforeEach = router.beforeEach(() => {

    startLoading();

});

const removeAfterEach = router.afterEach(() => {

    stopLoading();

});

const removeOnError = router.onError(() => {

    stopLoading();

});

/* =========================================================
   ENABLE CONTENT PROTECTION
========================================================= */

onMounted(() => {

    enableContentProtection();

});

/* =========================================================
   CLEANUP
========================================================= */

onBeforeUnmount(() => {

    disableContentProtection();

    removeBeforeEach();
    removeAfterEach();
    removeOnError();

    if (loadingTimer) {
        clearTimeout(loadingTimer);
        loadingTimer = null;
    }

});

</script>

<template>

    <!-- =====================================================
         GLOBAL LOADER
    ====================================================== -->

    <Teleport to="body">

        <Transition name="couaxia-loader">

            <AppLoader
                v-if="isPageLoading"
                text="Chargement de l'univers Couaxia..."
                size="large"
                overlay
            />

        </Transition>

    </Teleport>

    <!-- =====================================================
         HEADER
    ====================================================== -->

    <AppHeader />

    <!-- =====================================================
         CUSTOM CURSOR
    ====================================================== -->

    <CustomCursor />

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

<style scoped>

/* =========================================================
   LOADER TRANSITION
========================================================= */

.couaxia-loader-enter-active,
.couaxia-loader-leave-active {
    transition:
        opacity 0.25s ease,
        backdrop-filter 0.25s ease;
}

.couaxia-loader-enter-from,
.couaxia-loader-leave-to {
    opacity: 0;
    backdrop-filter: blur(0);
}

</style>