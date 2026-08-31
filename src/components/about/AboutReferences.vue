<script setup lang="ts">

/* =========================================================
   TYPES
========================================================= */

interface ReferenceItem {

    title:
        string;

    description:
        string;

    image:
        string;

    alt:
        string;

    messages:
        string[];

    large?:
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
   REFERENCES
========================================================= */

const references:
    ReferenceItem[] = [

        {
            title:
                "Reference sheet principale",

            description:
                "Vue complète, visage, dos, mains et principaux détails du personnage.",

            image:
                "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/artworks/Couaxia/forme-3/Koleander_Ref_sheet1.png",

            alt:
                "Reference sheet complète de Couaxia",

            large:
                true,

            messages: [

                "Voici ma référence principale ! 🎨",

                "C'est ici que tu peux voir mon design général en détail.",

                "Face, dos, mains... tout y est ! 👀",

                "Les artistes, cette image est probablement votre meilleure amie !",

                "Cette reference sheet contient énormément de détails sur mon modèle. 💜"

            ]
        },


        {
            title:
                "Seconde tenue",

            description:
                "Variante de coiffure, manches et éléments vestimentaires.",

            image:
                "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/artworks/Couaxia/forme-3/Koleander_Ref_sheet2.png",

            alt:
                "Seconde tenue de Couaxia",

            messages: [

                "Une petite variante de tenue ! ✨",

                "Changer de look de temps en temps, ça fait du bien !",

                "Tu préfères cette tenue ou la principale ? 👀",

                "Même une Kraduk a besoin de plusieurs tenues !",

                "Coiffure, manches, vêtements... il y a quelques différences à repérer."

            ]
        },


        {
            title:
                "Corps et tatouages",

            description:
                "Morphologie, marques corporelles, tentacules et tatouages.",

            image:
                "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/artworks/Couaxia/forme-3/Koleander_Ref_sheet3.png",

            alt:
                "Référence du corps et des tatouages de Couaxia",

            messages: [

                "Ici tu peux voir mes tatouages et mes marques plus précisément ! ✨",

                "Oui, il y a pas mal de détails à retenir. 👀",

                "Les tentacules sont évidemment présentes ! 🐙",

                "Cette référence est très pratique pour comprendre ma morphologie.",

                "Attention aux tatouages : chaque détail compte ! 🎨"

            ]
        }

    ];


/* =========================================================
   HEADER MESSAGES
========================================================= */

const headerMessages = [

    "Bienvenue dans mes références officielles ! 🎨",

    "Si tu veux me dessiner, cette section devrait beaucoup t'aider !",

    "Toutes les informations importantes de mon design sont ici. 💜",

    "Prends ton temps, il y a beaucoup de petits détails à observer ! 👀"

];

</script>


<template>

    <section
        id="references"
        class="about-references"
        aria-labelledby="about-references-title"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header
            class="about-references__header"

            tabindex="0"

            @mouseenter="
                startMascotHover(
                    headerMessages
                )
            "

            @mouseleave="
                stopMascotHover
            "

            @focus="
                startMascotHover(
                    headerMessages
                )
            "

            @blur="
                stopMascotHover
            "
        >

            <p class="about-references__eyebrow">
                GALERIE DU PERSONNAGE
            </p>


            <h2
                id="about-references-title"
                class="about-references__title"
            >
                Références de Couaxia
            </h2>


            <p class="about-references__description">

                Ces images regroupent les éléments importants
                du design de Couaxia : silhouette, visage,
                coiffure, tentacules, tenue, tatouages et
                variantes.

            </p>

        </header>


        <!-- =================================================
             GRID
        ================================================== -->

        <div class="about-references__grid">

            <figure
                v-for="reference in references"

                :key="
                    reference.title
                "

                class="
                    about-reference-card
                "

                :class="{
                    'about-reference-card--large':
                        reference.large
                }"

                tabindex="0"

                @mouseenter="
                    startMascotHover(
                        reference.messages
                    )
                "

                @mouseleave="
                    stopMascotHover
                "

                @focus="
                    startMascotHover(
                        reference.messages
                    )
                "

                @blur="
                    stopMascotHover
                "
            >

                <!-- =========================================
                     IMAGE
                ========================================== -->

                <div class="about-reference-card__visual">

                    <img
                        :src="
                            reference.image
                        "

                        :alt="
                            reference.alt
                        "

                        class="
                            about-reference-card__image
                        "

                        loading="lazy"
                    >

                </div>


                <!-- =========================================
                     CAPTION
                ========================================== -->

                <figcaption
                    class="
                        about-reference-card__caption
                    "
                >

                    <strong
                        class="
                            about-reference-card__title
                        "
                    >
                        {{ reference.title }}
                    </strong>


                    <span
                        class="
                            about-reference-card__description
                        "
                    >
                        {{ reference.description }}
                    </span>

                </figcaption>

            </figure>

        </div>

    </section>

</template>