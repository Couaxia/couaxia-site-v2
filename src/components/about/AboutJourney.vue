<script setup lang="ts">

/* =========================================================
   TYPES
========================================================= */

interface JourneyStep {
    date: string;
    title: string;
    description: string;
    icon: string;
    highlight?: boolean;
}


/* =========================================================
   JOURNEY
========================================================= */

const journeySteps: JourneyStep[] = [

    {
        date:
            "20 mai 2025",

        title:
            "Affiliation Twitch",

        description:
            "Une première grande étape : la chaîne devient affiliée Twitch et l’aventure commence à prendre une nouvelle dimension.",

        icon:
            "💜"
    },

    {
        date:
            "2 juin 2025",

        title:
            "Début du VTubing",

        description:
            "Couaxia prend officiellement vie en tant que VTubeuse et commence à développer son univers, son identité et sa communauté.",

        icon:
            "🐙"
    },

    {
        date:
            "Juin 2025",

        title:
            "250 followers",

        description:
            "Premier grand palier atteint avec 250 personnes ayant rejoint l’aventure sur Twitch.",

        icon:
            "✨"
    },

    {
        date:
            "Décembre 2025",

        title:
            "500 followers",

        description:
            "La communauté continue de grandir et franchit la barre symbolique des 500 followers.",

        icon:
            "🎉"
    },

    {
        date:
            "Avril 2026",

        title:
            "750 followers",

        description:
            "Un nouveau cap est franchi avec 750 followers et toujours plus de moments partagés en stream.",

        icon:
            "💫"
    },

    {
        date:
            "Août 2026",

        title:
            "900 followers",

        description:
            "La communauté atteint les 900 followers et se rapproche doucement du prochain grand objectif.",

        icon:
            "🦈"
    },

    {
        date:
            "Prochain objectif",

        title:
            "1 000 followers",

        description:
            "La prochaine grande étape de l’aventure : atteindre ensemble les 1 000 followers sur Twitch.",

        icon:
            "⭐",

        highlight:
            true
    }

];

</script>


<template>

    <section
        class="about-journey"
        aria-labelledby="about-journey-title"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header class="about-journey__header">

            <p class="about-journey__eyebrow">
                MON PARCOURS
            </p>


            <h2
                id="about-journey-title"
                class="about-journey__title"
            >
                L’aventure jusqu’ici
            </h2>


            <p class="about-journey__description">
                Des premiers streams aux différents paliers
                de la communauté, voici quelques moments
                importants de mon aventure.
            </p>

        </header>


        <!-- =================================================
             TIMELINE
        ================================================== -->

        <div class="about-journey__timeline">

            <article
                v-for="(step, index) in journeySteps"
                :key="`${step.date}-${step.title}`"
                class="about-journey__step"
                :class="{
                    'about-journey__step--highlight':
                        step.highlight
                }"
            >

                <!-- =========================================
                     TIMELINE MARKER
                ========================================== -->

                <div class="about-journey__track">

                    <div
                        class="about-journey__marker"
                        :class="{
                            'about-journey__marker--highlight':
                                step.highlight
                        }"
                    >

                        <span aria-hidden="true">
                            {{ step.icon }}
                        </span>

                    </div>


                    <div
                        v-if="index < journeySteps.length - 1"
                        class="about-journey__line"
                        aria-hidden="true"
                    ></div>

                </div>


                <!-- =========================================
                     CARD
                ========================================== -->

                <div class="about-journey__card">

                    <div class="about-journey__card-header">

                        <span class="about-journey__date">
                            {{ step.date }}
                        </span>


                        <span
                            v-if="step.highlight"
                            class="about-journey__badge"
                        >
                            Prochain objectif
                        </span>

                    </div>


                    <h3 class="about-journey__step-title">
                        {{ step.title }}
                    </h3>


                    <p class="about-journey__step-description">
                        {{ step.description }}
                    </p>

                </div>

            </article>

        </div>


        <!-- =================================================
             END MESSAGE
        ================================================== -->

        <div class="about-journey__ending">

            <span
                class="about-journey__ending-icon"
                aria-hidden="true"
            >
                🐙
            </span>


            <div>

                <strong>
                    Et l’histoire continue...
                </strong>


                <p>
                    De nouveaux souvenirs, de nouveaux projets
                    et sûrement encore beaucoup de chaos
                    nous attendent !
                </p>

            </div>

        </div>

    </section>

</template>