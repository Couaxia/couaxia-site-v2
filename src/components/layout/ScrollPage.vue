<script setup lang="ts">

import {
    computed,
    onBeforeUnmount,
    onMounted,
    ref
} from "vue";


/* =========================================================
   STATE
========================================================= */

const scrollY =
    ref(
        0
    );


const documentHeight =
    ref(
        0
    );


const viewportHeight =
    ref(
        0
    );


/* =========================================================
   UPDATE SCROLL
========================================================= */

function updateScrollState() {

    scrollY.value =
        window.scrollY;


    viewportHeight.value =
        window.innerHeight;


    documentHeight.value =
        document.documentElement.scrollHeight;

}


/* =========================================================
   CAN SCROLL UP
========================================================= */

const canScrollUp =
    computed(
        () => {

            return (
                scrollY.value >
                20
            );

        }
    );


/* =========================================================
   CAN SCROLL DOWN
========================================================= */

const canScrollDown =
    computed(
        () => {

            const currentBottom =
                scrollY.value +
                viewportHeight.value;


            return (
                currentBottom <
                documentHeight.value -
                20
            );

        }
    );


/* =========================================================
   MASCOT MESSAGE
========================================================= */

function sendMascotMessage(
    message:
        string
) {

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
   SCROLL TOP
========================================================= */

function scrollToTop() {

    window.scrollTo(
        {
            top:
                0,

            behavior:
                "smooth"
        }
    );


    sendMascotMessage(
        "Et hop ! Retour en haut ! 🐙"
    );

}


/* =========================================================
   SCROLL BOTTOM
========================================================= */

function scrollToBottom() {

    window.scrollTo(
        {
            top:
                document.documentElement.scrollHeight,

            behavior:
                "smooth"
        }
    );


    sendMascotMessage(
        "Descends, il y a encore plein de choses à découvrir ! 👇"
    );

}


/* =========================================================
   MOUNT
========================================================= */

onMounted(
    () => {

        updateScrollState();


        window.addEventListener(
            "scroll",
            updateScrollState,
            {
                passive:
                    true
            }
        );


        window.addEventListener(
            "resize",
            updateScrollState
        );

    }
);


/* =========================================================
   UNMOUNT
========================================================= */

onBeforeUnmount(
    () => {

        window.removeEventListener(
            "scroll",
            updateScrollState
        );


        window.removeEventListener(
            "resize",
            updateScrollState
        );

    }
);

</script>


<template>

    <nav
        class="scroll-page"
        aria-label="Navigation rapide dans la page"
    >

        <!-- =================================================
             UP
        ================================================== -->

        <button
            type="button"

            class="
                scroll-page__button
                scroll-page__button--up
            "

            :class="{
                'scroll-page__button--disabled':
                    !canScrollUp
            }"

            :disabled="
                !canScrollUp
            "

            aria-label="Retour en haut de la page"
            title="Retour en haut"

            @click="
                scrollToTop
            "
        >

            <span
                class="scroll-page__arrow"
                aria-hidden="true"
            >
                ↑
            </span>

        </button>


        <!-- =================================================
             DOWN
        ================================================== -->

        <button
            type="button"

            class="
                scroll-page__button
                scroll-page__button--down
            "

            :class="{
                'scroll-page__button--disabled':
                    !canScrollDown
            }"

            :disabled="
                !canScrollDown
            "

            aria-label="Aller en bas de la page"
            title="Aller en bas"

            @click="
                scrollToBottom
            "
        >

            <span
                class="scroll-page__arrow"
                aria-hidden="true"
            >
                ↓
            </span>

        </button>

    </nav>

</template>


<style scoped>

/* =========================================================
   WRAPPER
========================================================= */

.scroll-page {

    position: fixed;

    right: 18px;
    bottom: 18px;

    z-index: 1900000000;

    display: flex;

    flex-direction: column;

    align-items: center;

    gap: 10px;

}


/* =========================================================
   BUTTON — MODE NUIT PAR DÉFAUT
========================================================= */

.scroll-page__button {

    position: relative;

    display: flex;

    align-items: center;
    justify-content: center;

    width: 50px;
    height: 50px;

    padding: 0;

    border:
        1px solid
        rgba(
            34,
            242,
            239,
            0.68
        );

    border-radius: 50%;

    background:
        radial-gradient(
            circle at 35% 24%,

            rgba(
                255,
                255,
                255,
                0.24
            )
            0%,

            rgba(
                98,
                46,
                140,
                0.95
            )
            38%,

            rgba(
                54,
                22,
                84,
                0.98
            )
            72%,

            rgba(
                27,
                10,
                47,
                1
            )
            100%
        );

    color:
        #ffffff;

    cursor: pointer;

    box-shadow:

        inset
        0
        0
        12px
        rgba(
            255,
            255,
            255,
            0.10
        ),

        0
        0
        0
        2px
        rgba(
            109,
            0,
            163,
            0.28
        ),

        0
        0
        14px
        rgba(
            34,
            242,
            239,
            0.26
        ),

        0
        7px
        18px
        rgba(
            0,
            0,
            0,
            0.34
        );

    backdrop-filter:
        blur(10px);

    -webkit-backdrop-filter:
        blur(10px);

    transition:
        transform 0.2s ease,
        border-color 0.2s ease,
        background 0.25s ease,
        box-shadow 0.25s ease,
        color 0.25s ease,
        opacity 0.2s ease;

}


/* =========================================================
   INNER BORDER
========================================================= */

.scroll-page__button::before {

    content: "";

    position: absolute;

    inset: 4px;

    border:
        1px solid
        rgba(
            255,
            255,
            255,
            0.10
        );

    border-radius: 50%;

    pointer-events: none;

}


/* =========================================================
   SMALL REFLECTION
========================================================= */

.scroll-page__button::after {

    content: "";

    position: absolute;

    top: 7px;
    left: 10px;

    width: 14px;
    height: 8px;

    border-radius: 50%;

    background:
        rgba(
            255,
            255,
            255,
            0.22
        );

    filter:
        blur(2px);

    transform:
        rotate(-25deg);

    pointer-events: none;

}


/* =========================================================
   HOVER — NIGHT
========================================================= */

.scroll-page__button:not(:disabled):hover {

    transform:
        translateY(-2px)
        scale(1.07);

    border-color:
        #22f2ef;

    background:
        radial-gradient(
            circle at 35% 24%,

            rgba(
                255,
                255,
                255,
                0.30
            )
            0%,

            rgba(
                132,
                47,
                173,
                0.98
            )
            40%,

            rgba(
                75,
                24,
                107,
                0.98
            )
            72%,

            rgba(
                36,
                10,
                57,
                1
            )
            100%
        );

    box-shadow:

        inset
        0
        0
        14px
        rgba(
            255,
            255,
            255,
            0.14
        ),

        0
        0
        0
        2px
        rgba(
            242,
            34,
            146,
            0.36
        ),

        0
        0
        20px
        rgba(
            34,
            242,
            239,
            0.42
        ),

        0
        8px
        20px
        rgba(
            0,
            0,
            0,
            0.38
        );

}


/* =========================================================
   ARROW
========================================================= */

.scroll-page__arrow {

    position: relative;

    z-index: 5;

    display: flex;

    align-items: center;
    justify-content: center;

    color:
        inherit;

    font-family:
        Arial,
        sans-serif;

    font-size: 1.45rem;
    font-weight: 300;

    line-height: 1;

    text-shadow:
        0
        0
        7px
        rgba(
            255,
            255,
            255,
            0.65
        );

}


/* =========================================================
   DISABLED
========================================================= */

.scroll-page__button:disabled {

    opacity: 0.34;

    cursor: default;

    filter:
        saturate(0.55);

}


/* =========================================================
   FOCUS
========================================================= */

.scroll-page__button:focus-visible {

    outline:
        3px solid
        #f22292;

    outline-offset:
        4px;

}


/* =========================================================
   MODE JOUR
========================================================= */

:global(html[data-theme="light"])
.scroll-page__button {

    border-color:
        rgba(
            199,
            81,
            231,
            0.68
        );

    background:
        radial-gradient(
            circle at 35% 24%,

            #ffffff
            0%,

            #fff8ff
            22%,

            #f6dff7
            48%,

            #e9c9ef
            73%,

            #ddb8e6
            100%
        );

    color:
        #6d00a3;

    box-shadow:

        inset
        0
        0
        12px
        rgba(
            255,
            255,
            255,
            0.95
        ),

        0
        0
        0
        2px
        rgba(
            242,
            34,
            146,
            0.10
        ),

        0
        0
        15px
        rgba(
            109,
            0,
            163,
            0.15
        ),

        0
        7px
        18px
        rgba(
            109,
            0,
            163,
            0.15
        );

}


/* =========================================================
   MODE JOUR — INNER BORDER
========================================================= */

:global(html[data-theme="light"])
.scroll-page__button::before {

    border-color:
        rgba(
            109,
            0,
            163,
            0.12
        );

}


/* =========================================================
   MODE JOUR — REFLECTION
========================================================= */

:global(html[data-theme="light"])
.scroll-page__button::after {

    background:
        rgba(
            255,
            255,
            255,
            0.85
        );

}


/* =========================================================
   MODE JOUR — ARROW
========================================================= */

:global(html[data-theme="light"])
.scroll-page__arrow {

    color:
        #6d00a3;

    text-shadow:
        0
        0
        7px
        rgba(
            109,
            0,
            163,
            0.18
        );

}


/* =========================================================
   MODE JOUR — HOVER
========================================================= */

:global(html[data-theme="light"])
.scroll-page__button:not(:disabled):hover {

    border-color:
        #f22292;

    color:
        #9f006c;

    background:
        radial-gradient(
            circle at 35% 24%,

            #ffffff
            0%,

            #fff5fb
            25%,

            #f9dcea
            50%,

            #efc3dd
            75%,

            #e4abcF
            100%
        );

    box-shadow:

        inset
        0
        0
        14px
        rgba(
            255,
            255,
            255,
            0.98
        ),

        0
        0
        0
        2px
        rgba(
            242,
            34,
            146,
            0.16
        ),

        0
        0
        20px
        rgba(
            242,
            34,
            146,
            0.25
        ),

        0
        8px
        20px
        rgba(
            109,
            0,
            163,
            0.16
        );

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 700px) {

    .scroll-page {

        right: 10px;
        bottom: 12px;

        gap: 8px;

    }


    .scroll-page__button {

        width: 44px;
        height: 44px;

    }


    .scroll-page__arrow {

        font-size: 1.2rem;

    }

}


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (
    prefers-reduced-motion:
        reduce
) {

    .scroll-page__button {

        transition: none;

    }

}

</style>