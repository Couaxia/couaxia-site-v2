<script setup lang="ts">
import "../assets/styles/pages/home.css";

import TwitchSection
    from "../components/twitch/TwitchSection.vue";
</script>


<template>

    <main class="home-page">

        <div class="page-container">


            <!-- =================================================
                 HERO
            ================================================== -->

            <section class="home-hero">

                <div class="home-hero__content">

                    <span class="home-hero__eyebrow">
                        🐙 VTUBEUSE • MULTIGAMING • HUMOUR
                    </span>


                    <h1 class="home-hero__title">

                        Bienvenue dans l'univers de

                        <span class="home-hero__title-highlight">
                            Couaxia
                        </span>

                    </h1>


                    <p class="home-hero__description">

                        Je suis Couaxia, VTubeuse multigaming.

                        Ici tu peux retrouver mon univers,
                        mes jeux, mes artworks, mon histoire,
                        mes sondages et tout ce qui concerne
                        mes lives Twitch.

                    </p>


                    <!-- =========================================
                         ACTIONS
                    ========================================== -->

                    <div class="home-hero__actions">

                        <RouterLink
                            to="/about"
                            class="home-hero__button"
                        >
                            👤
                            Mes informations
                        </RouterLink>


                        <RouterLink
                            to="/history"
                            class="
                                home-hero__button
                                home-hero__button--secondary
                            "
                        >
                            📖
                            Découvrir mon histoire
                        </RouterLink>

                    </div>

                </div>


                <!-- =============================================
                     VISUEL
                ============================================== -->

                <div class="home-hero__visual">

                    <div class="home-hero__visual">

                        <div class="home-hero__image-wrapper">

                            <img
                                src="https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/artworks/stream/Koleander_chibi.png"
                                alt="Illustration de Couaxia"
                                class="home-hero__image"
                            />

                        </div>

                    </div>

                </div>

            </section>


            <!-- =================================================
                 INFOS RAPIDES
            ================================================== -->

            <section class="home-section">

                <div class="home-section__header">

                    <div>

                        <h2 class="home-section__heading">
                            Mon univers
                        </h2>

                        <p class="home-section__subtitle">
                            Quelques raccourcis pour découvrir le site.
                        </p>

                    </div>

                </div>


                <div class="home-info-grid">


                    <!-- =========================================
                         JEUX
                    ========================================== -->

                    <RouterLink
                        to="/games"
                        class="home-info-card"
                    >

                        <span class="home-info-card__icon">
                            🎮
                        </span>


                        <h3 class="home-info-card__title">
                            Mes jeux
                        </h3>


                        <p class="home-info-card__text">
                            Retrouve les jeux auxquels je joue,
                            mes avis, mes statuts et les prochaines
                            aventures prévues.
                        </p>

                    </RouterLink>


                    <!-- =========================================
                         SONDAGES
                    ========================================== -->

                    <RouterLink
                        to="/polls"
                        class="home-info-card"
                    >

                        <span class="home-info-card__icon">
                            🗳️
                        </span>


                        <h3 class="home-info-card__title">
                            Sondages
                        </h3>


                        <p class="home-info-card__text">
                            Vote pour les prochains jeux,
                            événements ou choix proposés
                            à la communauté.
                        </p>

                    </RouterLink>


                    <!-- =========================================
                         CRÉDITS / ARTWORKS
                    ========================================== -->

                    <RouterLink
                        to="/credits"
                        class="home-info-card"
                    >

                        <span class="home-info-card__icon">
                            🎨
                        </span>


                        <h3 class="home-info-card__title">
                            Artworks & Crédits
                        </h3>


                        <p class="home-info-card__text">
                            Découvre les illustrations,
                            créations et artistes qui participent
                            à l'univers de Couaxia.
                        </p>

                    </RouterLink>

                </div>

            </section>


            <!-- =================================================
                 TWITCH
            ================================================== -->

            <section class="home-section">

                <div class="home-section__header">

                    <div>

                        <h2 class="home-section__heading">
                            Twitch
                        </h2>

                        <p class="home-section__subtitle">
                            Retrouve ici le statut du live,
                            les informations du stream,
                            les clips et les vidéos.
                        </p>

                    </div>

                </div>


                <TwitchSection />

            </section>


            <!-- =================================================
                 DÉCOUVERTE
            ================================================== -->

            <section
                class="
                    home-section
                    page-section
                "
            >

                <div class="home-section__header">

                    <div>

                        <h2 class="home-section__heading">
                            Découvrir Couaxia
                        </h2>

                        <p class="home-section__subtitle">
                            Explore les différentes parties
                            de mon univers.
                        </p>

                    </div>

                </div>


                <div class="home-info-grid">


                    <!-- =========================================
                         INFORMATIONS
                    ========================================== -->

                    <RouterLink
                        to="/about"
                        class="home-info-card"
                    >

                        <span class="home-info-card__icon">
                            👤
                        </span>


                        <h3 class="home-info-card__title">
                            Mes informations
                        </h3>


                        <p class="home-info-card__text">
                            Apprends-en plus sur moi,
                            mon VTubing et mon parcours.
                        </p>

                    </RouterLink>


                    <!-- =========================================
                         HISTOIRE
                    ========================================== -->

                    <RouterLink
                        to="/history"
                        class="home-info-card"
                    >

                        <span class="home-info-card__icon">
                            📚
                        </span>


                        <h3 class="home-info-card__title">
                            Mon histoire
                        </h3>


                        <p class="home-info-card__text">
                            Découvre le lore,
                            les personnages et les aventures
                            de l'univers Couaxia.
                        </p>

                    </RouterLink>


                    <!-- =========================================
                         PROFIL
                    ========================================== -->

                    <RouterLink
                        to="/login"
                        class="home-info-card"
                    >

                        <span class="home-info-card__icon">
                            🔐
                        </span>


                        <h3 class="home-info-card__title">
                            Ton espace
                        </h3>


                        <p class="home-info-card__text">
                            Connecte-toi pour accéder
                            plus tard à ton profil,
                            tes favoris et tes fonctionnalités.
                        </p>

                    </RouterLink>

                </div>

            </section>

        </div>

    </main>

</template>