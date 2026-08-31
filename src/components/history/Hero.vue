<script setup lang="ts">

import {
    onBeforeUnmount
} from "vue";


/* =========================================================
   HERO IMAGE
========================================================= */

const heroImage =
    "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/artworks/Couaxia/forme-3/Fullbody_transparent.png";


/* =========================================================
   TYPES
========================================================= */

interface HistoryTag {

    icon:
        string;

    label:
        string;

    messages:
        string[];

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
   HERO MESSAGES
========================================================= */

const heroMessages = [

    "Bienvenue dans mon histoire. 🌌",

    "Tout a commencé bien avant mon arrivée sur Terre.",

    "Tu es prêt à découvrir d'où vient Couaxia ? 👀",

    "Saphira, Avadora, Natsu, la Terre... tout commence ici.",

    "Attention, cette histoire contient des tentacules et quelques mauvaises décisions. 🐙",

    "Il est temps d'ouvrir le premier chapitre."

];


/* =========================================================
   IMAGE MESSAGES
========================================================= */

const imageMessages = [

    "Oui, c'est bien moi ! 🐙",

    "Une Kraduk prête à partir à l'aventure.",

    "Tu regardes mon modèle de près ? 👀",

    "Tout ce voyage a commencé avec cette petite tête-là.",

    "Je n'avais aucune idée de tout ce qui m'attendait encore. 🌌"

];


/* =========================================================
   BUTTON MESSAGES
========================================================= */

const startMessages = [

    "Tu veux vraiment commencer l'histoire ? 📖",

    "Direction Saphira ! 🌌",

    "Prépare-toi, l'aventure commence maintenant.",

    "On remonte jusqu'au tout début !",

    "Allez, ouvre le premier chapitre. 👀",

    "Tu es prêt à découvrir comment tout a commencé ?"

];


/* =========================================================
   TAGS
========================================================= */

const historyTags:
    HistoryTag[] = [

        {
            icon:
                "🌌",

            label:
                "Saphira",

            messages: [

                "Saphira... ma planète d'origine. 🌌",

                "C'est ici que mon histoire commence.",

                "Les Kraduks viennent de Saphira.",

                "La Terre est très différente de chez moi. 👀"

            ]
        },


        {
            icon:
                "🐙",

            label:
                "Kraduks",

            messages: [

                "Les Kraduks, c'est mon peuple ! 🐙",

                "Oui, les tentacules font partie du package.",

                "Tu vas encore beaucoup entendre parler des Kraduks.",

                "Mon peuple possède quelques particularités... intéressantes. 👀"

            ]
        },


        {
            icon:
                "🚀",

            label:
                "Avadora",

            messages: [

                "Avadora ! Mon fidèle vaisseau. 🚀",

                "Sans Avadora, le voyage aurait été légèrement compliqué.",

                "Cinq années dans l'espace, ça crée quelques souvenirs.",

                "Avadora a vu passer beaucoup trop de mes aventures."

            ]
        },


        {
            icon:
                "🐉",

            label:
                "Natsu",

            messages: [

                "Natsu ! 🐉💜",

                "Notre première rencontre était... particulière.",

                "Oui, un dragon-requin. C'est parfaitement normal.",

                "Natsu va prendre une place très importante dans mon histoire."

            ]
        },


        {
            icon:
                "🌍",

            label:
                "Terre",

            messages: [

                "Et finalement... la Terre ! 🌍",

                "Votre planète est vraiment étrange. 👀",

                "Mon arrivée sur Terre n'était que le début d'un nouveau chapitre.",

                "Entre les humains et le monde magique, je n'ai pas eu le temps de m'ennuyer."

            ]
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
        class="history-hero"
        aria-labelledby="history-hero-title"

        @mouseenter="
            startMascotHover(
                heroMessages
            )
        "

        @mouseleave="
            stopMascotHover
        "
    >

        <!-- =================================================
             BACKGROUND
        ================================================== -->

        <div
            class="history-hero__background"
            aria-hidden="true"
        ></div>


        <!-- =================================================
             DECORATIONS
        ================================================== -->

        <span
            class="
                history-hero__decoration
                history-hero__decoration--one
            "
            aria-hidden="true"
        >
            ✦
        </span>


        <span
            class="
                history-hero__decoration
                history-hero__decoration--two
            "
            aria-hidden="true"
        >
            ✦
        </span>


        <span
            class="
                history-hero__decoration
                history-hero__decoration--three
            "
            aria-hidden="true"
        >
            🌌
        </span>


        <!-- =================================================
             CONTENT
        ================================================== -->

        <div class="history-hero__content">

            <!-- =============================================
                 TEXT
            ============================================== -->

            <div class="history-hero__text">

                <!-- =========================================
                     EYEBROW
                ========================================== -->

                <p class="history-hero__eyebrow">

                    <span
                        aria-hidden="true"
                        class="history-hero__eyebrow-icon"
                    >
                        📖
                    </span>


                    <span>
                        LE LORE DE COUAXIA
                    </span>

                </p>


                <!-- =========================================
                     TITLE
                ========================================== -->

                <h1
                    id="history-hero-title"
                    class="history-hero__title"
                >

                    L’histoire de

                    <span>
                        Couaxia
                    </span>

                </h1>


                <!-- =========================================
                     DESCRIPTION
                ========================================== -->

                <p class="history-hero__description">

                    Bien avant Twitch et bien avant mon arrivée
                    sur Terre, mon aventure a commencé très loin
                    d’ici, sur une planète appelée Saphira.

                </p>


                <p class="history-hero__description">

                    Entre voyages spatiaux, rencontres inattendues,
                    créatures fantastiques et secrets encore enfouis,
                    découvre peu à peu l’univers qui se cache derrière
                    Couaxia.

                </p>


                <!-- =========================================
                     TAGS
                ========================================== -->

                <div
                    class="history-hero__tags"
                    aria-label="Éléments principaux de l'histoire"
                >

                    <span
                        v-for="tag in historyTags"

                        :key="
                            tag.label
                        "

                        class="
                            history-hero__tag
                        "

                        tabindex="0"

                        @mouseenter.stop="
                            startMascotHover(
                                tag.messages
                            )
                        "

                        @mouseleave.stop="
                            stopMascotHover
                        "

                        @focus.stop="
                            startMascotHover(
                                tag.messages
                            )
                        "

                        @blur.stop="
                            stopMascotHover
                        "
                    >

                        <span
                            class="
                                history-hero__tag-icon
                            "
                            aria-hidden="true"
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

                <div class="history-hero__actions">

                    <a
                        href="#history-timeline"

                        class="
                            history-hero__button
                            history-hero__button--primary
                        "

                        @mouseenter.stop="
                            startMascotHover(
                                startMessages
                            )
                        "

                        @mouseleave.stop="
                            stopMascotHover
                        "

                        @focus.stop="
                            startMascotHover(
                                startMessages
                            )
                        "

                        @blur.stop="
                            stopMascotHover
                        "
                    >

                        <span
                            aria-hidden="true"
                            class="
                                history-hero__button-icon
                            "
                        >
                            📖
                        </span>


                        <span>
                            Commencer l’histoire
                        </span>


                        <span
                            aria-hidden="true"
                            class="
                                history-hero__button-arrow
                            "
                        >
                            ↓
                        </span>

                    </a>

                </div>

            </div>


            <!-- =============================================
                 VISUAL
            ============================================== -->

            <div
                class="
                    history-hero__visual
                "

                tabindex="0"

                @mouseenter.stop="
                    startMascotHover(
                        imageMessages
                    )
                "

                @mouseleave.stop="
                    stopMascotHover
                "

                @focus.stop="
                    startMascotHover(
                        imageMessages
                    )
                "

                @blur.stop="
                    stopMascotHover
                "
            >

                <!-- GLOW -->

                <div
                    class="
                        history-hero__glow
                    "
                    aria-hidden="true"
                ></div>


                <!-- IMAGE -->

                <img
                    :src="
                        heroImage
                    "

                    alt="
                        Couaxia, Kraduk originaire de Saphira
                    "

                    class="
                        history-hero__image
                    "
                >

            </div>

        </div>


        <!-- =================================================
             SCROLL INDICATOR
        ================================================== -->

        <a
            href="#history-timeline"

            class="
                history-hero__scroll
            "

            aria-label="
                Commencer l'histoire de Couaxia
            "

            @mouseenter.stop="
                startMascotHover(
                    startMessages
                )
            "

            @mouseleave.stop="
                stopMascotHover
            "

            @focus.stop="
                startMascotHover(
                    startMessages
                )
            "

            @blur.stop="
                stopMascotHover
            "
        >

            <span>
                Commencer
            </span>


            <span
                class="
                    history-hero__scroll-arrow
                "
                aria-hidden="true"
            >
                ↓
            </span>

        </a>

    </section>

</template>