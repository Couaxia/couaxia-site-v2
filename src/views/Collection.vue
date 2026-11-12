<script setup lang="ts">
/* =========================================================
   COMPONENTS
========================================================= */

import CardCollection from "../components/cards/CardCollection.vue";
</script>


<template>
    <main class="collection-page">

        <!-- =========================================
             PAGE HEADER
        ========================================== -->

        <header class="collection-page__header">

            <span class="collection-page__eyebrow">
                ✦ L'UNIVERS DE COUAXIA ✦
            </span>

            <h1>
                🐙 Ma collection
            </h1>

            <p>
                Retrouve toutes les cartes que tu as obtenues
                au fil de tes aventures !
            </p>

            <p>
                Collectionne les personnages, découvre
                les lieux de Saphira et conserve
                les souvenirs des événements spéciaux.
            </p>

        </header>


        <!-- =========================================
             COLLECTION
        ========================================== -->

        <CardCollection />

    </main>
</template>


<style scoped>
/* =========================================================
   PAGE
========================================================= */

.collection-page {
    position: relative;
    width: 100%;
    min-height: 100vh;
    padding: 120px 24px 80px;

    background:
        radial-gradient(
            ellipse at 50% 0%,
            rgba(128, 45, 172, 0.13),
            transparent 55%
        );
}


/* =========================================================
   HEADER
========================================================= */

.collection-page__header {
    max-width: 850px;
    margin: 0 auto 50px;
    text-align: center;
}

.collection-page__eyebrow {
    display: block;
    margin-bottom: 18px;
    color: #d8a4ff;
    font-size: 0.85rem;
    font-weight: 800;
    letter-spacing: 0.2em;
}

.collection-page__header h1 {
    margin: 0 0 24px;
    color: #fff;
    font-size: clamp(2.2rem, 5vw, 4rem);
    font-weight: 900;
    line-height: 1.2;
    text-shadow: 0 0 25px rgba(192, 132, 252, 0.25);
}

.collection-page__header p {
    margin: 0 auto 12px;
    color: #cbb7d8;
    font-size: 1.05rem;
    line-height: 1.8;
}


/* =========================================================
   LIGHT MODE
========================================================= */

:global(html[data-theme="light"])
.collection-page__header h1 {
    color: #47175d;
}

:global(html[data-theme="light"])
.collection-page__header p {
    color: #654c70;
}

:global(html[data-theme="light"])
.collection-page__eyebrow {
    color: #8b3ac0;
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 700px) {
    .collection-page {
        padding: 100px 15px 60px;
    }

    .collection-page__header {
        margin-bottom: 35px;
    }

    .collection-page__header p {
        font-size: 0.95rem;
    }
}
</style>