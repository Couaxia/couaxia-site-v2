<script setup lang="ts">

import {
    computed,
    onBeforeUnmount,
    onMounted,
    ref
} from "vue";

import "../../assets/styles/components/mascot.css";


/* =========================================================
   TYPES
========================================================= */

type MascotExpression =
    | "idle"
    | "talking";


interface MascotMessageDetail {

    message:
        string;

    expression?:
        MascotExpression;

    duration?:
        number;

}


/* =========================================================
   MASCOT IMAGES
========================================================= */

const mascotImages:
    Record<
        MascotExpression,
        string
    > = {

        idle:
            "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/mascotte/Discord-reactive-Mute.gif",

        talking:
            "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/mascotte/Discord-reactive-Talk.gif"

    };


/* =========================================================
   DEFAULT MESSAGES
========================================================= */

const defaultMessages = [

    "Coucou ! 🐙",

    "Tu explores encore le site ? 👀",

    "Je suis toujours dans le coin ! 💜",

    "Besoin d'un peu de compagnie ?",

    "Attention aux tentacules ! 🐙",

    "Tu as trouvé quelque chose d'intéressant ?",

    "Il y a encore plein de choses à découvrir ! ✨"

];


/* =========================================================
   STATE
========================================================= */

const currentMessage =
    ref<string | null>(
        null
    );


const isVisible =
    ref(
        false
    );


const expression =
    ref<MascotExpression>(
        "idle"
    );


let hideTimer:
    number | null =
        null;


/* =========================================================
   CURRENT IMAGE
========================================================= */

const currentMascotImage =
    computed(
        () => {

            return (
                mascotImages[
                    expression.value
                ]
                ??
                mascotImages.idle
            );

        }
    );


/* =========================================================
   PRELOAD MASCOT IMAGES
========================================================= */

function preloadMascotImages() {

    Object
        .values(
            mascotImages
        )
        .forEach(
            imageUrl => {

                const image =
                    new Image();


                image.decoding =
                    "async";


                image.src =
                    imageUrl;

            }
        );

}


/* =========================================================
   RANDOM
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
   CLEAR TIMER
========================================================= */

function clearHideTimer() {

    if (
        hideTimer ===
        null
    ) {

        return;

    }


    window.clearTimeout(
        hideTimer
    );


    hideTimer =
        null;

}


/* =========================================================
   SHOW MESSAGE
========================================================= */

function showMessage(
    message:
        string,

    requestedExpression:
        MascotExpression =
            "talking",

    duration:
        number =
            6500
) {

    if (
        !message
        ||
        !message.trim()
    ) {

        return;

    }


    clearHideTimer();


    currentMessage.value =
        message;


    isVisible.value =
        true;


    expression.value =
        requestedExpression;


    hideTimer =
        window.setTimeout(
            () => {

                isVisible.value =
                    false;


                expression.value =
                    "idle";


                hideTimer =
                    null;

            },
            duration
        );

}


/* =========================================================
   GLOBAL EVENT
========================================================= */

function handleMascotMessage(
    event:
        Event
) {

    const customEvent =
        event as CustomEvent<
            MascotMessageDetail
        >;


    const detail =
        customEvent.detail;


    if (
        !detail
        ||
        !detail.message
    ) {

        return;

    }


    showMessage(
        detail.message,

        detail.expression
        ??
        "talking",

        detail.duration
        ??
        6500
    );

}


/* =========================================================
   CLICK MASCOT
========================================================= */

function speakRandomMessage() {

    const message =
        getRandomMessage(
            defaultMessages
        );


    showMessage(
        message,
        "talking"
    );

}


/* =========================================================
   CLOSE MESSAGE
========================================================= */

function closeMessage() {

    clearHideTimer();


    isVisible.value =
        false;


    expression.value =
        "idle";

}


/* =========================================================
   MOUNT
========================================================= */

onMounted(
    () => {

        /*
         * Charge les deux GIF une seule fois au démarrage
         * du composant.
         *
         * Les changements idle / talking réutilisent ensuite
         * les fichiers déjà présents dans le cache navigateur.
         */
        preloadMascotImages();


        window.addEventListener(
            "couaxia-mascot-message",
            handleMascotMessage
        );

    }
);


/* =========================================================
   UNMOUNT
========================================================= */

onBeforeUnmount(
    () => {

        window.removeEventListener(
            "couaxia-mascot-message",
            handleMascotMessage
        );


        clearHideTimer();

    }
);

</script>


<template>

    <div
        class="mascot-widget"
        :class="[
            `mascot-widget--${expression}`
        ]"
    >

        <Transition
            name="mascot-bubble"
        >

            <div
                v-if="
                    isVisible
                    &&
                    currentMessage
                "
                class="mascot-widget__bubble"
                role="status"
                aria-live="polite"
            >

                <button
                    type="button"
                    class="mascot-widget__close"
                    aria-label="Fermer le message"
                    @click="
                        closeMessage
                    "
                >
                    ×
                </button>


                <span
                    class="mascot-widget__name"
                >
                    🐙 Couaxia
                </span>


                <p
                    class="mascot-widget__message"
                >
                    {{ currentMessage }}
                </p>

            </div>

        </Transition>


        <button
            type="button"
            class="mascot-widget__character"
            aria-label="Faire parler Couaxia"
            @click="
                speakRandomMessage
            "
        >

            <img
                :src="
                    currentMascotImage
                "
                alt="Mascotte Couaxia"
                class="mascot-widget__image"
                decoding="async"
                fetchpriority="low"
                draggable="false"
            >

        </button>

    </div>

</template>