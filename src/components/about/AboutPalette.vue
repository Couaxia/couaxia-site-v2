<script setup lang="ts">

import {
    ref
} from "vue";


/* =========================================================
   TYPES
========================================================= */

interface PaletteColor {

    hex:
        string;

    label:
        string;

    messages:
        string[];

}


/* =========================================================
   CHARACTER
========================================================= */

const characterImage =
    "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/artworks/Couaxia/forme-3/Fullbody_transparent.png";


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
   COLORS — LEFT
========================================================= */

const leftColors:
    PaletteColor[] = [

        {
            hex:
                "#FEC9AF",

            label:
                "Peau",

            messages: [

                "Voilà la couleur de ma peau ! ✨",

                "Un ton plutôt doux pour une créature venue de l'espace.",

                "Cette couleur est importante pour garder mon modèle cohérent !",

                "#FEC9AF, note-la bien si tu veux me dessiner ! 🎨"

            ]
        },


        {
            hex:
                "#9DDBC6",

            label:
                "Manches",

            messages: [

                "Le vert doux de mes manches ! 💚",

                "J'aime beaucoup cette petite touche plus fraîche dans ma tenue.",

                "Cette couleur équilibre bien tout le rose et le violet !",

                "Les manches ont aussi droit à leur code couleur précis !"

            ]
        },


        {
            hex:
                "#2B1F25",

            label:
                "Partie de la tenue",

            messages: [

                "Un ton sombre pour donner un peu de contraste !",

                "Tout ne peut pas être rose... enfin presque. 👀",

                "Cette couleur aide beaucoup les couleurs plus vives à ressortir.",

                "Un peu de sombre pour éviter de ressembler à une explosion de bonbons !"

            ]
        },


        {
            hex:
                "#8A0B4C",

            label:
                "Cheveux",

            messages: [

                "La couleur principale de mes cheveux ! 💜",

                "Un joli rouge-violet bien profond.",

                "Mes cheveux sont difficiles à rater, non ? 👀",

                "#8A0B4C, une des couleurs importantes de mon design !"

            ]
        },


        {
            hex:
                "#C39061",

            label:
                "Bas du corps",

            messages: [

                "Cette teinte se retrouve sur le bas de mon design.",

                "Un ton plus chaud pour varier un peu la palette !",

                "Même les petits détails ont leur couleur précise. 🎨",

                "Les artistes vont apprécier d'avoir le code exact !"

            ]
        },


        {
            hex:
                "#85B1B9",

            label:
                "Tour de cou",

            messages: [

                "La couleur de mon tour de cou !",

                "Une petite touche bleutée pour rappeler certaines couleurs de mon univers.",

                "J'aime beaucoup ce bleu légèrement désaturé.",

                "Encore un petit détail à ne pas oublier ! 👀"

            ]
        }

    ];


/* =========================================================
   COLORS — RIGHT
========================================================= */

const rightColors:
    PaletteColor[] = [

        {
            hex:
                "#8299A7",

            label:
                "Ceinture",

            messages: [

                "La couleur principale de ma ceinture !",

                "Un bleu-gris qui fonctionne bien avec le reste de la tenue.",

                "Même ma ceinture possède sa propre référence couleur !",

                "Ça évite les variations étranges d'un dessin à l'autre. 🎨"

            ]
        },


        {
            hex:
                "#B86B18",

            label:
                "Centre de la ceinture",

            messages: [

                "Une petite touche orangée au centre de la ceinture !",

                "Ce détail apporte un peu de chaleur à la tenue.",

                "Tu vois ? Même les toutes petites parties ont leur code ! 👀",

                "Le genre de détail facile à oublier quand on me dessine."

            ]
        },


        {
            hex:
                "#D9AFC5",

            label:
                "Centre de la tenue",

            messages: [

                "Une teinte rose beaucoup plus douce pour le centre de la tenue.",

                "Le rose est évidemment obligatoire quelque part ! 💗",

                "Cette couleur permet une transition plus douce entre les éléments.",

                "Oui, ma palette contient beaucoup de rose... absolument aucun regret !"

            ]
        },


        {
            hex:
                "#E91E78",

            label:
                "Couleur partie 1 tentacules",

            messages: [

                "Ah ! On arrive aux tentacules ! 🐙",

                "Ce rose vif est une des couleurs principales de mes tentacules.",

                "Impossible de rater mes tentacules avec une couleur pareille !",

                "#E91E78 : couleur officiellement approuvée par la brigade des poulpes."

            ]
        },


        {
            hex:
                "#71052F",

            label:
                "Partie 2 tentacules",

            messages: [

                "Et voici la partie plus sombre de mes tentacules ! 🐙",

                "Le contraste rend les tentacules beaucoup plus intéressantes visuellement.",

                "Rose vif + rouge sombre : excellent mélange !",

                "Mes tentacules méritaient bien plusieurs couleurs."

            ]
        },


        {
            hex:
                "#F9FDFE",

            label:
                "Haut des chaussures",

            messages: [

                "Une couleur presque blanche pour le haut des chaussures.",

                "Un peu de lumière au milieu de toutes ces couleurs ! ✨",

                "Cette teinte permet de garder le design plus lisible.",

                "Même les chaussures ont leur référence exacte !"

            ]
        }

    ];


/* =========================================================
   CHARACTER MESSAGES
========================================================= */

const characterMessages = [

    "Voilà mon modèle complet ! 🐙",

    "Pratique pour voir où toutes les couleurs sont utilisées !",

    "Tu peux comparer directement les couleurs avec mon modèle. 🎨",

    "Les artistes, prenez des notes ! 👀",

    "Oui, il y a beaucoup de détails... et encore plus de tentacules !"

];


/* =========================================================
   COMPLETE PALETTE MESSAGES
========================================================= */

const completePaletteMessages = [

    "Tu veux la version complète ? Elle est juste ici ! 🎨",

    "La palette VGen contient encore plus de détails !",

    "Parfait si tu veux me dessiner correctement. 💜",

    "Les artistes peuvent retrouver toutes mes références sur VGen !",

    "Direction ma VGen pour consulter toutes les couleurs !"

];


/* =========================================================
   COPY STATE
========================================================= */

const copiedColor =
    ref<string | null>(
        null
    );


let copiedTimeout:
    number | undefined;


/* =========================================================
   COPY COLOR
========================================================= */

async function copyColor(
    color:
        PaletteColor
):
    Promise<void> {

    try {

        await navigator.clipboard.writeText(
            color.hex
        );


        copiedColor.value =
            color.hex;


        window.clearTimeout(
            copiedTimeout
        );


        copiedTimeout =
            window.setTimeout(
                () => {

                    copiedColor.value =
                        null;

                },
                1800
            );


        /* =================================================
           MASCOT RESPONSE
        ================================================= */

        const copyMessages = [

            `${color.hex} copié ! 🎨`,

            `Et voilà ! La couleur ${color.label} est dans ton presse-papiers. 💜`,

            `Hop ! ${color.hex} est copié !`,

            `Tu peux maintenant utiliser la couleur ${color.label} ! ✨`

        ];


        sendMascotMessage(
            getRandomMessage(
                copyMessages
            )
        );

    }

    catch (
        error
    ) {

        console.error(
            "Impossible de copier la couleur :",
            error
        );


        sendMascotMessage(
            "Oups... impossible de copier cette couleur ! 😭"
        );

    }

}

</script>


<template>

    <section
        id="palette"
        class="about-palette"
        aria-labelledby="about-palette-title"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header class="about-palette__header">

            <p class="about-palette__eyebrow">
                GUIDE ARTISTIQUE
            </p>


            <h2
                id="about-palette-title"
                class="about-palette__title"
            >
                Palette de Couaxia
            </h2>


            <p class="about-palette__description">

                Le modèle complet de Couaxia est placé
                au centre de sa palette.
                Clique sur une couleur pour copier
                son code hexadécimal.

            </p>

        </header>


        <!-- =================================================
             PALETTE LAYOUT
        ================================================== -->

        <div class="about-palette__layout">

            <!-- =============================================
                 LEFT COLORS
            ============================================== -->

            <div
                class="
                    about-palette__colors
                    about-palette__colors--left
                "
            >

                <button
                    v-for="color in leftColors"

                    :key="
                        color.hex
                    "

                    type="button"

                    class="
                        about-palette__color-card
                    "

                    :class="{
                        'about-palette__color-card--copied':
                            copiedColor === color.hex
                    }"

                    :aria-label="
                        `Copier la couleur ${color.label} ${color.hex}`
                    "

                    @click="
                        copyColor(
                            color
                        )
                    "

                    @mouseenter="
                        startMascotHover(
                            color.messages
                        )
                    "

                    @mouseleave="
                        stopMascotHover
                    "

                    @focus="
                        startMascotHover(
                            color.messages
                        )
                    "

                    @blur="
                        stopMascotHover
                    "
                >

                    <!-- =====================================
                         COLOR
                    ====================================== -->

                    <span
                        class="
                            about-palette__swatch
                        "

                        :style="{
                            backgroundColor:
                                color.hex
                        }"

                        aria-hidden="true"
                    ></span>


                    <!-- =====================================
                         INFO
                    ====================================== -->

                    <span
                        class="
                            about-palette__color-info
                        "
                    >

                        <strong>
                            {{ color.hex }}
                        </strong>


                        <small>
                            {{ color.label }}
                        </small>

                    </span>


                    <!-- =====================================
                         COPIED
                    ====================================== -->

                    <span
                        v-if="
                            copiedColor ===
                            color.hex
                        "

                        class="
                            about-palette__copied
                        "
                    >
                        ✓ Copié
                    </span>

                </button>

            </div>


            <!-- =============================================
                 CHARACTER
            ============================================== -->

            <div
                class="
                    about-palette__character
                "

                tabindex="0"

                @mouseenter="
                    startMascotHover(
                        characterMessages
                    )
                "

                @mouseleave="
                    stopMascotHover
                "

                @focus="
                    startMascotHover(
                        characterMessages
                    )
                "

                @blur="
                    stopMascotHover
                "
            >

                <div
                    class="
                        about-palette__character-glow
                    "

                    aria-hidden="true"
                ></div>


                <img
                    :src="
                        characterImage
                    "

                    alt="
                        Référence full body de Couaxia
                    "

                    class="
                        about-palette__character-image
                    "

                    loading="lazy"
                >

            </div>


            <!-- =============================================
                 RIGHT COLORS
            ============================================== -->

            <div
                class="
                    about-palette__colors
                    about-palette__colors--right
                "
            >

                <button
                    v-for="color in rightColors"

                    :key="
                        color.hex
                    "

                    type="button"

                    class="
                        about-palette__color-card
                    "

                    :class="{
                        'about-palette__color-card--copied':
                            copiedColor === color.hex
                    }"

                    :aria-label="
                        `Copier la couleur ${color.label} ${color.hex}`
                    "

                    @click="
                        copyColor(
                            color
                        )
                    "

                    @mouseenter="
                        startMascotHover(
                            color.messages
                        )
                    "

                    @mouseleave="
                        stopMascotHover
                    "

                    @focus="
                        startMascotHover(
                            color.messages
                        )
                    "

                    @blur="
                        stopMascotHover
                    "
                >

                    <!-- =====================================
                         COLOR
                    ====================================== -->

                    <span
                        class="
                            about-palette__swatch
                        "

                        :style="{
                            backgroundColor:
                                color.hex
                        }"

                        aria-hidden="true"
                    ></span>


                    <!-- =====================================
                         INFO
                    ====================================== -->

                    <span
                        class="
                            about-palette__color-info
                        "
                    >

                        <strong>
                            {{ color.hex }}
                        </strong>


                        <small>
                            {{ color.label }}
                        </small>

                    </span>


                    <!-- =====================================
                         COPIED
                    ====================================== -->

                    <span
                        v-if="
                            copiedColor ===
                            color.hex
                        "

                        class="
                            about-palette__copied
                        "
                    >
                        ✓ Copié
                    </span>

                </button>

            </div>

        </div>


        <!-- =================================================
             COMPLETE PALETTE LINK
        ================================================== -->

        <div class="about-palette__actions">

            <a
                href="
                    https://vsona.vgen.co/couaxia
                "

                target="_blank"

                rel="
                    noopener noreferrer
                "

                class="
                    about-palette__link
                "

                @mouseenter="
                    startMascotHover(
                        completePaletteMessages
                    )
                "

                @mouseleave="
                    stopMascotHover
                "

                @focus="
                    startMascotHover(
                        completePaletteMessages
                    )
                "

                @blur="
                    stopMascotHover
                "
            >
                ➜ Voir la palette complète
            </a>

        </div>

    </section>

</template>