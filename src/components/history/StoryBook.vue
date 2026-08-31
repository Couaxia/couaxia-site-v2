<script setup lang="ts">

import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref
} from "vue";

import Annexes from "./Annexes.vue";

import type {
    StoryAnnexe
} from "./Annexes.vue";


/* =========================================================
   TYPES
========================================================= */

interface StoryPage {

    id:
        string;

    title?:
        string;

    subtitle?:
        string;

    text:
        string[];

    image?:
        string;

    imageAlt?:
        string;

    messages:
        string[];

}


interface StoryChapter {

    id:
        string;

    number:
        number;

    title:
        string;

    subtitle:
        string;

    icon:
        string;

    pages:
        StoryPage[];

    annexes?:
        StoryAnnexe[];

}


/* =========================================================
   STORY
========================================================= */

const chapters:
    StoryChapter[] = [

        /* =====================================================
           CHAPTER 0
        ===================================================== */

        {
            id:
                "departure",

            number:
                0,

            title:
                "Le départ",

            subtitle:
                "Tout commence sur Saphira",

            icon:
                "🚀",

            pages: [

                {
                    id:
                        "departure-1",

                    title:
                        "Saphira",

                    subtitle:
                        "Le monde des Kraduks",

                    text: [

                        "Sur la planète Saphira vit le peuple des Kraduks, une civilisation dont Couaxia fait partie.",

                        "Depuis son enfance, Couaxia est fascinée par l’espace, les étoiles et les mondes encore inconnus.",

                        "À seulement dix ans, elle commence une longue formation de pilote afin de pouvoir un jour quitter Saphira et explorer l’univers.",

                        "Les années passent, mais son envie de voyager ne disparaît jamais."

                    ],

                    image:
                        "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/characters/couaxia.png",

                    imageAlt:
                        "Couaxia",

                    messages: [

                        "Saphira... c’est ici que tout commence. 🌌",

                        "J’étais déjà obsédée par les étoiles quand j’étais petite.",

                        "Dix ans et déjà en formation de pilote !",

                        "Je crois que ma curiosité était déjà légèrement problématique. 👀"

                    ]
                },


                {
                    id:
                        "departure-2",

                    title:
                        "Le grand départ",

                    subtitle:
                        "À bord d’Avadora",

                    text: [

                        "À l’âge de 120 ans, le moment tant attendu arrive enfin.",

                        "Couaxia quitte Saphira à bord d’Avadora, accompagnée de sa sœur Hylda et de Cita.",

                        "Le vaisseau devient rapidement leur maison, leur refuge et leur seul lien avec le monde qu’elles viennent de quitter.",

                        "Derrière elles, Saphira disparaît lentement dans l’immensité de l’espace.",

                        "Devant elles, tout reste encore à découvrir."

                    ],

                    image:
                        "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/characters/avadora.png",

                    imageAlt:
                        "Avadora",

                    messages: [

                        "Et voilà Avadora ! 🛸",

                        "Hylda, Cita et moi étions enfin parties.",

                        "Quitter Saphira après autant d’années... ça fait quelque chose.",

                        "À partir de là, impossible de revenir en arrière."

                    ]
                }

            ]
        },


        /* =====================================================
           CHAPTER 1
        ===================================================== */

        {
            id:
                "natsu",

            number:
                1,

            title:
                "La rencontre avec Natsu",

            subtitle:
                "Draquin",

            icon:
                "🐉",

            pages: [

                {
                    id:
                        "natsu-1",

                    title:
                        "Cinq années plus tard",

                    subtitle:
                        "Un nouveau système",

                    text: [

                        "Avadora voyage pendant cinq longues années à travers l’espace.",

                        "Puis, un jour, les instruments du vaisseau détectent enfin un nouveau système.",

                        "Parmi les mondes présents, une planète attire particulièrement l’attention de l’équipage.",

                        "Son atmosphère semble compatible avec les besoins des Kraduks.",

                        "Couaxia décide alors de descendre à sa surface afin de l’explorer.",

                        "Cette planète porte le nom de Draquin."

                    ],

                    messages: [

                        "Cinq ans dans l’espace... enfin quelque chose !",

                        "Draquin avait l’air plutôt accueillante au début. 👀",

                        "Une planète respirable ? Évidemment que je suis descendue.",

                        "Je ne savais pas encore ce qui m’attendait."

                    ]
                },


                {
                    id:
                        "natsu-2",

                    title:
                        "Une créature inconnue",

                    subtitle:
                        "Le Drasquin",

                    text: [

                        "Au cours de son exploration, Couaxia découvre une imposante créature.",

                        "Son corps est couvert d’écailles noires. Ses griffes sont ivoire, ses cornes roses et ses ailes sont recouvertes d’écailles tranchantes.",

                        "Sa queue, quant à elle, possède une étrange teinte bleue.",

                        "La créature semble posséder à la fois les caractéristiques d’un requin et celles d’un dragon.",

                        "Couaxia vient de rencontrer un Drasquin."

                    ],

                    image:
                        "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/characters/natsu.gif",

                    imageAlt:
                        "Natsu",

                    messages: [

                        "NATSU ! 🐉💜",

                        "Dragon + requin. Excellente combinaison.",

                        "Ses cornes roses sont magnifiques, merci.",

                        "Notre première rencontre était beaucoup moins calme que cette page."

                    ]
                },


                {
                    id:
                        "natsu-3",

                    title:
                        "Gagner sa confiance",

                    subtitle:
                        "Un sacrifice inattendu",

                    text: [

                        "Le Drasquin reste méfiant et refuse de laisser Couaxia s’approcher.",

                        "Pour lui prouver qu’elle ne représente pas une menace, Couaxia décide de lui offrir l’un de ses tentacules.",

                        "Le geste surprend la créature.",

                        "Peu à peu, elle accepte la présence de Couaxia.",

                        "Puis, pour la première fois, elle parvient à prononcer un mot.",

                        "Natsu.",

                        "C’est ainsi que Couaxia découvre son nom.",

                        "À partir de ce moment, Natsu décide de la suivre."

                    ],

                    messages: [

                        "Oui... j’ai vraiment sacrifié un tentacule. 👀",

                        "Il fallait bien lui montrer que je lui faisais confiance.",

                        "Et après ça, Natsu ne m’a plus vraiment quittée.",

                        "Le début d’une amitié parfaitement normale. 🐙🐉"

                    ]
                }

            ],


            /* =================================================
               ANNEXES — CHAPTER 1
            ================================================== */

            annexes: [

                {
                    id:
                        "annexe-draquin",

                    number:
                        "01",

                    title:
                        "Draquin",

                    subtitle:
                        "Informations complémentaires",

                    icon:
                        "🪐",

                    messages: [

                        "Tu veux ouvrir l’annexe de Draquin ? 👀",

                        "Cette annexe contient quelques informations supplémentaires.",

                        "Bienvenue dans les archives de Draquin ! 📖",

                        "On commence à entrer profondément dans le lore.",

                        "Certaines informations n’apparaissent pas directement dans l’histoire principale."

                    ],

                    pages: [

                        {
                            id:
                                "draquin-annexe-1",

                            title:
                                "Draquin",

                            subtitle:
                                "Un monde mystérieux",

                            text: [

                                "Cette annexe est consacrée à Draquin, la première planète explorée par Couaxia après son départ de Saphira.",

                                "Tu pourras ici remettre le texte complet de ton ancienne annexe.",

                                "L’annexe permet d’approfondir certains éléments de l’univers sans interrompre directement le récit principal."

                            ]
                        },


                        {
                            id:
                                "draquin-annexe-2",

                            title:
                                "L’environnement",

                            subtitle:
                                "Une planète inconnue",

                            text: [

                                "Cette seconde page peut accueillir les informations complémentaires sur l’environnement de Draquin.",

                                "Tu peux y parler de son atmosphère, de sa faune, de sa flore ou encore des observations réalisées pendant l’exploration.",

                                "Tu peux ajouter autant de pages que tu veux à l’annexe."

                            ],

                            image:
                                "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/characters/natsu.gif",

                            imageAlt:
                                "Natsu"
                        }

                    ]
                }

            ]
        },


        /* =====================================================
           CHAPTER 2
        ===================================================== */

        {
            id:
                "earth",

            number:
                2,

            title:
                "La Terre",

            subtitle:
                "Un nouveau monde",

            icon:
                "🌍",

            pages: [

                {
                    id:
                        "earth-1",

                    title:
                        "Direction la Terre",

                    subtitle:
                        "Une nouvelle destination",

                    text: [

                        "Après les événements sur Draquin, le voyage continue.",

                        "Couaxia reprend sa route avec Hylda, Cita et désormais Natsu.",

                        "Grâce à sa capacité de compression organique adaptative, Natsu peut réduire considérablement sa taille et voyager plus facilement avec l’équipage.",

                        "Le groupe finit par atteindre une nouvelle planète.",

                        "La Terre."

                    ],

                    messages: [

                        "Et finalement... votre planète ! 🌍",

                        "La Terre est vraiment différente de Saphira.",

                        "Heureusement que Natsu peut réduire sa taille.",

                        "Essayez de faire entrer un Drasquin géant dans un vaisseau sans cette capacité. 👀"

                    ]
                },


                {
                    id:
                        "earth-2",

                    title:
                        "Le marché magique",

                    subtitle:
                        "Invisible aux humains",

                    text: [

                        "Le premier contact de Couaxia avec la Terre ne se déroule pourtant pas comme prévu.",

                        "Avant même de réellement découvrir le monde humain, elle tombe sur un étrange marché.",

                        "Des créatures fantastiques y circulent librement, des objets magiques remplissent les étals et une énergie inconnue imprègne les lieux.",

                        "Pourtant, les humains ordinaires semblent incapables de voir ce marché.",

                        "Un monde entier existe sous leurs yeux sans qu’ils en aient conscience."

                    ],

                    messages: [

                        "Un marché magique caché sur Terre. Normal. 🔮",

                        "Les humains passaient juste à côté sans rien voir !",

                        "Je pensais rencontrer des humains en premier... raté.",

                        "Votre planète cache vraiment beaucoup de choses."

                    ]
                },


                {
                    id:
                        "earth-3",

                    title:
                        "Myo",

                    subtitle:
                        "La faunette mystérieuse",

                    text: [

                        "Au cœur du marché magique, Couaxia rencontre une faunette nommée Myo.",

                        "Elle semble parfaitement connaître les lieux et le monde magique qui entoure la Terre.",

                        "Myo se montre accueillante, mais elle ne révèle pas immédiatement toute la vérité sur son identité.",

                        "Couaxia découvre plus tard qu’elle n’est pas une simple habitante du marché.",

                        "Myo est en réalité la propriétaire du royaume magique.",

                        "Cette rencontre marque le début d’une toute nouvelle partie de l’histoire de Couaxia."

                    ],

                    image:
                        "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/characters/myo.png",

                    imageAlt:
                        "Myo",

                    messages: [

                        "Et voilà Myo ! 💜",

                        "Une faunette tout à fait normale... évidemment.",

                        "Elle avait juste oublié de préciser qu’elle possédait le royaume. 👀",

                        "Cette rencontre allait changer beaucoup de choses."

                    ]
                }

            ]
        }

    ];


/* =========================================================
   FLATTEN STORY
========================================================= */

const allPages =
    computed(
        () => {

            return chapters.flatMap(
                (
                    chapter,
                    chapterIndex
                ) => {

                    return chapter.pages.map(
                        (
                            page,
                            pageIndex
                        ) => {

                            return {

                                ...page,

                                chapterId:
                                    chapter.id,

                                chapterNumber:
                                    chapter.number,

                                chapterTitle:
                                    chapter.title,

                                chapterSubtitle:
                                    chapter.subtitle,

                                chapterIcon:
                                    chapter.icon,

                                chapterIndex,

                                pageIndex,

                                pageCount:
                                    chapter.pages.length

                            };

                        }
                    );

                }
            );

        }
    );


/* =========================================================
   STATE
========================================================= */

const currentPageIndex =
    ref(
        0
    );


const displayedPageIndex =
    ref(
        0
    );


const targetPageIndex =
    ref(
        0
    );


const turning =
    ref(
        false
    );


const turnDirection =
    ref<
        "next" |
        "previous"
    >(
        "next"
    );


/* =========================================================
   ANNEXE STATE
========================================================= */

const selectedAnnexe =
    ref<StoryAnnexe | null>(
        null
    );


/* =========================================================
   MASCOT TIMER
========================================================= */

let mascotHoverTimer:
    number | null =
        null;


/* =========================================================
   CURRENT PAGE
========================================================= */

const currentPage =
    computed(
        () => {

            return (
                allPages.value[
                    displayedPageIndex.value
                ]
                ??
                allPages.value[0]!
            );

        }
    );


const targetPage =
    computed(
        () => {

            return (
                allPages.value[
                    targetPageIndex.value
                ]
                ??
                currentPage.value
            );

        }
    );


/* =========================================================
   CURRENT CHAPTER
========================================================= */

const currentChapter =
    computed(
        () => {

            return (
                chapters[
                    currentPage.value.chapterIndex
                ]
                ??
                chapters[0]!
            );

        }
    );


/* =========================================================
   PAGINATION
========================================================= */

const canGoPrevious =
    computed(
        () => {

            return (
                currentPageIndex.value >
                0
            );

        }
    );


const canGoNext =
    computed(
        () => {

            return (
                currentPageIndex.value <
                allPages.value.length - 1
            );

        }
    );


/* =========================================================
   PROGRESS
========================================================= */

const progress =
    computed(
        () => {

            if (
                allPages.value.length ===
                0
            ) {

                return 0;

            }


            return (
                (
                    currentPageIndex.value +
                    1
                )
                /
                allPages.value.length
            )
            *
            100;

        }
    );


/* =========================================================
   RANDOM MESSAGE
========================================================= */

function getRandomMessage(
    messages:
        string[]
):
    string {

    if (
        messages.length ===
        0
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
   GENERAL BOOK MESSAGES
========================================================= */

const bookMessages = [

    "Bienvenue dans mon histoire complète. 📖",

    "Chaque chapitre peut contenir plusieurs pages.",

    "Utilise les flèches pour tourner les pages comme dans un vrai livre.",

    "Tu peux aussi choisir directement un chapitre en haut du livre.",

    "Installe-toi confortablement... il y a un peu de lecture. 💜"

];


/* =========================================================
   CURRENT PAGE MASCOT
========================================================= */

function speakAboutCurrentPage() {

    startMascotHover(
        currentPage.value.messages
    );

}


/* =========================================================
   NEXT PAGE MASCOT
========================================================= */

function speakAboutNextPage() {

    if (
        !canGoNext.value
    ) {

        return;

    }


    const next =
        allPages.value[
            currentPageIndex.value +
            1
        ];


    if (
        !next
    ) {

        return;

    }


    startMascotHover(
        [

            next.chapterId !==
                currentPage.value.chapterId
                ? `Le prochain chapitre est « ${next.chapterTitle} ». 📖`
                : "On continue ce chapitre ?",

            "Tourne la page pour découvrir la suite. 👀",

            "Encore une petite page !",

            `Page suivante : ${next.title ?? next.chapterTitle}.`

        ]
    );

}


/* =========================================================
   PREVIOUS PAGE MASCOT
========================================================= */

function speakAboutPreviousPage() {

    if (
        !canGoPrevious.value
    ) {

        return;

    }


    startMascotHover(
        [

            "Tu veux relire le passage précédent ?",

            "Retour à la page précédente. 📖",

            "On remonte un peu dans l’histoire.",

            "Besoin de vérifier quelque chose ? 👀"

        ]
    );

}


/* =========================================================
   TURN PAGE
========================================================= */

async function turnPage(
    direction:
        "next" |
        "previous"
) {

    if (
        turning.value
        ||
        selectedAnnexe.value
    ) {

        return;

    }


    if (
        direction ===
            "next"
        &&
        !canGoNext.value
    ) {

        return;

    }


    if (
        direction ===
            "previous"
        &&
        !canGoPrevious.value
    ) {

        return;

    }


    turnDirection.value =
        direction;


    targetPageIndex.value =
        direction ===
            "next"
            ? currentPageIndex.value + 1
            : currentPageIndex.value - 1;


    turning.value =
        true;


    await nextTick();


    window.setTimeout(
        () => {

            displayedPageIndex.value =
                targetPageIndex.value;

        },
        460
    );


    window.setTimeout(
        () => {

            currentPageIndex.value =
                targetPageIndex.value;


            displayedPageIndex.value =
                currentPageIndex.value;


            turning.value =
                false;


            sendMascotMessage(
                getRandomMessage(
                    currentPage.value.messages
                )
            );

        },
        920
    );

}


/* =========================================================
   GO TO CHAPTER
========================================================= */

function goToChapter(
    chapterIndex:
        number
) {

    if (
        turning.value
        ||
        selectedAnnexe.value
    ) {

        return;

    }


    const target =
        allPages.value.findIndex(
            page =>
                page.chapterIndex ===
                chapterIndex
        );


    if (
        target ===
            -1
        ||
        target ===
            currentPageIndex.value
    ) {

        return;

    }


    targetPageIndex.value =
        target;


    turnDirection.value =
        target >
            currentPageIndex.value
            ? "next"
            : "previous";


    turning.value =
        true;


    window.setTimeout(
        () => {

            displayedPageIndex.value =
                target;

        },
        460
    );


    window.setTimeout(
        () => {

            currentPageIndex.value =
                target;


            displayedPageIndex.value =
                target;


            turning.value =
                false;


            const chapter =
                chapters[
                    chapterIndex
                ];


            if (
                chapter
            ) {

                sendMascotMessage(
                    `Bienvenue au chapitre ${chapter.number} : ${chapter.title}. 📖`
                );

            }

        },
        920
    );

}


/* =========================================================
   OPEN ANNEXE
========================================================= */

function openAnnexe(
    annexe:
        StoryAnnexe
) {

    if (
        turning.value
    ) {

        return;

    }


    stopMascotHover();


    selectedAnnexe.value =
        annexe;

}


/* =========================================================
   CLOSE ANNEXE
========================================================= */

function closeAnnexe() {

    selectedAnnexe.value =
        null;

}


/* =========================================================
   KEYBOARD NAVIGATION
========================================================= */

function handleKeydown(
    event:
        KeyboardEvent
) {

    /*
     * Annexes.vue possède son propre clavier.
     */

    if (
        selectedAnnexe.value
    ) {

        return;

    }


    if (
        event.key ===
        "ArrowRight"
    ) {

        turnPage(
            "next"
        );

        return;

    }


    if (
        event.key ===
        "ArrowLeft"
    ) {

        turnPage(
            "previous"
        );

    }

}


/* =========================================================
   MOUNT
========================================================= */

onMounted(
    () => {

        window.addEventListener(
            "keydown",
            handleKeydown
        );

    }
);


/* =========================================================
   CLEANUP
========================================================= */

onBeforeUnmount(
    () => {

        stopMascotHover();


        window.removeEventListener(
            "keydown",
            handleKeydown
        );

    }
);

</script>


<template>

    <section
        id="history-book"
        class="history-storybook"
        aria-labelledby="history-storybook-title"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header
            class="history-storybook__header"

            tabindex="0"

            @mouseenter="
                startMascotHover(
                    bookMessages
                )
            "

            @mouseleave="
                stopMascotHover()
            "

            @focus="
                startMascotHover(
                    bookMessages
                )
            "

            @blur="
                stopMascotHover()
            "
        >

            <p class="history-storybook__eyebrow">
                L’HISTOIRE COMPLÈTE
            </p>


            <h2
                id="history-storybook-title"
                class="history-storybook__title"
            >

                Tourne les pages de

                <span>
                    mon histoire
                </span>

            </h2>


            <p class="history-storybook__description">

                Découvre l’histoire de Couaxia chapitre
                après chapitre, comme si tu parcourais
                réellement les pages d’un livre.

            </p>

        </header>


        <!-- =================================================
             CHAPTER NAVIGATION
        ================================================== -->

        <nav
            class="history-storybook__chapters"
            aria-label="Chapitres de l'histoire"
        >

            <button
                v-for="(
                    chapter,
                    index
                ) in chapters"

                :key="
                    chapter.id
                "

                type="button"

                class="
                    history-storybook__chapter-button
                "

                :class="{
                    'history-storybook__chapter-button--active':
                        index ===
                        currentPage.chapterIndex
                }"

                :disabled="
                    turning
                "

                @click="
                    goToChapter(
                        index
                    )
                "

                @mouseenter="
                    startMascotHover(
                        [
                            `Chapitre ${chapter.number} : ${chapter.title}`,
                            chapter.subtitle,
                            `Tu veux aller directement à « ${chapter.title} » ? 📖`
                        ]
                    )
                "

                @mouseleave="
                    stopMascotHover()
                "

                @focus="
                    startMascotHover(
                        [
                            `Chapitre ${chapter.number} : ${chapter.title}`,
                            chapter.subtitle
                        ]
                    )
                "

                @blur="
                    stopMascotHover()
                "
            >

                <span
                    class="
                        history-storybook__chapter-icon
                    "
                    aria-hidden="true"
                >
                    {{ chapter.icon }}
                </span>


                <span
                    class="
                        history-storybook__chapter-info
                    "
                >

                    <small>
                        Chapitre
                        {{ chapter.number }}
                    </small>


                    <strong>
                        {{ chapter.title }}
                    </strong>

                </span>

            </button>

        </nav>


        <!-- =================================================
             PROGRESS
        ================================================== -->

        <div
            class="
                history-storybook__progress
            "
        >

            <div
                class="
                    history-storybook__progress-track
                "
            >

                <div
                    class="
                        history-storybook__progress-value
                    "

                    :style="{
                        width:
                            `${progress}%`
                    }"
                ></div>

            </div>


            <span
                class="
                    history-storybook__progress-text
                "
            >

                {{ currentPageIndex + 1 }}
                /
                {{ allPages.length }}

                pages

            </span>

        </div>


        <!-- =================================================
             ANNEXES
        ================================================== -->

        <div
            v-if="
                currentChapter.annexes?.length
            "

            class="
                history-storybook__annexes
            "
        >

            <span
                class="
                    history-storybook__annexes-label
                "
            >
                📎 Annexes disponibles
            </span>


            <button
                v-for="
                    annexe in
                    currentChapter.annexes
                "

                :key="
                    annexe.id
                "

                type="button"

                class="
                    history-storybook__annexe-button
                "

                :disabled="
                    turning
                "

                @mouseenter="
                    startMascotHover(
                        annexe.messages
                    )
                "

                @mouseleave="
                    stopMascotHover()
                "

                @focus="
                    startMascotHover(
                        annexe.messages
                    )
                "

                @blur="
                    stopMascotHover()
                "

                @click="
                    openAnnexe(
                        annexe
                    )
                "
            >

                <span
                    class="
                        history-storybook__annexe-icon
                    "

                    aria-hidden="true"
                >
                    {{ annexe.icon }}
                </span>


                <span
                    class="
                        history-storybook__annexe-content
                    "
                >

                    <small>
                        Annexe
                        {{ annexe.number }}
                    </small>


                    <strong>
                        {{ annexe.title }}
                    </strong>

                </span>


                <span
                    class="
                        history-storybook__annexe-arrow
                    "

                    aria-hidden="true"
                >
                    ↗
                </span>

            </button>

        </div>


        <!-- =================================================
             BOOK SCENE
        ================================================== -->

        <div
            class="
                history-storybook__scene
            "
        >

            <div
                class="
                    history-storybook__book
                "
            >

                <!-- =========================================
                     LEFT PAGE
                ========================================== -->

                <article
                    class="
                        history-storybook__page
                        history-storybook__page--left
                    "

                    tabindex="0"

                    @mouseenter="
                        speakAboutCurrentPage()
                    "

                    @mouseleave="
                        stopMascotHover()
                    "

                    @focus="
                        speakAboutCurrentPage()
                    "

                    @blur="
                        stopMascotHover()
                    "
                >

                    <div
                        class="
                            history-storybook__page-inner
                        "
                    >

                        <!-- =================================
                             CHAPTER
                        ================================== -->

                        <div
                            class="
                                history-storybook__chapter-heading
                            "
                        >

                            <span
                                class="
                                    history-storybook__chapter-number
                                "
                            >
                                CHAPITRE
                                {{ currentPage.chapterNumber }}
                            </span>


                            <span
                                class="
                                    history-storybook__chapter-page
                                "
                            >
                                {{
                                    currentPage.pageIndex +
                                    1
                                }}

                                /

                                {{
                                    currentPage.pageCount
                                }}
                            </span>

                        </div>


                        <!-- SUBTITLE -->

                        <p
                            class="
                                history-storybook__page-subtitle
                            "
                        >
                            {{
                                currentPage.subtitle
                                ??
                                currentPage.chapterSubtitle
                            }}
                        </p>


                        <!-- TITLE -->

                        <h3
                            class="
                                history-storybook__page-title
                            "
                        >
                            {{
                                currentPage.title
                                ??
                                currentPage.chapterTitle
                            }}
                        </h3>


                        <!-- =================================
                             IMAGE
                        ================================== -->

                        <div
                            v-if="
                                currentPage.image
                            "

                            class="
                                history-storybook__illustration
                            "
                        >

                            <div
                                class="
                                    history-storybook__illustration-glow
                                "

                                aria-hidden="true"
                            ></div>


                            <img
                                :src="
                                    currentPage.image
                                "

                                :alt="
                                    currentPage.imageAlt
                                    ??
                                    currentPage.title
                                    ??
                                    currentPage.chapterTitle
                                "

                                class="
                                    history-storybook__image
                                "
                            >

                        </div>


                        <!-- =================================
                             NO IMAGE
                        ================================== -->

                        <div
                            v-else

                            class="
                                history-storybook__chapter-decoration
                            "

                            aria-hidden="true"
                        >

                            <span>
                                {{ currentPage.chapterIcon }}
                            </span>


                            <span>
                                ✦
                            </span>

                        </div>


                        <!-- PAGE NUMBER -->

                        <span
                            class="
                                history-storybook__paper-number
                            "
                        >
                            {{
                                currentPageIndex
                                *
                                2
                                +
                                1
                            }}
                        </span>

                    </div>

                </article>


                <!-- =========================================
                     SPINE
                ========================================== -->

                <div
                    class="
                        history-storybook__spine
                    "

                    aria-hidden="true"
                ></div>


                <!-- =========================================
                     RIGHT PAGE
                ========================================== -->

                <article
                    class="
                        history-storybook__page
                        history-storybook__page--right
                    "

                    tabindex="0"

                    @mouseenter="
                        speakAboutCurrentPage()
                    "

                    @mouseleave="
                        stopMascotHover()
                    "

                    @focus="
                        speakAboutCurrentPage()
                    "

                    @blur="
                        stopMascotHover()
                    "
                >

                    <div
                        class="
                            history-storybook__page-inner
                        "
                    >

                        <!-- =================================
                             TEXT
                        ================================== -->

                        <div
                            class="
                                history-storybook__text
                            "
                        >

                            <p
                                v-for="(
                                    paragraph,
                                    index
                                ) in currentPage.text"

                                :key="
                                    `${currentPage.id}-${index}`
                                "

                                class="
                                    history-storybook__paragraph
                                "
                            >
                                {{ paragraph }}
                            </p>

                        </div>


                        <!-- PAGE NUMBER -->

                        <span
                            class="
                                history-storybook__paper-number
                            "
                        >
                            {{
                                currentPageIndex
                                *
                                2
                                +
                                2
                            }}
                        </span>

                    </div>

                </article>


                <!-- =========================================
                     TURNING SHEET
                ========================================== -->

                <div
                    v-if="
                        turning
                    "

                    class="
                        history-storybook__sheet
                    "

                    :class="[
                        `history-storybook__sheet--${turnDirection}`
                    ]"

                    aria-hidden="true"
                >

                    <!-- FRONT -->

                    <div
                        class="
                            history-storybook__sheet-face
                            history-storybook__sheet-face--front
                        "
                    >

                        <div
                            class="
                                history-storybook__sheet-content
                            "
                        >

                            <small>
                                Chapitre
                                {{ currentPage.chapterNumber }}
                            </small>


                            <strong>
                                {{
                                    currentPage.title
                                    ??
                                    currentPage.chapterTitle
                                }}
                            </strong>


                            <span>
                                {{
                                    currentPage.chapterTitle
                                }}
                            </span>

                        </div>

                    </div>


                    <!-- BACK -->

                    <div
                        class="
                            history-storybook__sheet-face
                            history-storybook__sheet-face--back
                        "
                    >

                        <div
                            class="
                                history-storybook__sheet-content
                            "
                        >

                            <small>
                                Chapitre
                                {{ targetPage.chapterNumber }}
                            </small>


                            <strong>
                                {{
                                    targetPage.title
                                    ??
                                    targetPage.chapterTitle
                                }}
                            </strong>


                            <span>
                                {{
                                    targetPage.chapterTitle
                                }}
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </div>


        <!-- =================================================
             NAVIGATION
        ================================================== -->

        <nav
            class="
                history-storybook__navigation
            "

            aria-label="
                Navigation dans l'histoire
            "
        >

            <!-- PREVIOUS -->

            <button
                type="button"

                class="
                    history-storybook__nav-button
                    history-storybook__nav-button--previous
                "

                :disabled="
                    !canGoPrevious ||
                    turning
                "

                @mouseenter="
                    speakAboutPreviousPage()
                "

                @mouseleave="
                    stopMascotHover()
                "

                @focus="
                    speakAboutPreviousPage()
                "

                @blur="
                    stopMascotHover()
                "

                @click="
                    turnPage(
                        'previous'
                    )
                "
            >

                <span aria-hidden="true">
                    ←
                </span>


                <span>
                    Page précédente
                </span>

            </button>


            <!-- CURRENT INFO -->

            <div
                class="
                    history-storybook__current
                "
            >

                <span>
                    Chapitre
                    {{ currentChapter.number }}
                </span>


                <strong>
                    {{ currentChapter.title }}
                </strong>


                <small>

                    Page

                    {{
                        currentPage.pageIndex +
                        1
                    }}

                    sur

                    {{
                        currentPage.pageCount
                    }}

                </small>

            </div>


            <!-- NEXT -->

            <button
                type="button"

                class="
                    history-storybook__nav-button
                    history-storybook__nav-button--next
                "

                :disabled="
                    !canGoNext ||
                    turning
                "

                @mouseenter="
                    speakAboutNextPage()
                "

                @mouseleave="
                    stopMascotHover()
                "

                @focus="
                    speakAboutNextPage()
                "

                @blur="
                    stopMascotHover()
                "

                @click="
                    turnPage(
                        'next'
                    )
                "
            >

                <span>
                    Page suivante
                </span>


                <span aria-hidden="true">
                    →
                </span>

            </button>

        </nav>


        <!-- =================================================
             KEYBOARD HELP
        ================================================== -->

        <p
            class="
                history-storybook__keyboard
            "
        >

            <span aria-hidden="true">
                ⌨️
            </span>

            Tu peux aussi utiliser

            <kbd>
                ←
            </kbd>

            et

            <kbd>
                →
            </kbd>

            pour tourner les pages.

        </p>


        <!-- =================================================
             ANNEXE LIGHTBOX
        ================================================== -->

        <Annexes
            v-if="
                selectedAnnexe
            "

            :annexe="
                selectedAnnexe
            "

            @close="
                closeAnnexe
            "
        />

    </section>

</template>