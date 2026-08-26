<script setup lang="ts">

/* =========================================================
   TYPES
========================================================= */

interface PreferenceItem {
    icon: string;
    title: string;
    items: string[];
}


/* =========================================================
   PREFERENCES
========================================================= */

const preferences: PreferenceItem[] = [

    {
        icon:
            "💬",

        title:
            "Ma personnalité",

        items: [
            "Positive et accueillante",
            "Curieuse",
            "Un peu chaotique",
            "Passionnée",
            "Proche de ma communauté",
            "Joyeuse et souriante",
            "Drôle",
            "Attachante"
        ]
    },

    {
        icon:
            "🎮",

        title:
            "Mes jeux",

        items: [
            "Jeux multijoueurs",
            "Jeux d’horreur",
            "Jeux narratifs",
            "Jeux de survie",
            "Jeux indépendants",
            "Et plein d’autres !"
        ]
    },

    {
        icon:
            "💎",

        title:
            "Mon univers",

        items: [
            "Avadora",
            "Les tentacules",
            "Mes compagnons : Natsu, Hylda et Cita",
            "Mes femmes",
            "Les créatures fantastiques",
            "Les aventures spatiales", 
            "Mes aventures sur Terre"
        ]
    }

];

</script>


<template>

    <section
        class="about-preferences"
        aria-labelledby="about-preferences-title"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header class="about-preferences__header">

            <p class="about-preferences__eyebrow">
                CE QUI ME CARACTÉRISE
            </p>


            <h2
                id="about-preferences-title"
                class="about-preferences__title"
            >
                Ma personnalité
                <span>
                    et mes préférences
                </span>
            </h2>


            <p class="about-preferences__description">
                Quelques petites choses qui permettent
                de mieux comprendre ma personnalité,
                mes goûts et l’univers de Couaxia.
            </p>

        </header>


        <!-- =================================================
             GRID
        ================================================== -->

        <div class="about-preferences__grid">

            <article
                v-for="preference in preferences"
                :key="preference.title"
                class="about-preference-card"
            >

                <!-- =========================================
                     HEADER
                ========================================== -->

                <header class="about-preference-card__header">

                    <div
                        class="about-preference-card__icon"
                        aria-hidden="true"
                    >
                        {{ preference.icon }}
                    </div>


                    <h3 class="about-preference-card__title">
                        {{ preference.title }}
                    </h3>

                </header>


                <!-- =========================================
                     LIST
                ========================================== -->

                <ul class="about-preference-card__list">

                    <li
                        v-for="item in preference.items"
                        :key="item"
                        class="about-preference-card__item"
                    >

                        <span
                            class="about-preference-card__bullet"
                            aria-hidden="true"
                        ></span>


                        <span>
                            {{ item }}
                        </span>

                    </li>

                </ul>

            </article>

        </div>

    </section>

</template>