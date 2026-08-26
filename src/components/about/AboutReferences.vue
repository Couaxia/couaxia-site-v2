<script setup lang="ts">

/* =========================================================
   ABOUT REFERENCES
========================================================= */


/* =========================================================
   TYPES
========================================================= */

interface ReferenceItem {
    title: string;
    description: string;
    image: string;
    alt: string;
    large?: boolean;
}


/* =========================================================
   REFERENCES
========================================================= */

const references: ReferenceItem[] = [

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
            true
    },

    {
        title:
            "Seconde tenue",

        description:
            "Variante de coiffure, manches et éléments vestimentaires.",

        image:
            "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/artworks/Couaxia/forme-3/Koleander_Ref_sheet2.png",

        alt:
            "Seconde tenue de Couaxia"
    },

    {
        title:
            "Corps et tatouages",

        description:
            "Morphologie, marques corporelles, tentacules et tatouages.",

        image:
            "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/artworks/Couaxia/forme-3/Koleander_Ref_sheet3.png",

        alt:
            "Référence du corps et des tatouages de Couaxia"
    }

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

        <header class="about-references__header">

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
                :key="reference.title"
                class="about-reference-card"
                :class="{
                    'about-reference-card--large':
                        reference.large
                }"
            >

                <!-- =========================================
                     IMAGE
                ========================================== -->

                <div class="about-reference-card__visual">

                    <img
                        :src="reference.image"
                        :alt="reference.alt"
                        class="about-reference-card__image"
                        loading="lazy"
                    >

                </div>


                <!-- =========================================
                     CAPTION
                ========================================== -->

                <figcaption class="about-reference-card__caption">

                    <strong class="about-reference-card__title">
                        {{ reference.title }}
                    </strong>


                    <span class="about-reference-card__description">
                        {{ reference.description }}
                    </span>

                </figcaption>

            </figure>

        </div>

    </section>

</template>