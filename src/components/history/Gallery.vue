<script setup lang="ts">

import {
    onBeforeUnmount,
    onMounted,
    ref
} from "vue";


/* =========================================================
   TYPES
========================================================= */

interface HistoryGalleryItem {

    id:
        string;

    title:
        string;

    description:
        string;

    image:
        string;

    alt:
        string;

    tags:
        string[];

    messages:
        string[];

    featured?:
        boolean;

}


/* =========================================================
   STATE
========================================================= */

const selectedImage =
    ref<HistoryGalleryItem | null>(
        null
    );


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
            350
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

const galleryMessages = [

    "Voici quelques-uns des visages de mon histoire ! 💜",

    "Chaque personnage possède sa propre place dans cette aventure.",

    "Tu vas en croiser certains très souvent dans mon histoire. 👀",

    "Bienvenue dans la galerie de mon univers !",

    "Des Kraduks, une faunette, un Drasquin et même un vaisseau... tout est parfaitement normal.",

    "Cette galerie continuera de grandir avec mon histoire ! 🐙"

];


/* =========================================================
   GALLERY ITEMS
========================================================= */

const galleryItems:
    HistoryGalleryItem[] = [

        /* =====================================================
           COUAXIA
        ===================================================== */

        {
            id:
                "couaxia",

            title:
                "Couaxia",

            description:
                "Kraduk originaire de Saphira, pilote et exploratrice. C’est elle qui est au cœur de cette aventure à travers l’univers.",

            image:
                "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/characters/couaxia.png",

            alt:
                "Couaxia",

            tags: [
                "Couaxia",
                "Kraduk",
                "Saphira",
                "Pilote"
            ],

            messages: [

                "Coucou, c’est moi ! 🐙💜",

                "La protagoniste de cette histoire... quelle surprise !",

                "Une Kraduk, quelques tentacules et beaucoup trop de curiosité.",

                "Tout ce voyage a commencé sur Saphira.",

                "Je voulais explorer l’univers... je crois que j’ai plutôt bien réussi. 👀",

                "Tu vas forcément me revoir souvent dans cette histoire !"

            ],

            featured:
                true
        },


        /* =====================================================
           HYLDA
        ===================================================== */

        {
            id:
                "hylda",

            title:
                "Hylda",

            description:
                "La sœur de Couaxia, présente à ses côtés depuis leur départ de Saphira et durant leur voyage à bord d’Avadora.",

            image:
                "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/characters/hylda.png",

            alt:
                "Hylda",

            tags: [
                "Hylda",
                "Kraduk",
                "Saphira",
                "Avadora"
            ],

            messages: [

                "Hylda, ma sœur ! 💜",

                "Elle était là bien avant que cette aventure commence.",

                "On a quitté Saphira ensemble !",

                "Cinq années dans Avadora avec sa sœur... ça crée des souvenirs. 👀",

                "Heureusement qu’Hylda était avec moi pendant le voyage !",

                "Elle fait partie de l’aventure depuis le tout début."

            ]
        },


        /* =====================================================
           CITA
        ===================================================== */

        {
            id:
                "cita",

            title:
                "Cita",

            description:
                "Cita fait partie de l’équipage qui quitte Saphira et accompagne Couaxia et Hylda dans leur voyage à travers l’univers.",

            image:
                "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/characters/Cita.png",

            alt:
                "Cita",

            tags: [
                "Cita",
                "Saphira",
                "Avadora",
                "Équipage"
            ],

            messages: [

                "Cita ! ✨",

                "Elle faisait déjà partie de l’équipage au départ de Saphira.",

                "Elle aussi a survécu à cinq années dans Avadora avec nous. 😂",

                "Notre petit équipage ne serait pas le même sans Cita.",

                "Cita fait partie de l’aventure depuis le tout début !",

                "Avant même Natsu et Myo, Cita était déjà là."

            ]
        },


        /* =====================================================
           AVADORA
        ===================================================== */

        {
            id:
                "avadora",

            title:
                "Avadora",

            description:
                "Le vaisseau spatial d’exploration qui accompagne Couaxia, Hylda et Cita dans leur voyage à travers l’univers.",

            image:
                "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/characters/avadora.png",

            alt:
                "Avadora, le vaisseau spatial",

            tags: [
                "Avadora",
                "Vaisseau",
                "Saphira",
                "Exploration"
            ],

            messages: [

                "Avadora ! Notre maison parmi les étoiles. 🛸",

                "Sans Avadora, aller jusqu’à Draquin aurait été légèrement compliqué. 👀",

                "Cinq années de voyage spatial... heureusement qu’on avait un bon vaisseau !",

                "Avadora possède même son propre système de camouflage.",

                "Ce n’est pas seulement un vaisseau, c’est aussi notre maison pendant le voyage.",

                "Et oui, Avadora possède une voix féminine !",

                "Elle nous accompagne depuis notre départ de Saphira. 🚀"

            ],

            featured:
                true
        },


        /* =====================================================
           NATSU
        ===================================================== */

        {
            id:
                "natsu",

            title:
                "Natsu",

            description:
                "Un Drasquin rencontré sur Draquin. Cette créature mêlant requin et dragon finira par devenir l’un des compagnons de Couaxia.",

            image:
                "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/characters/natsu.gif",

            alt:
                "Natsu, le Drasquin",

            tags: [
                "Natsu",
                "Drasquin",
                "Draquin",
                "Dragon",
                "Requin"
            ],

            messages: [

                "NATSU ! 🐉💜",

                "Le plus beau dragon-requin de l’univers !",

                "Notre première rencontre était légèrement moins mignonne. 👀",

                "Oui, il a des cornes roses. Et elles sont magnifiques !",

                "Natsu n’était clairement pas prévu dans l’équipage au départ.",

                "Un tentacule sacrifié plus tard et nous voilà compagnons d’aventure. 😂",

                "Ne vous fiez pas trop à son apparence... enfin, peut-être un peu quand même."

            ],

            featured:
                true
        },


        /* =====================================================
           MYO
        ===================================================== */

        {
            id:
                "myo",

            title:
                "Myo",

            description:
                "Une mystérieuse faunette rencontrée dans un marché magique caché aux humains après l’arrivée de Couaxia sur Terre.",

            image:
                "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/characters/myo.png",

            alt:
                "Myo, la faunette",

            tags: [
                "Myo",
                "Faunette",
                "Terre",
                "Magie"
            ],

            messages: [

                "Myo ! 💜",

                "Une petite faunette rencontrée totalement par hasard... enfin presque. 👀",

                "Elle connaissait étrangement bien ce marché magique.",

                "Myo avait oublié de préciser un tout petit détail sur son identité...",

                "Découvrir que la faunette que tu viens de rencontrer possède le royaume ? Journée normale.",

                "Cette rencontre allait devenir beaucoup plus importante que prévu.",

                "Avec Myo, les apparences peuvent être légèrement trompeuses."

            ],

            featured:
                true
        }

    ];


/* =========================================================
   OPEN IMAGE
========================================================= */

function openImage(
    item:
        HistoryGalleryItem
) {

    selectedImage.value =
        item;


    stopMascotHover();


    sendMascotMessage(
        getRandomMessage(
            item.messages
        )
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE IMAGE
========================================================= */

function closeImage() {

    selectedImage.value =
        null;


    document.body.style.overflow =
        "";

}


/* =========================================================
   KEYBOARD
========================================================= */

function handleKeydown(
    event:
        KeyboardEvent
) {

    if (
        event.key ===
        "Escape"
        &&
        selectedImage.value
    ) {

        closeImage();

    }

}


/* =========================================================
   TAG MASCOT
========================================================= */

function speakAboutTag(
    item:
        HistoryGalleryItem,

    tag:
        string
) {

    startMascotHover(
        [

            `${tag} fait partie de l’univers de ${item.title}.`,

            `${tag} est lié à ${item.title}.`,

            `Encore un petit élément de lore autour de ${item.title}. 👀`,

            `Tu avais remarqué ce détail : ${tag} ?`,

            `${tag}... garde ce mot en tête pour la suite de l’histoire.`

        ]
    );

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


        document.body.style.overflow =
            "";

    }
);

</script>


<template>

    <section
        id="history-gallery"
        class="history-gallery"
        aria-labelledby="history-gallery-title"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header
            class="history-gallery__header"

            tabindex="0"

            @mouseenter="
                startMascotHover(
                    galleryMessages
                )
            "

            @mouseleave="
                stopMascotHover
            "

            @focus="
                startMascotHover(
                    galleryMessages
                )
            "

            @blur="
                stopMascotHover
            "
        >

            <p class="history-gallery__eyebrow">
                GALERIE DU LORE
            </p>


            <h2
                id="history-gallery-title"
                class="history-gallery__title"
            >

                Les visages de

                <span>
                    l’aventure
                </span>

            </h2>


            <p class="history-gallery__description">

                Retrouve les personnages et compagnons
                qui occupent une place importante dans
                l’histoire de Couaxia.

            </p>

        </header>


        <!-- =================================================
             GRID
        ================================================== -->

        <div class="history-gallery__grid">

            <article
                v-for="item in galleryItems"

                :key="
                    item.id
                "

                class="
                    history-gallery-card
                "

                :class="{
                    'history-gallery-card--featured':
                        item.featured
                }"

                tabindex="0"

                @mouseenter="
                    startMascotHover(
                        item.messages
                    )
                "

                @mouseleave="
                    stopMascotHover
                "

                @focus="
                    startMascotHover(
                        item.messages
                    )
                "

                @blur="
                    stopMascotHover
                "
            >

                <!-- =========================================
                     VISUAL
                ========================================== -->

                <button
                    type="button"

                    class="
                        history-gallery-card__visual
                    "

                    :aria-label="
                        `Agrandir l'illustration de ${item.title}`
                    "

                    @click="
                        openImage(
                            item
                        )
                    "
                >

                    <!-- GLOW -->

                    <div
                        class="
                            history-gallery-card__glow
                        "

                        aria-hidden="true"
                    ></div>


                    <!-- IMAGE -->

                    <img
                        :src="
                            item.image
                        "

                        :alt="
                            item.alt
                        "

                        class="
                            history-gallery-card__image
                        "

                        loading="lazy"
                    >


                    <!-- ZOOM -->

                    <span
                        class="
                            history-gallery-card__zoom
                        "

                        aria-hidden="true"
                    >
                        ⛶
                    </span>


                    <!-- FEATURED -->

                    <span
                        v-if="
                            item.featured
                        "

                        class="
                            history-gallery-card__featured
                        "
                    >
                        ✦ Important
                    </span>

                </button>


                <!-- =========================================
                     CONTENT
                ========================================== -->

                <div class="history-gallery-card__content">

                    <!-- TITLE -->

                    <h3 class="history-gallery-card__title">
                        {{ item.title }}
                    </h3>


                    <!-- DESCRIPTION -->

                    <p class="history-gallery-card__description">
                        {{ item.description }}
                    </p>


                    <!-- =====================================
                         TAGS
                    ====================================== -->

                    <div class="history-gallery-card__tags">

                        <span
                            v-for="tag in item.tags"

                            :key="
                                tag
                            "

                            class="
                                history-gallery-card__tag
                            "

                            tabindex="0"

                            @mouseenter.stop="
                                speakAboutTag(
                                    item,
                                    tag
                                )
                            "

                            @mouseleave.stop="
                                stopMascotHover
                            "

                            @focus.stop="
                                speakAboutTag(
                                    item,
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

        <div class="history-gallery__ending">

            <span
                class="history-gallery__ending-icon"
                aria-hidden="true"
            >
                ✦
            </span>


            <div>

                <strong>
                    La galerie continuera de grandir...
                </strong>


                <p>
                    De nouveaux personnages, créatures
                    et souvenirs viendront compléter
                    l’univers au fil de l’histoire.
                </p>

            </div>

        </div>


        <!-- =================================================
             LIGHTBOX
        ================================================== -->

        <Teleport to="body">

            <Transition
                name="
                    history-gallery-lightbox
                "
            >

                <div
                    v-if="
                        selectedImage
                    "

                    class="
                        history-gallery-lightbox
                    "

                    role="dialog"

                    aria-modal="true"

                    :aria-label="
                        selectedImage.title
                    "

                    @click.self="
                        closeImage
                    "
                >

                    <!-- =====================================
                         CONTENT
                    ====================================== -->

                    <div
                        class="
                            history-gallery-lightbox__content
                        "
                    >

                        <!-- =================================
                             CLOSE
                        ================================== -->

                        <button
                            type="button"

                            class="
                                history-gallery-lightbox__close
                            "

                            aria-label="
                                Fermer l'image
                            "

                            @click="
                                closeImage
                            "
                        >
                            ×
                        </button>


                        <!-- =================================
                             VISUAL
                        ================================== -->

                        <div
                            class="
                                history-gallery-lightbox__visual
                            "
                        >

                            <div
                                class="
                                    history-gallery-lightbox__glow
                                "

                                aria-hidden="true"
                            ></div>


                            <img
                                :src="
                                    selectedImage.image
                                "

                                :alt="
                                    selectedImage.alt
                                "

                                class="
                                    history-gallery-lightbox__image
                                "
                            >

                        </div>


                        <!-- =================================
                             INFORMATION
                        ================================== -->

                        <div
                            class="
                                history-gallery-lightbox__info
                            "
                        >

                            <p
                                class="
                                    history-gallery-lightbox__eyebrow
                                "
                            >
                                GALERIE DU LORE
                            </p>


                            <h3
                                class="
                                    history-gallery-lightbox__title
                                "
                            >
                                {{ selectedImage.title }}
                            </h3>


                            <p
                                class="
                                    history-gallery-lightbox__description
                                "
                            >
                                {{ selectedImage.description }}
                            </p>


                            <!-- =============================
                                 TAGS
                            ============================== -->

                            <div
                                class="
                                    history-gallery-lightbox__tags
                                "
                            >

                                <span
                                    v-for="
                                        tag in
                                        selectedImage.tags
                                    "

                                    :key="
                                        tag
                                    "

                                    class="
                                        history-gallery-lightbox__tag
                                    "
                                >
                                    {{ tag }}
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </Transition>

        </Teleport>

    </section>

</template>