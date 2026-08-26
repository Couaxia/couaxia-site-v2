<script setup lang="ts">
import {
    ref
} from "vue";


/* =========================================================
   TYPES
========================================================= */

interface PaletteColor {
    hex: string;
    label: string;
}


/* =========================================================
   CHARACTER
========================================================= */

const characterImage =
    "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/artworks/Couaxia/forme-3/Fullbody_transparent.png";


/* =========================================================
   COLORS
========================================================= */

const leftColors: PaletteColor[] = [

    {
        hex: "#FEC9AF",
        label: "Peau"
    },

    {
        hex: "#9DDBC6",
        label: "Manches"
    },

    {
        hex: "#2B1F25",
        label: "Partie de la tenue"
    },

    {
        hex: "#8A0B4C",
        label: "Cheveux"
    },

    {
        hex: "#C39061",
        label: "Bas du corps"
    },

    {
        hex: "#85B1B9",
        label: "Tour de cou"
    }

];


const rightColors: PaletteColor[] = [

    {
        hex: "#8299A7",
        label: "Ceinture"
    },

    {
        hex: "#B86B18",
        label: "Centre de la ceinture"
    },

    {
        hex: "#D9AFC5",
        label: "Centre de la tenue"
    },

    {
        hex: "#E91E78",
        label: "Couleur partie 1 tentacules"
    },

    {
        hex: "#71052F",
        label: "Partie 2 tentacules"
    },

    {
        hex: "#F9FDFE",
        label: "Haut des chaussures"
    }

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
    color: PaletteColor
): Promise<void> {

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

    }

    catch (error) {

        console.error(
            "Impossible de copier la couleur :",
            error
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
                    :key="color.hex"
                    type="button"
                    class="about-palette__color-card"
                    :class="{
                        'about-palette__color-card--copied':
                            copiedColor === color.hex
                    }"
                    :aria-label="`Copier la couleur ${color.label} ${color.hex}`"
                    @click="copyColor(color)"
                >

                    <span
                        class="about-palette__swatch"
                        :style="{
                            backgroundColor:
                                color.hex
                        }"
                        aria-hidden="true"
                    ></span>


                    <span class="about-palette__color-info">

                        <strong>
                            {{ color.hex }}
                        </strong>

                        <small>
                            {{ color.label }}
                        </small>

                    </span>


                    <span
                        v-if="copiedColor === color.hex"
                        class="about-palette__copied"
                    >
                        ✓ Copié
                    </span>

                </button>

            </div>


            <!-- =============================================
                 CHARACTER
            ============================================== -->

            <div class="about-palette__character">

                <div
                    class="about-palette__character-glow"
                    aria-hidden="true"
                ></div>


                <img
                    :src="characterImage"
                    alt="Référence full body de Couaxia"
                    class="about-palette__character-image"
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
                    :key="color.hex"
                    type="button"
                    class="about-palette__color-card"
                    :class="{
                        'about-palette__color-card--copied':
                            copiedColor === color.hex
                    }"
                    :aria-label="`Copier la couleur ${color.label} ${color.hex}`"
                    @click="copyColor(color)"
                >

                    <span
                        class="about-palette__swatch"
                        :style="{
                            backgroundColor:
                                color.hex
                        }"
                        aria-hidden="true"
                    ></span>


                    <span class="about-palette__color-info">

                        <strong>
                            {{ color.hex }}
                        </strong>

                        <small>
                            {{ color.label }}
                        </small>

                    </span>


                    <span
                        v-if="copiedColor === color.hex"
                        class="about-palette__copied"
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
                href="https://vsona.vgen.co/couaxia"
                target="_blank"
                rel="noopener noreferrer"
                class="about-palette__link"
            >
                ➜ Voir la palette complète
            </a>

        </div>

    </section>

</template>