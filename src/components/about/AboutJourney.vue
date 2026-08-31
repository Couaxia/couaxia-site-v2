<script setup lang="ts">

/* =========================================================
   TYPES
========================================================= */

interface JourneyStep {

    date:
        string;

    title:
        string;

    description:
        string;

    icon:
        string;

    messages:
        string[];

    highlight?:
        boolean;

}


/* =========================================================
   MASCOT TIMER
========================================================= */

let mascotHoverTimer:
    number | null =
        null;


/* =========================================================
   RANDOM MESSAGE
========================================================= */

function getRandomMessage(
    messages:
        string[]
):
    string {

    if (
        !messages
        ||
        messages.length === 0
    ) {

        return "";

    }


    const randomIndex =
        Math.floor(
            Math.random() *
            messages.length
        );


    return (
        messages[randomIndex]
        ??
        ""
    );

}


/* =========================================================
   SEND MASCOT MESSAGE
========================================================= */

function sendMascotMessage(
    message:
        string
) {

    if (
        !message.trim()
    ) {

        return;

    }


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


/* =========================================================
   START HOVER
========================================================= */

function startMascotHover(
    messages:
        string[]
) {

    stopMascotHover();


    mascotHoverTimer =
        window.setTimeout(
            () => {

                sendMascotMessage(
                    getRandomMessage(
                        messages
                    )
                );


                mascotHoverTimer =
                    null;

            },
            400
        );

}


/* =========================================================
   STOP HOVER
========================================================= */

function stopMascotHover() {

    if (
        mascotHoverTimer ===
        null
    ) {

        return;

    }


    window.clearTimeout(
        mascotHoverTimer
    );


    mascotHoverTimer =
        null;

}


/* =========================================================
   JOURNEY
========================================================= */

const journeySteps:
    JourneyStep[] = [

        /* =====================================================
           TWITCH AFFILIATE
        ===================================================== */

        {
            date:
                "20 mai 2025",

            title:
                "Affiliation Twitch",

            description:
                "Une première grande étape : la chaîne devient affiliée Twitch et l’aventure commence à prendre une nouvelle dimension.",

            icon:
                "💜",

            messages: [

                "Le 20 mai 2025... une date que je n'oublierai pas ! 💜",

                "C'est là que Twitch m'a officiellement donné mon petit badge d'affiliée !",

                "Une des premières grandes étapes de l'aventure !",

                "Je crois que j'étais légèrement trop heureuse ce jour-là. 👀"

            ]
        },


        /* =====================================================
           VTUBING
        ===================================================== */

        {
            date:
                "2 juin 2025",

            title:
                "Début du VTubing",

            description:
                "Couaxia prend officiellement vie en tant que VTubeuse et commence à développer son univers, son identité et sa communauté.",

            icon:
                "🐙",

            messages: [

                "Et voilà le vrai début de Couaxia en VTubing ! 🐙",

                "Le 2 juin 2025, les tentacules ont officiellement envahi Twitch !",

                "C'est ici que mon aventure de VTubeuse a vraiment commencé. 💜",

                "Mon modèle était prêt... le chaos pouvait commencer !"

            ]
        },


        /* =====================================================
           250
        ===================================================== */

        {
            date:
                "Juin 2025",

            title:
                "250 followers",

            description:
                "Premier grand palier atteint avec 250 personnes ayant rejoint l’aventure sur Twitch.",

            icon:
                "✨",

            messages: [

                "250 Poups ! Déjà ! ✨",

                "Le premier gros palier de la communauté !",

                "Je me souviens encore du moment où nous avons atteint les 250 ! 💜",

                "Et dire que ce n'était que le début..."

            ]
        },


        /* =====================================================
           500
        ===================================================== */

        {
            date:
                "Décembre 2025",

            title:
                "500 followers",

            description:
                "La communauté continue de grandir et franchit la barre symbolique des 500 followers.",

            icon:
                "🎉",

            messages: [

                "500 followers ! La moitié de 1 000 ! 🎉",

                "Vous étiez déjà beaucoup trop nombreux à supporter mes bêtises. 👀",

                "500 Poups réunis autour d'une Kraduk chaotique... quelle idée !",

                "Ce palier m'a fait énormément plaisir. 💜"

            ]
        },


        /* =====================================================
           750
        ===================================================== */

        {
            date:
                "Avril 2026",

            title:
                "750 followers",

            description:
                "Un nouveau cap est franchi avec 750 followers et toujours plus de moments partagés en stream.",

            icon:
                "💫",

            messages: [

                "750 ! Là, ça commençait vraiment à faire beaucoup de Poups ! 💫",

                "Encore un cap franchi ensemble !",

                "Vous vous êtes multipliés pendant que je ne regardais pas ? 👀",

                "Chaque nouveau palier me rappelle à quel point la communauté a grandi. 💜"

            ]
        },


        /* =====================================================
           900
        ===================================================== */

        {
            date:
                "Août 2026",

            title:
                "900 followers",

            description:
                "La communauté atteint les 900 followers et se rapproche doucement du prochain grand objectif.",

            icon:
                "🦈",

            messages: [

                "900 FOLLOWERS ! 🦈💜",

                "Seulement 100 avant les quatre chiffres... 👀",

                "Les 900 Poups sont officiellement là !",

                "On commence sérieusement à remplir l'Avadora avec tout ce monde ! 🚀",

                "Je crois qu'il va falloir agrandir le vaisseau..."

            ]
        },


        /* =====================================================
           1000
        ===================================================== */

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
                true,

            messages: [

                "1 000 followers... on s'en rapproche ! ⭐",

                "Le prochain objectif est juste là ! 👀",

                "Imagine 1 000 Poups dans le même vaisseau... pauvre Avadora.",

                "Les quatre chiffres ! Ça serait complètement fou ! 💜",

                "On continue l'aventure jusqu'aux 1 000 ! 🐙"

            ]
        }

    ];


/* =========================================================
   ENDING MESSAGES
========================================================= */

const endingMessages = [

    "Et ce n'est que le début ! 🐙",

    "Il reste encore plein de souvenirs à créer ensemble. 💜",

    "Qui sait quelle sera la prochaine étape ? 👀",

    "Nouveaux projets, nouveaux streams et probablement encore beaucoup de chaos !",

    "Merci de faire partie de cette aventure ! 💜",

    "La timeline a encore beaucoup de place pour de nouveaux souvenirs ! ✨"

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

                :key="
                    `${step.date}-${step.title}`
                "

                class="
                    about-journey__step
                "

                :class="{
                    'about-journey__step--highlight':
                        step.highlight
                }"

                tabindex="0"

                @mouseenter="
                    startMascotHover(
                        step.messages
                    )
                "

                @mouseleave="
                    stopMascotHover
                "

                @focus="
                    startMascotHover(
                        step.messages
                    )
                "

                @blur="
                    stopMascotHover
                "
            >

                <!-- =========================================
                     TIMELINE TRACK
                ========================================== -->

                <div class="about-journey__track">

                    <!-- =====================================
                         MARKER
                    ====================================== -->

                    <div
                        class="
                            about-journey__marker
                        "

                        :class="{
                            'about-journey__marker--highlight':
                                step.highlight
                        }"
                    >

                        <span aria-hidden="true">
                            {{ step.icon }}
                        </span>

                    </div>


                    <!-- =====================================
                         LINE
                    ====================================== -->

                    <div
                        v-if="
                            index <
                            journeySteps.length - 1
                        "

                        class="
                            about-journey__line
                        "

                        aria-hidden="true"
                    ></div>

                </div>


                <!-- =========================================
                     CARD
                ========================================== -->

                <div
                    class="
                        about-journey__card
                    "
                >

                    <!-- =====================================
                         CARD HEADER
                    ====================================== -->

                    <div
                        class="
                            about-journey__card-header
                        "
                    >

                        <span
                            class="
                                about-journey__date
                            "
                        >
                            {{ step.date }}
                        </span>


                        <span
                            v-if="
                                step.highlight
                            "

                            class="
                                about-journey__badge
                            "
                        >
                            Prochain objectif
                        </span>

                    </div>


                    <!-- =====================================
                         TITLE
                    ====================================== -->

                    <h3
                        class="
                            about-journey__step-title
                        "
                    >
                        {{ step.title }}
                    </h3>


                    <!-- =====================================
                         DESCRIPTION
                    ====================================== -->

                    <p
                        class="
                            about-journey__step-description
                        "
                    >
                        {{ step.description }}
                    </p>

                </div>

            </article>

        </div>


        <!-- =================================================
             END MESSAGE
        ================================================== -->

        <div
            class="
                about-journey__ending
            "

            tabindex="0"

            @mouseenter="
                startMascotHover(
                    endingMessages
                )
            "

            @mouseleave="
                stopMascotHover
            "

            @focus="
                startMascotHover(
                    endingMessages
                )
            "

            @blur="
                stopMascotHover
            "
        >

            <span
                class="
                    about-journey__ending-icon
                "

                aria-hidden="true"
            >
                🐙
            </span>


            <div>

                <strong>
                    Et l’histoire continue...
                </strong>


                <p>

                    De nouveaux souvenirs,
                    de nouveaux projets
                    et sûrement encore beaucoup
                    de chaos nous attendent !

                </p>

            </div>

        </div>

    </section>

</template>