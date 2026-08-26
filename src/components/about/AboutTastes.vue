<script setup lang="ts">

/* =========================================================
   CE QUE J'AIME
========================================================= */
const likes = [

    {
        icon: "🎮",
        text: "Les jeux vidéo et les jeux en coopération"
    },

    {
        icon: "🐙",
        text: "Les poulpes et les créatures fantastiques"
    },

    {
        icon: "🦄",
        text: "Les couleurs rose, violet et bleu"
    },

    {
        icon: "🌌",
        text: "Les univers fantastiques et la science-fiction"
    },

    {
        icon: "🐙",
        text: "Mes femmes 💜"
    },

    {
        icon: "🎨",
        text: "Le dessin, la création et le développement"
    },

    {
        icon: "💬",
        text: "Passer du temps avec ma communauté"
    },

    {
        icon: "🐙",
        text: "Ma sœur Hylda et son amie Cita"
    },

    {
        icon: "🐉",
        text: "Natsu, évidemment"
    }

];


const dislikes = [

    {
        icon: "😡",
        text: "La toxicité et le manque de respect"
    },

    {
        icon: "🤐",
        text: "Les spoilers sans avertissement"
    },

    {
        icon: "💔",
        text: "Les bugs qui arrivent en plein live !"
    },

    {
        icon: "🗣️",
        text: "Les personnes qui parlent uniquement pour rabaisser"
    },

    {
        icon: "💔",
        text: "Voir une communauté se disputer"
    },

    {
        icon: "👻",
        text: "Les jumpscares auxquels je ne suis jamais préparée"
    }, 

    {
    icon: "🌶️",
    text: "Les plats trop épicés"
    }, 

    {
    icon: "⏰",
    text: "Être en retard"
    },

    {
    icon: "🥶",
    text: "Avoir froid"
    }
];

</script>


<template>

    <section
        class="about-tastes"
        aria-labelledby="about-tastes-title"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header class="about-tastes__header">

            <p class="about-tastes__eyebrow">
                MES GOÛTS
            </p>


            <h2
                id="about-tastes-title"
                class="about-tastes__title"
            >
                Ce que j’aime...
                <span>
                    et un peu moins
                </span>
            </h2>


            <p class="about-tastes__description">
                Quelques indices supplémentaires pour
                découvrir ce qui peut facilement me rendre
                heureuse... ou me faire fuir très loin.
            </p>

        </header>


        <!-- =================================================
             COLUMNS
        ================================================== -->

        <div class="about-tastes__grid">

            <!-- =============================================
                 LIKES
            ============================================== -->

            <article
                class="
                    about-tastes-card
                    about-tastes-card--likes
                "
            >

                <header class="about-tastes-card__header">

                    <div
                        class="
                            about-tastes-card__symbol
                            about-tastes-card__symbol--likes
                        "
                        aria-hidden="true"
                    >
                        ♥
                    </div>


                    <div>

                        <p class="about-tastes-card__eyebrow">
                            LES BONNES CHOSES
                        </p>


                        <h3 class="about-tastes-card__title">
                            Ce que j’aime
                        </h3>

                    </div>

                </header>


                <ul class="about-tastes-card__list">

                    <li
                        v-for="item in likes"
                        :key="item.text"
                        class="about-tastes-card__item"
                    >

                        <span
                            class="about-tastes-card__icon"
                            aria-hidden="true"
                        >
                            {{ item.icon }}
                        </span>


                        <span class="about-tastes-card__text">
                            {{ item.text }}
                        </span>

                    </li>

                </ul>

            </article>


            <!-- =============================================
                 DISLIKES
            ============================================== -->

            <article
                class="
                    about-tastes-card
                    about-tastes-card--dislikes
                "
            >

                <header class="about-tastes-card__header">

                    <div
                        class="
                            about-tastes-card__symbol
                            about-tastes-card__symbol--dislikes
                        "
                        aria-hidden="true"
                    >
                        ✕
                    </div>


                    <div>

                        <p class="about-tastes-card__eyebrow">
                            UN PEU MOINS...
                        </p>


                        <h3 class="about-tastes-card__title">
                            Ce que je n’aime pas
                        </h3>

                    </div>

                </header>


                <ul class="about-tastes-card__list">

                    <li
                        v-for="item in dislikes"
                        :key="item.text"
                        class="about-tastes-card__item"
                    >

                        <span
                            class="about-tastes-card__icon"
                            aria-hidden="true"
                        >
                            {{ item.icon }}
                        </span>


                        <span class="about-tastes-card__text">
                            {{ item.text }}
                        </span>

                    </li>

                </ul>

            </article>

        </div>

    </section>

</template>