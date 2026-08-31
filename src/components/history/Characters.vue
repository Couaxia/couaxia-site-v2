<script setup lang="ts">

import {
    onBeforeUnmount
} from "vue";


/* =========================================================
   TYPES
========================================================= */

interface HistoryCharacter {

    id:
        string;

    name:
        string;

    role:
        string;

    icon:
        string;

    description:
        string;

    details:
        string[];

    image?:
        string;

    imageAlt?:
        string;

    tags:
        string[];

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
   SECTION MESSAGES
========================================================= */

const sectionMessages = [

    "Voici quelques-uns des personnages importants de mon histoire. 💜",

    "Sans eux, mon voyage aurait été très différent.",

    "Une Kraduk, une sœur, une amie, un dragon-requin et une faunette... équipe parfaitement normale. 👀",

    "Tu vas retrouver ces personnages tout au long de mon histoire.",

    "Certains étaient là depuis le début... d'autres sont arrivés un peu plus tard.",

    "Mon aventure est surtout faite des personnes rencontrées en chemin."

];


/* =========================================================
   CHARACTERS
========================================================= */

const characters:
    HistoryCharacter[] = [

        /* =====================================================
           COUAXIA
        ===================================================== */

        {
            id:
                "couaxia",

            name:
                "Couaxia",

            role:
                "Kraduk • Pilote • Voyageuse",

            icon:
                "🐙",

            description:
                "Originaire de Saphira, Couaxia est une Kraduk passionnée par l’espace, l’exploration et les mondes inconnus.",

            details: [

                "Elle commence sa formation de pilote dès l’âge de 10 ans.",

                "À 120 ans, elle quitte Saphira à bord d’Avadora.",

                "Son voyage la conduira notamment sur Draquin puis jusqu’à la Terre."

            ],

            image:
                "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/characters/couaxia.png",

            imageAlt:
                "Couaxia",

            tags: [
                "Kraduk",
                "Saphira",
                "Pilote",
                "Exploratrice"
            ],

            messages: [

                "Oui, c'est encore moi ! 🐙",

                "La protagoniste de cette histoire, accessoirement.",

                "Tout ce voyage est parti d'une simple envie de découvrir l'espace.",

                "Je crois que ma curiosité m'a légèrement menée loin de Saphira. 👀",

                "Et dire que tout a commencé avec une formation de pilote..."

            ],

            highlight:
                true
        },


        /* =====================================================
           HYLDA
        ===================================================== */

        {
            id:
                "hylda",

            name:
                "Hylda",

            role:
                "Kraduk • Sœur de Couaxia",

            icon:
                "💜",

            description:
                "Hylda est la sœur de Couaxia et fait partie du voyage depuis le départ de Saphira.",

            details: [

                "Elle accompagne Couaxia à bord d’Avadora.",

                "Elle traverse avec elle les cinq années de voyage jusqu’au premier nouveau système.",

                "Elle reste présente lors de la poursuite du voyage jusqu’à la Terre."

            ],

            image:
                "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/characters/hylda.png",

            imageAlt:
                "Hylda",

            tags: [
                "Kraduk",
                "Sœur",
                "Avadora",
                "Saphira"
            ],

            messages: [

                "Hylda, ma sœur ! 💜",

                "Elle était là dès le début du voyage.",

                "Cinq années dans Avadora avec sa sœur... elle mérite probablement une médaille. 😂",

                "Heureusement que Hylda était là pendant toutes ces années dans l'espace.",

                "On a quitté Saphira ensemble."

            ]
        },


        /* =====================================================
           CITA
        ===================================================== */

        {
            id:
                "cita",

            name:
                "Cita",

            role:
                "Compagne de voyage",

            icon:
                "✨",

            description:
                "Cita accompagne Couaxia et Hylda lors de leur départ de Saphira et partage avec elles le voyage à bord d’Avadora.",

            details: [

                "Elle fait partie de l’équipage dès le grand départ.",

                "Elle traverse l’espace aux côtés de Couaxia et Hylda.",

                "Elle poursuit également le voyage jusqu’à l’arrivée sur Terre."

            ],

            image:
                "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/characters/Cita.png",

            imageAlt:
                "Cita",

            tags: [
                "Avadora",
                "Voyage",
                "Saphira",
                "Équipage"
            ],

            messages: [

                "Cita faisait elle aussi partie du voyage depuis le départ ! ✨",

                "Avadora aurait été beaucoup plus silencieuse sans elle.",

                "Elle a supporté cinq ans de voyage spatial avec nous... respect. 😂",

                "Cita fait partie de cette aventure depuis Saphira.",

                "Notre petit équipage était déjà bien formé avant même de rencontrer Natsu."

            ]
        },

        /* =====================================================
           AVADORA
        ===================================================== */

        {
            id:
                "avadora",

            name:
                "Avadora",

            role:
                "Vaisseau spatial • Exploration",

            icon:
                "🛸",

            description:
                "Avadora est le vaisseau spatial de Couaxia et de son équipage. Il leur permet de voyager à travers l’univers et d’explorer de nouveaux mondes.",

            details: [

                "Avadora est originaire de Saphira.",

                "Le vaisseau accompagne Couaxia, Hylda et Cita dès leur grand départ.",

                "Il est équipé d’un système de camouflage et de technologies avancées adaptées à l’exploration spatiale.",

                "Avadora sert à la fois de moyen de transport et de véritable base de vie pendant les longs voyages."

            ],

            image:
                "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/characters/avadora.png",

            imageAlt:
                "Avadora, le vaisseau spatial de Couaxia",

            tags: [
                "Vaisseau spatial",
                "Saphira",
                "Exploration",
                "Camouflage",
                "Technologie"
            ],

            messages: [

                "Avadora ! Notre maison parmi les étoiles. 🛸",

                "Sans Avadora, aller jusqu'à Draquin aurait été légèrement compliqué. 👀",

                "Cinq années de voyage spatial... heureusement qu'Avadora était confortable !",

                "Avadora possède un système de camouflage très pratique pour l'exploration.",

                "Un vaisseau, une maison et parfois un refuge : Avadora a plusieurs rôles.",

                "Elle nous accompagne depuis notre départ de Saphira. 🚀",

                "Oui, Avadora possède une voix féminine !",

                "Il faut bien quelqu'un pour supporter Couaxia pendant cinq années de voyage. 😂"

            ],

            highlight:
                true
        },

        /* =====================================================
           NATSU
        ===================================================== */

        {
            id:
                "natsu",

            name:
                "Natsu",

            role:
                "Drasquin • Compagnon de Couaxia",

            icon:
                "🐉",

            description:
                "Natsu est une créature rencontrée sur Draquin. Son apparence mêle les caractéristiques d’un requin et d’un dragon.",

            details: [

                "Il possède des écailles noires, des griffes ivoire et des cornes roses.",

                "Ses ailes sont recouvertes d’écailles tranchantes et sa queue est bleue.",

                "Après une rencontre difficile, il finit par faire confiance à Couaxia et décide de la suivre."

            ],

            image:
                "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/characters/natsu.gif",

            imageAlt:
                "Natsu",

            tags: [
                "Drasquin",
                "Draquin",
                "Dragon",
                "Requin"
            ],

            messages: [

                "NATSU ! 🐉💜",

                "Oui, c'est bien un mélange entre un requin et un dragon.",

                "Il avait légèrement envie de me manger au début... détail.",

                "Un tentacule plus tard, on est devenus amis. 👀",

                "Natsu fait partie de mes compagnons les plus importants.",

                "Ses cornes roses sont magnifiques, personne ne me fera changer d'avis."

            ],

            highlight:
                true
        },


        /* =====================================================
           MYO
        ===================================================== */

        {
            id:
                "myo",

            name:
                "Myo",

            role:
                "Faunette • Habitante du monde magique",

            icon:
                "🦌",

            description:
                "Myo est une faunette rencontrée après l’arrivée de Couaxia sur Terre, au cœur d’un marché magique caché aux humains.",

            details: [

                "Elle semble parfaitement connaître le marché et le monde magique.",

                "Elle cache volontairement une partie importante de son identité.",

                "Couaxia découvrira qu’elle est en réalité la propriétaire du royaume magique."

            ],

            image:
                "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/characters/myo.png",

            imageAlt:
                "Myo",


            tags: [
                "Faunette",
                "Terre",
                "Magie",
                "Royaume magique"
            ],

            messages: [

                "Myo ! 💜",

                "Une petite faunette parfaitement innocente... évidemment. 👀",

                "Elle ne m'avait pas exactement tout dit au début.",

                "Imagine rencontrer quelqu'un dans un marché puis découvrir qu'elle possède le royaume entier.",

                "Myo connaît beaucoup de choses sur le monde magique.",

                "Cette rencontre allait avoir beaucoup plus d'importance que prévu."

            ],

            highlight:
                true
        }

    ];


/* =========================================================
   CHARACTER MASCOT
========================================================= */

function speakAboutCharacter(
    character:
        HistoryCharacter
) {

    startMascotHover(
        character.messages
    );

}


/* =========================================================
   TAG MASCOT
========================================================= */

function speakAboutTag(
    character:
        HistoryCharacter,

    tag:
        string
) {

    startMascotHover(
        [

            `${tag} est associé à ${character.name}.`,

            `${character.name} et ${tag}... oui, ça résume plutôt bien une partie de son histoire !`,

            `Tu veux en savoir plus sur ${character.name} ? Continue de lire le livre. 👀`,

            `${tag} fait partie des éléments importants autour de ${character.name}.`

        ]
    );

}


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
        id="history-characters"
        class="history-characters"
        aria-labelledby="history-characters-title"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header
            class="history-characters__header"

            tabindex="0"

            @mouseenter="
                startMascotHover(
                    sectionMessages
                )
            "

            @mouseleave="
                stopMascotHover
            "

            @focus="
                startMascotHover(
                    sectionMessages
                )
            "

            @blur="
                stopMascotHover
            "
        >

            <p class="history-characters__eyebrow">
                LES PERSONNAGES
            </p>


            <h2
                id="history-characters-title"
                class="history-characters__title"
            >

                Ceux qui font partie de

                <span>
                    l’aventure
                </span>

            </h2>


            <p class="history-characters__description">

                Famille, compagnons de voyage et rencontres
                inattendues : découvre quelques-uns des
                personnages importants de l’univers de Couaxia.

            </p>

        </header>


        <!-- =================================================
             GRID
        ================================================== -->

        <div class="history-characters__grid">

            <article
                v-for="character in characters"

                :key="
                    character.id
                "

                class="
                    history-character
                "

                :class="{
                    'history-character--highlight':
                        character.highlight
                }"

                tabindex="0"

                @mouseenter="
                    speakAboutCharacter(
                        character
                    )
                "

                @mouseleave="
                    stopMascotHover
                "

                @focus="
                    speakAboutCharacter(
                        character
                    )
                "

                @blur="
                    stopMascotHover
                "
            >

                <!-- =========================================
                     VISUAL
                ========================================== -->

                <div class="history-character__visual">

                    <div
                        class="history-character__glow"
                        aria-hidden="true"
                    ></div>


                    <!-- IMAGE -->

                    <img
                        v-if="
                            character.image
                        "

                        :src="
                            character.image
                        "

                        :alt="
                            character.imageAlt
                            ??
                            character.name
                        "

                        class="
                            history-character__image
                        "

                        loading="lazy"
                    >


                    <!-- PLACEHOLDER -->

                    <div
                        v-else

                        class="
                            history-character__placeholder
                        "

                        aria-hidden="true"
                    >
                        {{ character.icon }}
                    </div>


                    <!-- IMPORTANT -->

                    <span
                        v-if="
                            character.highlight
                        "

                        class="
                            history-character__badge
                        "
                    >
                        Personnage important
                    </span>

                </div>


                <!-- =========================================
                     CONTENT
                ========================================== -->

                <div class="history-character__content">

                    <!-- ICON / NAME -->

                    <div class="history-character__heading">

                        <span
                            class="
                                history-character__icon
                            "

                            aria-hidden="true"
                        >
                            {{ character.icon }}
                        </span>


                        <div>

                            <h3 class="history-character__name">
                                {{ character.name }}
                            </h3>


                            <span class="history-character__role">
                                {{ character.role }}
                            </span>

                        </div>

                    </div>


                    <!-- DESCRIPTION -->

                    <p class="history-character__description">
                        {{ character.description }}
                    </p>


                    <!-- DETAILS -->

                    <ul class="history-character__details">

                        <li
                            v-for="detail in character.details"

                            :key="
                                detail
                            "
                        >
                            {{ detail }}
                        </li>

                    </ul>


                    <!-- TAGS -->

                    <div class="history-character__tags">

                        <span
                            v-for="tag in character.tags"

                            :key="
                                tag
                            "

                            class="
                                history-character__tag
                            "

                            tabindex="0"

                            @mouseenter.stop="
                                speakAboutTag(
                                    character,
                                    tag
                                )
                            "

                            @mouseleave.stop="
                                stopMascotHover
                            "

                            @focus.stop="
                                speakAboutTag(
                                    character,
                                    tag
                                )
                            "

                            @blur.stop="
                                stopMascotHover
                            "
                        >
                            {{ tag }}
                        </span>

                    </div>

                </div>

            </article>

        </div>


        <!-- =================================================
             END MESSAGE
        ================================================== -->

        <div class="history-characters__ending">

            <span
                class="history-characters__ending-icon"
                aria-hidden="true"
            >
                ✨
            </span>


            <div>

                <strong>
                    Et ce n’est que le début...
                </strong>


                <p>

                    D’autres personnages et créatures
                    apparaîtront au fur et à mesure que
                    l’univers continuera de grandir.

                </p>

            </div>

        </div>

    </section>

</template>