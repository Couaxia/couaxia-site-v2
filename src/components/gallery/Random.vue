<script setup lang="ts">

/* =========================================================
   MASCOT MESSAGES
========================================================= */

const randomMessages = [

    "Tu veux laisser le hasard choisir ? 🎲",

    "Voyons quelle œuvre le destin va te montrer ! 👀",

    "Attention... je décline toute responsabilité pour le choix du hasard ! 🐙",

    "Un petit coup de chance dans la galerie ? ✨",

    "Allez, clique ! On va voir ce que la galerie nous réserve. 💜"

];


/* =========================================================
   MASCOT
========================================================= */

function sendRandomMascotMessage() {

    if (
        randomMessages.length === 0
    ) {

        return;

    }


    const message =
        randomMessages[
            Math.floor(
                Math.random() *
                randomMessages.length
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
   RANDOM
========================================================= */

function chooseRandomArtwork() {

    window.dispatchEvent(
        new CustomEvent(
            "couaxia-credits-random"
        )
    );

}

</script>


<template>

    <section class="credits-random">

        <div class="credits-random__content">

            <div class="credits-random__icon">
                🎲
            </div>


            <div class="credits-random__text">

                <p class="credits-random__eyebrow">
                    UN PEU DE HASARD
                </p>


                <h2 class="credits-random__title">
                    Random Art
                </h2>


                <p class="credits-random__description">

                    Laisse le hasard choisir une œuvre
                    parmi la catégorie actuellement affichée.

                </p>

            </div>

        </div>


        <button
            type="button"
            class="credits-random__button"

            @mouseenter="
                sendRandomMascotMessage
            "

            @focus="
                sendRandomMascotMessage
            "

            @click="
                chooseRandomArtwork
            "
        >

            <span aria-hidden="true">
                🎲
            </span>

            <span>
                Choisir une œuvre
            </span>

        </button>

    </section>

</template>