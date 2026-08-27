<script setup lang="ts">

/* =========================================================
   FINAL IMAGE
========================================================= */

const finalImage =
    "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/mascotte/YCH_Dance_V2.gif";


/* =========================================================
   MASCOT MESSAGES
========================================================= */

const finalMessages = [

    "Alors, tu as trouvé un jeu que tu aimerais voir en stream ?",

    "La bibliothèque va encore grandir, c’est certain !",

    "Il reste encore beaucoup trop de jeux à découvrir ensemble.",

    "Les Poups auront encore beaucoup de décisions à prendre !",

    "Une nouvelle aventure peut commencer n’importe quand..."

];


/* =========================================================
   MASCOT
========================================================= */

function speakWithMascot() {

    if (
        finalMessages.length === 0
    ) {

        return;

    }


    const randomIndex =
        Math.floor(
            Math.random() *
            finalMessages.length
        );


    const message =
        finalMessages[randomIndex];


    window.dispatchEvent(
        new CustomEvent(
            "couaxia-mascot-message",
            {
                detail: {
                    message
                }
            }
        )
    );

}

</script>


<template>

    <section
        class="games-final"
        aria-labelledby="games-final-title"
        @mouseenter="speakWithMascot"
    >

        <!-- =================================================
             GLOWS
        ================================================== -->

        <div
            class="
                games-final__glow
                games-final__glow--left
            "
            aria-hidden="true"
        ></div>


        <div
            class="
                games-final__glow
                games-final__glow--right
            "
            aria-hidden="true"
        ></div>


        <!-- =================================================
             CONTENT
        ================================================== -->

        <div class="games-final__content">

            <!-- =============================================
                 TEXT
            ============================================== -->

            <div class="games-final__text">

                <p class="games-final__eyebrow">
                    LA SUITE ?
                </p>


                <h2
                    id="games-final-title"
                    class="games-final__title"
                >
                    Quelle sera la prochaine
                    <span>
                        aventure ?
                    </span>
                </h2>


                <p class="games-final__description">
                    Ma bibliothèque continue d’évoluer au fil
                    des streams, des découvertes et des envies
                    de la communauté.
                </p>


                <p class="games-final__description">
                    Certains jeux sont choisis directement,
                    d’autres passent par les sondages des Poups...
                    et parfois une idée complètement imprévue
                    débarque au dernier moment.
                </p>


                <p class="games-final__message">
                    On se retrouve pour la prochaine aventure 💜
                </p>


                <!-- =========================================
                     ACTIONS
                ========================================== -->

                <div class="games-final__actions">

                    <!-- TWITCH -->

                    <a
                        href="https://www.twitch.tv/couaxia"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="
                            games-final__button
                            games-final__button--primary
                        "
                        @mouseenter.stop="speakWithMascot"
                        @focus="speakWithMascot"
                    >

                        <img
                            src="https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/logo/twitch-logo-transparent.png"
                            alt=""
                            class="games-final__button-icon"
                        >


                        <span>
                            Me retrouver sur Twitch
                        </span>


                        <span
                            class="games-final__button-arrow"
                            aria-hidden="true"
                        >
                            →
                        </span>

                    </a>


                    <!-- POLLS -->

                    <RouterLink
                        to="/sondages"
                        class="
                            games-final__button
                            games-final__button--secondary
                        "
                    >

                        <span
                            class="games-final__button-emoji"
                            aria-hidden="true"
                        >
                            🗳️
                        </span>


                        <span>
                            Voir les sondages
                        </span>


                        <span
                            class="games-final__button-arrow"
                            aria-hidden="true"
                        >
                            →
                        </span>

                    </RouterLink>

                </div>

            </div>


            <!-- =============================================
                 VISUAL
            ============================================== -->

            <div class="games-final__visual">

                <div
                    class="games-final__image-glow"
                    aria-hidden="true"
                ></div>


                <span
                    class="
                        games-final__decoration
                        games-final__decoration--one
                    "
                    aria-hidden="true"
                >
                    ✦
                </span>


                <span
                    class="
                        games-final__decoration
                        games-final__decoration--two
                    "
                    aria-hidden="true"
                >
                    🎮
                </span>


                <img
                    :src="finalImage"
                    alt="Couaxia"
                    class="games-final__image"
                    loading="lazy"
                >

            </div>

        </div>

    </section>

</template>