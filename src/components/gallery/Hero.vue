<script setup lang="ts">

import {
    onMounted
} from "vue";


/* =========================================================
   HERO IMAGE
========================================================= */

const heroImage =
    "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/mascotte/Artcreditsno.png";


/* =========================================================
   WELCOME MESSAGES
========================================================= */

const welcomeMessages = [

    "Bienvenue dans ma galerie ! 🎨💜",

    "Ici tu peux découvrir les artistes qui donnent vie à mon univers ! ✨",

    "Bienvenue dans les crédits ! N'hésite pas à explorer les différentes catégories. 🐙",

    "Regarde toutes ces créations ! Et surtout, pense à découvrir les artistes derrière chacune d'elles. 💜",

    "Chaque œuvre cache énormément de talent ! 🎨"

];


/* =========================================================
   IMAGE MESSAGES
========================================================= */

const imageMessages = [

    "Oui, je surveille la galerie depuis ici ! 👀",

    "Tu viens voir mon petit coin artistique ? 💜",

    "Beaucoup de belles créations se cachent juste en dessous !",

    "Attention, tu risques de rester longtemps dans cette galerie. 🐙"

];


/* =========================================================
   MASCOT
========================================================= */

function sendRandomMessage(
    messages:
        string[]
) {

    if (
        messages.length === 0
    ) {

        return;

    }


    const message =
        messages[
            Math.floor(
                Math.random() *
                messages.length
            )
        ];


    if (
        !message
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
   MOUNT
========================================================= */

onMounted(
    () => {

        window.setTimeout(
            () => {

                sendRandomMessage(
                    welcomeMessages
                );

            },
            700
        );

    }
);

</script>


<template>

    <section
        class="credits-hero"
        aria-labelledby="credits-hero-title"
    >

        <div class="credits-hero__content">

            <p class="credits-hero__eyebrow">
                🎨 GALERIE DES ARTISTES
            </p>


            <h1
                id="credits-hero-title"
                class="credits-hero__title"
            >
                Les Crédits
            </h1>


            <p class="credits-hero__description">

                Bienvenue dans ma galerie !
                Retrouve ici les artistes, illustrations,
                modèles et créations qui donnent vie
                à l’univers de Couaxia.

            </p>

        </div>


        <div
            class="credits-hero__visual-icon"

            tabindex="0"

            @mouseenter="
                sendRandomMessage(
                    imageMessages
                )
            "

            @focus="
                sendRandomMessage(
                    imageMessages
                )
            "
        >

            <img
                :src="heroImage"
                alt="Couaxia présentant la galerie des crédits"
                class="credits-hero__mascot"
                draggable="false"
            >

        </div>

    </section>

</template>