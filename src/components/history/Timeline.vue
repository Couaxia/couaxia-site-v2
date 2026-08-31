<script setup lang="ts">

import {
    onBeforeUnmount
} from "vue";


/* =========================================================
   TYPES
========================================================= */

interface TimelineStep {

    id:
        string;

    number:
        string;

    icon:
        string;

    title:
        string;

    subtitle:
        string;

    description:
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
            Math.random()
            *
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
   START MASCOT HOVER
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
   STOP MASCOT HOVER
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
   TIMELINE MESSAGES
========================================================= */

const timelineMessages = [

    "Voici les grandes étapes de mon voyage. 🌌",

    "Et dire que tout a commencé sur Saphira...",

    "Ça en fait du chemin pour arriver jusqu'à Twitch ! 🐙",

    "Certaines étapes ont été beaucoup plus mouvementées que d'autres. 👀",

    "Tu veux un résumé avant d'ouvrir le livre ? Tu es au bon endroit !"

];


/* =========================================================
   BOOK BUTTON MESSAGES
========================================================= */

const bookMessages = [

    "Tu veux connaître tous les détails maintenant ? 📖",

    "Le résumé est terminé... place à la vraie histoire !",

    "Prépare-toi à tourner quelques pages. 👀",

    "Direction le livre de Couaxia !",

    "Les chapitres t'attendent juste en dessous. ✨"

];


/* =========================================================
   TIMELINE
========================================================= */

const timelineSteps:
    TimelineStep[] = [

        /* =====================================================
           SAPHIRA
        ===================================================== */

        {
            id:
                "saphira",

            number:
                "01",

            icon:
                "🌌",

            title:
                "Saphira",

            subtitle:
                "Là où tout commence",

            description:
                "Couaxia naît sur Saphira, planète d'origine des Kraduks. Bien avant de connaître la Terre, son regard est déjà tourné vers les étoiles.",

            messages: [

                "Saphira... ma planète natale. 🌌",

                "C'est ici que tout a réellement commencé.",

                "Les Kraduks viennent de Saphira ! 🐙",

                "À cette époque, la Terre était encore très loin de mes pensées.",

                "Un petit bout de Saphira me manque parfois. 💜"

            ]
        },


        /* =====================================================
           PILOTE
        ===================================================== */

        {
            id:
                "pilot",

            number:
                "02",

            icon:
                "🛩️",

            title:
                "Formation de pilote",

            subtitle:
                "À partir de 10 ans",

            description:
                "Très jeune, Couaxia commence à apprendre le pilotage et se prépare pendant de longues années à parcourir l'espace.",

            messages: [

                "J'ai commencé ma formation de pilote à 10 ans !",

                "Il fallait bien apprendre avant de traverser l'espace. 🚀",

                "Des années d'entraînement pour enfin partir à l'aventure !",

                "Piloter paraît beaucoup plus simple quand on regarde quelqu'un d'autre le faire. 👀",

                "Toutes ces années de formation ont fini par servir !"

            ]
        },


        /* =====================================================
           DEPART
        ===================================================== */

        {
            id:
                "departure",

            number:
                "03",

            icon:
                "🚀",

            title:
                "Le grand départ",

            subtitle:
                "À bord d'Avadora",

            description:
                "À 120 ans, Couaxia quitte finalement Saphira à bord d'Avadora, accompagnée de Hylda et Cita.",

            messages: [

                "120 ans et enfin prête à quitter Saphira ! 🚀",

                "Avadora, Hylda, Cita et moi... quelle équipe !",

                "Je ne savais absolument pas ce qui nous attendait.",

                "Quitter sa planète natale, ça fait quand même quelque chose.",

                "C'est là que l'aventure a vraiment commencé."

            ],

            highlight:
                true
        },


        /* =====================================================
           VOYAGE
        ===================================================== */

        {
            id:
                "journey",

            number:
                "04",

            icon:
                "✨",

            title:
                "Cinq années de voyage",

            subtitle:
                "À travers l'espace",

            description:
                "Avadora traverse l'immensité spatiale pendant cinq années avant que l'équipage n'atteigne son premier nouveau système.",

            messages: [

                "Cinq ans dans l'espace... oui, c'est long. ✨",

                "Heureusement que je n'étais pas seule à bord !",

                "Avadora est devenue une véritable maison pendant le voyage.",

                "L'espace est magnifique... mais vraiment très grand.",

                "Après cinq années, une nouvelle planète est enfin apparue."

            ]
        },


        /* =====================================================
           DRAQUIN
        ===================================================== */

        {
            id:
                "draquin",

            number:
                "05",

            icon:
                "🪐",

            title:
                "Draquin",

            subtitle:
                "Un monde inconnu",

            description:
                "Une planète à l'atmosphère compatible attire l'attention de l'équipage. Couaxia décide de partir l'explorer.",

            messages: [

                "Draquin semblait être une excellente idée au début. 👀",

                "Une atmosphère respirable ? Évidemment que j'allais explorer !",

                "Une nouvelle planète complètement inconnue... impossible de résister.",

                "Je pensais surtout découvrir un nouveau monde.",

                "Je n'avais aucune idée de la rencontre qui m'attendait."

            ]
        },


        /* =====================================================
           NATSU
        ===================================================== */

        {
            id:
                "natsu",

            number:
                "06",

            icon:
                "🐉",

            title:
                "La rencontre avec Natsu",

            subtitle:
                "Dragon, requin... ou les deux ?",

            description:
                "Sur Draquin, Couaxia rencontre une imposante créature mêlant dragon et requin. Une rencontre difficile qui deviendra pourtant essentielle.",

            messages: [

                "NATSU ! 🐉💜",

                "Notre première rencontre était... légèrement dangereuse.",

                "Oui, un dragon-requin. C'est parfaitement normal.",

                "J'ai perdu un tentacule dans cette histoire... détail important. 👀",

                "Après ça, Natsu ne m'a plus vraiment quittée."

            ],

            highlight:
                true
        },


        /* =====================================================
           EARTH
        ===================================================== */

        {
            id:
                "earth",

            number:
                "07",

            icon:
                "🌍",

            title:
                "Direction la Terre",

            subtitle:
                "Une nouvelle destination",

            description:
                "Couaxia poursuit son voyage avec Hylda, Cita et Natsu jusqu'à atteindre une planète bien différente de Saphira : la Terre.",

            messages: [

                "Et finalement... la Terre ! 🌍",

                "Vous avez vraiment une planète étrange.",

                "Après tout ce voyage, on était enfin arrivés quelque part.",

                "Hylda, Cita, Natsu et moi étions prêts pour une nouvelle aventure.",

                "Je pensais découvrir les humains... mais les choses ne se sont pas vraiment passées comme prévu. 👀"

            ]
        },


        /* =====================================================
           MAGIC MARKET
        ===================================================== */

        {
            id:
                "market",

            number:
                "08",

            icon:
                "🔮",

            title:
                "Le marché magique",

            subtitle:
                "Invisible aux humains",

            description:
                "Le premier contact avec la Terre conduit le groupe vers un étrange marché magique, dissimulé aux regards des humains ordinaires.",

            messages: [

                "Un marché magique caché aux humains... rien que ça ! 🔮",

                "Vous aviez ça sur Terre et personne ne m'avait prévenue ?!",

                "Les humains passaient juste à côté sans rien voir. 👀",

                "C'est ici que notre arrivée sur Terre est devenue vraiment intéressante.",

                "La magie terrestre cachait encore beaucoup de surprises."

            ]
        },


        /* =====================================================
           MYO
        ===================================================== */

        {
            id:
                "myo",

            number:
                "09",

            icon:
                "🦌",

            title:
                "La rencontre avec Myo",

            subtitle:
                "Une faunette mystérieuse",

            description:
                "Dans le marché magique, Couaxia rencontre Myo. Une faunette qui semble connaître parfaitement ce monde et qui dissimule bien plus qu'elle ne le laisse paraître.",

            messages: [

                "Et voilà Myo ! 💜",

                "Une faunette parfaitement normale... évidemment. 👀",

                "Je ne savais pas encore qui elle était réellement.",

                "Myo connaît ce royaume beaucoup mieux qu'elle ne le laisse croire.",

                "Cette rencontre ouvre un tout nouveau chapitre de mon aventure."

            ],

            highlight:
                true
        }

    ];


/* =========================================================
   CLEANUP
========================================================= */

onBeforeUnmount(
    () => {

        stopMascotHover();

    }
);

</script>


<template>

    <section
        id="history-timeline"
        class="history-timeline"
        aria-labelledby="history-timeline-title"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header
            class="history-timeline__header"

            tabindex="0"

            @mouseenter="
                startMascotHover(
                    timelineMessages
                )
            "

            @mouseleave="
                stopMascotHover
            "

            @focus="
                startMascotHover(
                    timelineMessages
                )
            "

            @blur="
                stopMascotHover
            "
        >

            <p class="history-timeline__eyebrow">
                LE VOYAGE
            </p>


            <h2
                id="history-timeline-title"
                class="history-timeline__title"
            >

                De Saphira

                <span>
                    jusqu’à la Terre
                </span>

            </h2>


            <p class="history-timeline__description">

                Avant d’entrer dans les différents chapitres,
                voici les grandes étapes qui ont façonné
                l’histoire de Couaxia.

            </p>

        </header>


        <!-- =================================================
             TIMELINE
        ================================================== -->

        <div class="history-timeline__list">

            <article
                v-for="(step, index) in timelineSteps"

                :key="
                    step.id
                "

                class="
                    history-timeline__step
                "

                :class="{
                    'history-timeline__step--reverse':
                        index % 2 !== 0,

                    'history-timeline__step--highlight':
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
                     CARD
                ========================================== -->

                <div class="history-timeline__card">

                    <div class="history-timeline__card-top">

                        <span class="history-timeline__number">
                            {{ step.number }}
                        </span>


                        <span
                            v-if="
                                step.highlight
                            "

                            class="
                                history-timeline__badge
                            "
                        >
                            Étape importante
                        </span>

                    </div>


                    <p class="history-timeline__subtitle">
                        {{ step.subtitle }}
                    </p>


                    <h3 class="history-timeline__step-title">
                        {{ step.title }}
                    </h3>


                    <p class="history-timeline__step-description">
                        {{ step.description }}
                    </p>

                </div>


                <!-- =========================================
                     TRACK
                ========================================== -->

                <div class="history-timeline__track">

                    <div
                        class="
                            history-timeline__marker
                        "

                        :class="{
                            'history-timeline__marker--highlight':
                                step.highlight
                        }"
                    >
                        <span aria-hidden="true">
                            {{ step.icon }}
                        </span>
                    </div>


                    <div
                        v-if="
                            index <
                            timelineSteps.length - 1
                        "

                        class="
                            history-timeline__line
                        "

                        aria-hidden="true"
                    ></div>

                </div>


                <!-- =========================================
                     EMPTY SIDE
                ========================================== -->

                <div
                    class="
                        history-timeline__empty
                    "

                    aria-hidden="true"
                ></div>

            </article>

        </div>


        <!-- =================================================
             END
        ================================================== -->

        <div class="history-timeline__ending">

            <div
                class="history-timeline__ending-icon"
                aria-hidden="true"
            >
                📖
            </div>


            <div>

                <span class="history-timeline__ending-eyebrow">
                    LE VOYAGE NE FAIT QUE COMMENCER
                </span>


                <h3>
                    Envie de connaître toute l’histoire ?
                </h3>


                <p>

                    La chronologie ne montre que les grandes étapes.
                    Tourne maintenant les pages du livre pour
                    découvrir les événements dans leur intégralité.

                </p>

            </div>


            <a
                href="#history-book"

                class="
                    history-timeline__button
                "

                @mouseenter="
                    startMascotHover(
                        bookMessages
                    )
                "

                @mouseleave="
                    stopMascotHover
                "

                @focus="
                    startMascotHover(
                        bookMessages
                    )
                "

                @blur="
                    stopMascotHover
                "
            >

                <span aria-hidden="true">
                    📖
                </span>


                <span>
                    Ouvrir le livre
                </span>


                <span aria-hidden="true">
                    ↓
                </span>

            </a>

        </div>

    </section>

</template>