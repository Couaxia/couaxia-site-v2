<script setup lang="ts">

/* =========================================================
   GAMES HERO
========================================================= */

const heroImage =
    "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/mascotte/YCH_Dance_V2.gif";


/* =========================================================
   HERO TAGS
========================================================= */

const gameTags = [

    {
        icon: "🎮",
        label: "Multigaming"
    },

    {
        icon: "👻",
        label: "Horreur"
    },

    {
        icon: "🤝",
        label: "Coop"
    },

    {
        icon: "📖",
        label: "Narratif"
    }

];


/* =========================================================
   MASCOT MESSAGES
========================================================= */

const heroMessages = [

    "Bienvenue dans ma bibliothèque de jeux !",

    "Tu veux découvrir les jeux qui occupent mes streams ?",

    "Attention, certains jeux ici ont déjà maltraité mes tentacules !",

    "Entre jeux d’horreur, aventures et chaos multijoueur… il y a de quoi faire !",

    "Tu reconnais certains jeux auxquels nous avons joué ensemble ?"

];


/* =========================================================
   MASCOT
========================================================= */

function speakWithMascot() {

    if (
        heroMessages.length === 0
    ) {

        return;

    }


    const randomIndex =
        Math.floor(
            Math.random() *
            heroMessages.length
        );


    const message =
        heroMessages[randomIndex];


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
        class="games-hero"
        aria-labelledby="games-hero-title"
    >

        <!-- =================================================
             BACKGROUND
        ================================================== -->

        <div
            class="games-hero__background"
            aria-hidden="true"
        ></div>


        <div class="games-hero__content">

            <!-- =============================================
                 TEXT
            ============================================== -->

            <div class="games-hero__text">

                <!-- EYEBROW -->

                <p class="games-hero__eyebrow">

                    <span
                        class="games-hero__eyebrow-icon"
                        aria-hidden="true"
                    >
                        🎮
                    </span>

                    <span>
                        LA BIBLIOTHÈQUE DE COUAXIA
                    </span>

                </p>


                <!-- TITLE -->

                <h1
                    id="games-hero-title"
                    class="games-hero__title"
                >
                    Mes
                    <span>
                        jeux
                    </span>
                </h1>


                <!-- DESCRIPTION -->

                <p class="games-hero__description">

                    Retrouve les jeux auxquels je joue
                    actuellement, mes jeux réguliers,
                    les prochaines aventures prévues
                    et celles que nous avons déjà
                    terminées ensemble !

                </p>


                <!-- =========================================
                     TAGS
                ========================================== -->

                <div
                    class="games-hero__tags"
                    aria-label="Mes styles de jeux"
                >

                    <span
                        v-for="tag in gameTags"
                        :key="tag.label"
                        class="games-hero__tag"
                    >

                        <span
                            aria-hidden="true"
                            class="games-hero__tag-icon"
                        >
                            {{ tag.icon }}
                        </span>


                        <span>
                            {{ tag.label }}
                        </span>

                    </span>

                </div>


                <!-- =========================================
                     ACTIONS
                ========================================== -->

                <div class="games-hero__actions">

                    <a
                        href="#games-library"
                        class="
                            games-hero__button
                            games-hero__button--primary
                        "
                        @mouseenter="speakWithMascot"
                        @focus="speakWithMascot"
                    >

                        <span aria-hidden="true">
                            🎮
                        </span>

                        <span>
                            Explorer mes jeux
                        </span>

                        <span
                            class="games-hero__button-arrow"
                            aria-hidden="true"
                        >
                            ↓
                        </span>

                    </a>


                    <RouterLink
                        to="/sondages"
                        class="
                            games-hero__button
                            games-hero__button--secondary
                        "
                    >

                        <span aria-hidden="true">
                            🗳️
                        </span>

                        <span>
                            Sondages
                        </span>

                    </RouterLink>

                </div>

            </div>


            <!-- =============================================
                 VISUAL
            ============================================== -->

            <div
                class="games-hero__visual"
                @mouseenter="speakWithMascot"
            >

                <!-- GLOW -->

                <div
                    class="games-hero__glow"
                    aria-hidden="true"
                ></div>


                <!-- DECORATIONS -->

                <span
                    class="
                        games-hero__decoration
                        games-hero__decoration--one
                    "
                    aria-hidden="true"
                >
                    ✦
                </span>


                <span
                    class="
                        games-hero__decoration
                        games-hero__decoration--two
                    "
                    aria-hidden="true"
                >
                    ✦
                </span>


                <span
                    class="
                        games-hero__decoration
                        games-hero__decoration--three
                    "
                    aria-hidden="true"
                >
                    🎮
                </span>


                <!-- IMAGE -->

                <img
                    :src="heroImage"
                    alt="Couaxia dans son univers gaming"
                    class="games-hero__image"
                >

            </div>

        </div>


        <!-- =================================================
             SCROLL INDICATOR
        ================================================== -->

        <a
            href="#games-library"
            class="games-hero__scroll"
            aria-label="Découvrir les jeux"
        >

            <span>
                Découvrir
            </span>


            <span
                class="games-hero__scroll-arrow"
                aria-hidden="true"
            >
                ↓
            </span>

        </a>

    </section>

</template>