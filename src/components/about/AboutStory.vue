<script setup lang="ts">

/* =========================================================
   ABOUT STORY
========================================================= */

const storyImage =
    "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/artworks/Couaxia/forme-2/Couaxia_pp_Melumii.png";

</script>


<template>

    <section
        class="about-story"
        aria-labelledby="about-story-title"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header class="about-story__header">

            <p class="about-story__eyebrow">
                DERRIÈRE COUAXIA
            </p>


            <h2
                id="about-story-title"
                class="about-story__title"
            >
                Qui suis-je ?
            </h2>


            <p class="about-story__description">
                Quelques mots pour découvrir la personne,
                la VTubeuse et l’univers qui se cachent
                derrière Couaxia.
            </p>

        </header>


        <!-- =================================================
             CONTENT
        ================================================== -->

        <div class="about-story__content">

            <!-- =============================================
                 IMAGE
            ============================================== -->

            <div class="about-story__visual">

                <div
                    class="about-story__glow"
                    aria-hidden="true"
                ></div>


                <img
                    :src="storyImage"
                    alt="Illustration de Couaxia"
                    class="about-story__image"
                >

            </div>


            <!-- =============================================
                 STORY
            ============================================== -->

            <div class="about-story__text">

                <!-- =========================================
                     01 — INTRODUCTION
                ========================================== -->

                <div class="about-story__block">

                    <span class="about-story__number">
                        01
                    </span>


                    <div>

                        <h3 class="about-story__subtitle">
                            Couaxia, c’est moi !
                        </h3>


                        <p>
                            Je suis une VTubeuse française
                            passionnée par les jeux vidéo,
                            les univers fantastiques et la
                            création de contenu.
                        </p>


                        <p>
                            J’aime avant tout partager des
                            moments simples, drôles et parfois
                            complètement chaotiques avec ma
                            communauté.
                        </p>

                    </div>

                </div>


                <!-- =========================================
                     02 — VTUBING
                ========================================== -->

                <div class="about-story__block">

                    <span class="about-story__number">
                        02
                    </span>


                    <div>

                        <h3 class="about-story__subtitle">
                            Mon aventure de VTubeuse
                        </h3>


                        <p>
                            J’ai commencé le VTubing le
                            <strong>2 juin 2025</strong>.
                            Depuis, je développe petit à petit
                            mon univers autour de Couaxia,
                            aussi bien sur Twitch que sur mes
                            autres réseaux.
                        </p>


                        <p>
                            Je suis devenue affiliée Twitch
                            le <strong>20 mai 2025</strong>,
                            une première étape importante dans
                            cette aventure.
                        </p>

                    </div>

                </div>


                <!-- =========================================
                     03 — STREAMS
                ========================================== -->

                <div class="about-story__block">

                    <span class="about-story__number">
                        03
                    </span>


                    <div>

                        <h3 class="about-story__subtitle">
                            Mes streams
                        </h3>


                        <p>
                            Je fais principalement du
                            multigaming : jeux narratifs,
                            jeux d’horreur, jeux multijoueurs
                            et découvertes en tout genre.
                        </p>


                        <p>
                            Le but n’est pas forcément d’être
                            la meilleure joueuse du monde...
                            mais plutôt de passer un bon moment
                            ensemble et de créer des souvenirs.
                        </p>

                    </div>

                </div>

                <!-- =========================================
                     04 — UNIVERSE
                ========================================== -->

                <div class="about-story__block">

                    <span class="about-story__number">
                        04
                    </span>


                    <div>

                        <h3 class="about-story__subtitle">
                            Et derrière les tentacules ?
                        </h3>


                        <p>
                            Couaxia possède également sa propre
                            histoire, avec son peuple, les
                            <strong>Kraduks</strong>, sa planète
                            <strong>Saphira</strong> et les
                            différentes créatures et personnages
                            rencontrés au cours de son voyage.
                        </p>


                        <p>
                            Cet univers continue de grandir au
                            fil du temps et fait partie intégrante
                            de mon identité de VTubeuse.
                        </p>

                    </div>

                </div>


                <!-- =========================================
                     STORY BUTTON
                ========================================== -->

                <div class="about-story__actions">

                    <RouterLink
                        to="/histoire"
                        class="about-story__button"
                    >

                        <span
                            class="about-story__button-icon"
                            aria-hidden="true"
                        >
                            📖
                        </span>


                        <span>
                            Découvrir mon histoire
                        </span>


                        <span
                            class="about-story__button-arrow"
                            aria-hidden="true"
                        >
                            →
                        </span>

                    </RouterLink>

                </div>

            </div>

        </div>

    </section>

</template>