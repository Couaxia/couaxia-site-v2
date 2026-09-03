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


<style>

/* =========================================================
   RANDOM ART
========================================================= */

.credits-random {

    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: 2rem;

    width: 100%;

    padding: 1.8rem 2rem;

    margin: 2rem 0;

    border:
        2px solid
        rgba(
            109,
            0,
            163,
            0.7
        );

    border-radius: 24px;

    background:
        linear-gradient(
            135deg,
            rgba(
                109,
                0,
                163,
                0.18
            ),
            rgba(
                255,
                0,
                166,
                0.12
            ),
            rgba(
                34,
                242,
                239,
                0.08
            )
        );

    box-shadow:
        0 0 20px
        rgba(
            109,
            0,
            163,
            0.2
        ),
        0 8px 25px
        rgba(
            0,
            0,
            0,
            0.2
        );

    backdrop-filter:
        blur(
            10px
        );

    overflow: hidden;

    position: relative;

}


/* =========================================================
   BACKGROUND GLOW
========================================================= */

.credits-random::before {

    content: "";

    position: absolute;

    width: 220px;
    height: 220px;

    top: -100px;
    left: -70px;

    border-radius: 50%;

    background:
        radial-gradient(
            circle,
            rgba(
                255,
                0,
                166,
                0.3
            ),
            transparent 70%
        );

    pointer-events: none;

}


.credits-random::after {

    content: "";

    position: absolute;

    width: 200px;
    height: 200px;

    right: -70px;
    bottom: -100px;

    border-radius: 50%;

    background:
        radial-gradient(
            circle,
            rgba(
                34,
                242,
                239,
                0.22
            ),
            transparent 70%
        );

    pointer-events: none;

}


/* =========================================================
   CONTENT
========================================================= */

.credits-random__content {

    display: flex;
    align-items: center;

    gap: 1.3rem;

    position: relative;

    z-index: 2;

}


/* =========================================================
   ICON
========================================================= */

.credits-random__icon {

    display: flex;
    align-items: center;
    justify-content: center;

    flex-shrink: 0;

    width: 72px;
    height: 72px;

    border-radius: 20px;

    font-size: 2rem;

    background:
        linear-gradient(
            135deg,
            rgba(
                255,
                0,
                166,
                0.25
            ),
            rgba(
                109,
                0,
                163,
                0.35
            )
        );

    border:
        1px solid
        rgba(
            255,
            255,
            255,
            0.15
        );

    box-shadow:
        0 0 15px
        rgba(
            255,
            0,
            166,
            0.3
        );

    animation:
        random-dice-float
        3s
        ease-in-out
        infinite;

}


/* =========================================================
   TEXT
========================================================= */

.credits-random__text {

    display: flex;
    flex-direction: column;

    gap: 0.25rem;

}


.credits-random__eyebrow {

    margin: 0;

    font-size: 0.72rem;
    font-weight: 800;

    letter-spacing: 0.18em;

    color: #22f2ef;

}


.credits-random__title {

    margin: 0;

    font-size: 1.7rem;
    font-weight: 900;

    color: #ffffff;

    text-shadow:
        0 0 12px
        rgba(
            255,
            0,
            166,
            0.4
        );

}


.credits-random__description {

    margin:
        0.35rem
        0
        0;

    max-width: 600px;

    line-height: 1.6;

    color:
        rgba(
            255,
            255,
            255,
            0.75
        );

}


/* =========================================================
   BUTTON
========================================================= */

.credits-random__button {

    display: inline-flex;

    align-items: center;
    justify-content: center;

    gap: 0.7rem;

    flex-shrink: 0;

    min-height: 50px;

    padding:
        0.9rem
        1.4rem;

    border: none;

    border-radius: 16px;

    font-size: 0.95rem;

    font-weight: 800;

    color: #ffffff;

    cursor: pointer;

    position: relative;

    z-index: 2;

    background:
        linear-gradient(
            135deg,
            #6d00a3,
            #ff00a6
        );

    box-shadow:
        0 0 12px
        rgba(
            255,
            0,
            166,
            0.35
        ),
        0 0 25px
        rgba(
            109,
            0,
            163,
            0.3
        );

    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        filter 0.2s ease;

}


/* =========================================================
   BUTTON HOVER
========================================================= */

.credits-random__button:hover {

    transform:
        translateY(
            -3px
        )
        scale(
            1.03
        );

    filter:
        brightness(
            1.1
        );

    box-shadow:
        0 0 18px
        rgba(
            255,
            0,
            166,
            0.8
        ),
        0 0 35px
        rgba(
            109,
            0,
            163,
            0.75
        ),
        0 0 50px
        rgba(
            34,
            242,
            239,
            0.35
        );

}


/* =========================================================
   BUTTON FOCUS
========================================================= */

.credits-random__button:focus-visible {

    outline:
        3px solid
        #22f2ef;

    outline-offset:
        4px;

}


/* =========================================================
   BUTTON CLICK
========================================================= */

.credits-random__button:active {

    transform:
        translateY(
            0
        )
        scale(
            0.97
        );

}


/* =========================================================
   DICE ANIMATION
========================================================= */

@keyframes random-dice-float {

    0%,
    100% {

        transform:
            translateY(
                0
            )
            rotate(
                0deg
            );

    }


    50% {

        transform:
            translateY(
                -6px
            )
            rotate(
                8deg
            );

    }

}


/* =========================================================
   RANDOM SELECTED ARTWORK
========================================================= */

/*
 * Cette classe doit être appliquée à la carte
 * choisie par le système Random Art.
 */

.credits-card--random-selected {

    position: relative;

    z-index: 20;

    transform:
        scale(
            1.045
        );

    box-shadow:
        0 0 10px
        rgba(
            255,
            255,
            255,
            0.95
        ),
        0 0 20px
        rgba(
            255,
            0,
            166,
            1
        ),
        0 0 40px
        rgba(
            109,
            0,
            163,
            0.95
        ),
        0 0 65px
        rgba(
            34,
            242,
            239,
            0.7
        );

    animation:
        random-selected-glow
        1s
        ease-in-out
        infinite
        alternate;

}


/* =========================================================
   RANDOM SELECTED ARTWORK BORDER
========================================================= */

.credits-card--random-selected::after {

    content: "";

    position: absolute;

    inset: -4px;

    border-radius: inherit;

    border:
        3px solid
        rgba(
            255,
            0,
            166,
            0.9
        );

    box-shadow:
        inset
        0 0 12px
        rgba(
            34,
            242,
            239,
            0.5
        );

    pointer-events: none;

    z-index: 30;

}


/* =========================================================
   RANDOM SELECTED ANIMATION
========================================================= */

@keyframes random-selected-glow {

    from {

        transform:
            scale(
                1.035
            );

        filter:
            brightness(
                1
            );

        box-shadow:
            0 0 10px
            rgba(
                255,
                255,
                255,
                0.8
            ),
            0 0 20px
            rgba(
                255,
                0,
                166,
                0.8
            ),
            0 0 35px
            rgba(
                109,
                0,
                163,
                0.75
            ),
            0 0 50px
            rgba(
                34,
                242,
                239,
                0.45
            );

    }


    to {

        transform:
            scale(
                1.055
            );

        filter:
            brightness(
                1.18
            );

        box-shadow:
            0 0 15px
            rgba(
                255,
                255,
                255,
                1
            ),
            0 0 30px
            rgba(
                255,
                0,
                166,
                1
            ),
            0 0 55px
            rgba(
                109,
                0,
                163,
                1
            ),
            0 0 80px
            rgba(
                34,
                242,
                239,
                0.7
            );

    }

}


/* =========================================================
   LIGHT MODE
========================================================= */

html[data-theme="light"]
.credits-random {

    background:
        linear-gradient(
            135deg,
            rgba(
                109,
                0,
                163,
                0.08
            ),
            rgba(
                255,
                0,
                166,
                0.08
            ),
            rgba(
                34,
                242,
                239,
                0.08
            )
        );

    border-color:
        rgba(
            109,
            0,
            163,
            0.35
        );

    box-shadow:
        0 8px 25px
        rgba(
            109,
            0,
            163,
            0.12
        );

}


html[data-theme="light"]
.credits-random__title {

    color: #6d00a3;

    text-shadow: none;

}


html[data-theme="light"]
.credits-random__description {

    color:
        rgba(
            30,
            20,
            40,
            0.75
        );

}


/* =========================================================
   LIGHT MODE - SELECTED ART
========================================================= */

html[data-theme="light"]
.credits-card--random-selected {

    box-shadow:
        0 0 12px
        rgba(
            255,
            255,
            255,
            1
        ),
        0 0 25px
        rgba(
            255,
            0,
            166,
            0.95
        ),
        0 0 45px
        rgba(
            109,
            0,
            163,
            0.8
        ),
        0 0 70px
        rgba(
            34,
            242,
            239,
            0.55
        );

}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (
    max-width: 850px
) {

    .credits-random {

        flex-direction:
            column;

        align-items:
            stretch;

        padding:
            1.5rem;

    }


    .credits-random__button {

        width:
            100%;

    }

}


@media (
    max-width: 550px
) {

    .credits-random__content {

        align-items:
            flex-start;

    }


    .credits-random__icon {

        width:
            58px;

        height:
            58px;

        border-radius:
            16px;

        font-size:
            1.6rem;

    }


    .credits-random__title {

        font-size:
            1.4rem;

    }


    .credits-random__description {

        font-size:
            0.9rem;

    }


    .credits-card--random-selected {

        transform:
            scale(
                1.02
            );

    }

}


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (
    prefers-reduced-motion:
    reduce
) {

    .credits-random__icon {

        animation:
            none;

    }


    .credits-card--random-selected {

        animation:
            none;

    }

}

</style>