<script setup lang="ts">

/* =========================================================
   ABOUT FINAL
========================================================= */

const finalImage =
    "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/artworks/Couaxia/forme-2/SPOILER_Jack_O_Lantern_Violet_-_background.png";

</script>


<template>

    <section
        class="about-final"
        aria-labelledby="about-final-title"
    >

        <!-- =================================================
             GLOW
        ================================================== -->

        <div
            class="about-final__glow about-final__glow--left"
            aria-hidden="true"
        ></div>


        <div
            class="about-final__glow about-final__glow--right"
            aria-hidden="true"
        ></div>


        <!-- =================================================
             CONTENT
        ================================================== -->

        <div class="about-final__content">

            <!-- =============================================
                 TEXT
            ============================================== -->

            <div class="about-final__text">

                <p class="about-final__eyebrow">
                    ET VOILÀ !
                </p>


                <h2
                    id="about-final-title"
                    class="about-final__title"
                >
                    Maintenant, tu en sais un peu plus
                    <span>sur moi.</span>
                </h2>


                <p class="about-final__description">
                    Couaxia, c’est du multigaming,
                    des tentacules, beaucoup de chaos,
                    un univers qui continue de grandir
                    et surtout une aventure partagée
                    avec toute une communauté.
                </p>


                <p class="about-final__message">
                    Merci de faire partie du voyage 💜
                </p>


                <!-- =========================================
                     ACTIONS
                ========================================== -->

                <div class="about-final__actions">

                    <RouterLink
                        to="/histoire"
                        class="
                            about-final__button
                            about-final__button--primary
                        "
                    >

                        <span
                            aria-hidden="true"
                            class="about-final__button-icon"
                        >
                            📖
                        </span>


                        <span>
                            Découvrir mon histoire
                        </span>

                    </RouterLink>


                    <RouterLink
                        to="/reseaux"
                        class="
                            about-final__button
                            about-final__button--secondary
                        "
                    >

                        <span
                            aria-hidden="true"
                            class="about-final__button-icon"
                        >
                            ✨
                        </span>


                        <span>
                            Mes réseaux
                        </span>

                    </RouterLink>

                </div>

            </div>


            <!-- =============================================
                 VISUAL
            ============================================== -->

            <div class="about-final__visual">

                <div
                    class="about-final__image-glow"
                    aria-hidden="true"
                ></div>


                <img
                    :src="finalImage"
                    alt="Couaxia"
                    class="about-final__image"
                    loading="lazy"
                >

            </div>

        </div>

    </section>

</template>