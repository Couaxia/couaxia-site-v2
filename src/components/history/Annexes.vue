<script setup lang="ts">

import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref
} from "vue";


/* =========================================================
   TYPES
========================================================= */

export interface StoryAnnexePage {

    id:
        string;

    title?:
        string;

    subtitle?:
        string;

    text:
        string[];

    image?:
        string;

    imageAlt?:
        string;

}


export interface StoryAnnexe {

    id:
        string;

    number:
        string;

    title:
        string;

    subtitle:
        string;

    icon:
        string;

    pages:
        StoryAnnexePage[];

    messages:
        string[];

}


/* =========================================================
   PROPS
========================================================= */

const props =
    defineProps<{

        annexe:
            StoryAnnexe;

    }>();


/* =========================================================
   EMITS
========================================================= */

const emit =
    defineEmits<{

        close:
            [];

    }>();


/* =========================================================
   STATE
========================================================= */

const currentPageIndex =
    ref(
        0
    );


const displayedPageIndex =
    ref(
        0
    );


const targetPageIndex =
    ref(
        0
    );


const turning =
    ref(
        false
    );


const turnDirection =
    ref<
        "next" |
        "previous"
    >(
        "next"
    );


/* =========================================================
   MASCOT TIMER
========================================================= */

let mascotHoverTimer:
    number | null =
        null;


/* =========================================================
   CURRENT PAGE
========================================================= */

const currentPage =
    computed(
        () => {

            return (
                props.annexe.pages[
                    displayedPageIndex.value
                ]
                ??
                null
            );

        }
    );


/* =========================================================
   TARGET PAGE
========================================================= */

const targetPage =
    computed(
        () => {

            return (
                props.annexe.pages[
                    targetPageIndex.value
                ]
                ??
                null
            );

        }
    );


/* =========================================================
   TOTAL PAGES
========================================================= */

const totalPages =
    computed(
        () => {

            return (
                props.annexe.pages.length
            );

        }
    );


/* =========================================================
   PAGINATION
========================================================= */

const canGoPrevious =
    computed(
        () => {

            return (
                currentPageIndex.value >
                0
            );

        }
    );


const canGoNext =
    computed(
        () => {

            return (
                currentPageIndex.value <
                totalPages.value - 1
            );

        }
    );


/* =========================================================
   RANDOM MESSAGE
========================================================= */

function getRandomMessage(
    messages:
        string[]
):
    string {

    if (
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
   START MASCOT HOVER
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
            350
        );

}


/* =========================================================
   STOP MASCOT HOVER
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
   OPEN MESSAGE
========================================================= */

function speakAboutAnnexe() {

    startMascotHover(
        props.annexe.messages
    );

}


/* =========================================================
   PREVIOUS MESSAGE
========================================================= */

function speakAboutPrevious() {

    if (
        !canGoPrevious.value
    ) {

        return;

    }


    startMascotHover(
        [

            "Retour à la page précédente de l’annexe. 📖",

            "Tu veux relire un détail ?",

            "On remonte un peu dans les archives. 👀",

            `Retour à la page ${currentPageIndex.value}.`

        ]
    );

}


/* =========================================================
   NEXT MESSAGE
========================================================= */

function speakAboutNext() {

    if (
        !canGoNext.value
    ) {

        return;

    }


    startMascotHover(
        [

            "Encore une page d’archives à découvrir. 📖",

            "Tu continues à fouiller ? 👀",

            "La suite de l’annexe t’attend.",

            `Direction la page ${currentPageIndex.value + 2}.`

        ]
    );

}


/* =========================================================
   TURN PAGE
========================================================= */

async function turnPage(
    direction:
        "next" |
        "previous"
) {

    if (
        turning.value
    ) {

        return;

    }


    if (
        direction ===
            "next"
        &&
        !canGoNext.value
    ) {

        return;

    }


    if (
        direction ===
            "previous"
        &&
        !canGoPrevious.value
    ) {

        return;

    }


    turnDirection.value =
        direction;


    targetPageIndex.value =
        direction ===
            "next"
            ? currentPageIndex.value + 1
            : currentPageIndex.value - 1;


    turning.value =
        true;


    await nextTick();


    /*
     * Le contenu derrière la page change
     * au milieu de l'animation.
     */

    window.setTimeout(
        () => {

            displayedPageIndex.value =
                targetPageIndex.value;

        },
        460
    );


    /*
     * Fin de l'animation.
     */

    window.setTimeout(
        () => {

            currentPageIndex.value =
                targetPageIndex.value;


            turning.value =
                false;


            sendMascotMessage(
                getRandomMessage(
                    props.annexe.messages
                )
            );

        },
        920
    );

}


/* =========================================================
   CLOSE
========================================================= */

function closeAnnexe() {

    if (
        turning.value
    ) {

        return;

    }


    stopMascotHover();


    emit(
        "close"
    );

}


/* =========================================================
   KEYBOARD
========================================================= */

function handleKeydown(
    event:
        KeyboardEvent
) {

    if (
        event.key ===
        "Escape"
    ) {

        closeAnnexe();

        return;

    }


    if (
        event.key ===
        "ArrowRight"
    ) {

        turnPage(
            "next"
        );

        return;

    }


    if (
        event.key ===
        "ArrowLeft"
    ) {

        turnPage(
            "previous"
        );

    }

}


/* =========================================================
   MOUNT
========================================================= */

onMounted(
    () => {

        document.body.style.overflow =
            "hidden";


        window.addEventListener(
            "keydown",
            handleKeydown
        );


        sendMascotMessage(
            getRandomMessage(
                props.annexe.messages
            )
        );

    }
);


/* =========================================================
   CLEANUP
========================================================= */

onBeforeUnmount(
    () => {

        stopMascotHover();


        window.removeEventListener(
            "keydown",
            handleKeydown
        );


        document.body.style.overflow =
            "";

    }
);

</script>


<template>

    <Teleport to="body">

        <Transition
            name="
                history-annexe-book
            "
            appear
        >

            <div
                class="
                    history-annexe-book-lightbox
                "

                role="dialog"

                aria-modal="true"

                :aria-label="
                    `Annexe ${annexe.number} — ${annexe.title}`
                "

                @click.self="
                    closeAnnexe
                "
            >

                <!-- =================================================
                     WRAPPER
                ================================================== -->

                <div
                    class="
                        history-annexe-book-wrapper
                    "

                    tabindex="0"

                    @mouseenter="
                        speakAboutAnnexe
                    "

                    @mouseleave="
                        stopMascotHover()
                    "

                    @focus="
                        speakAboutAnnexe
                    "

                    @blur="
                        stopMascotHover()
                    "
                >

                    <!-- =============================================
                         CLOSE
                    ============================================== -->

                    <button
                        type="button"

                        class="
                            history-annexe-book__close
                        "

                        aria-label="
                            Fermer l’annexe
                        "

                        @click="
                            closeAnnexe
                        "
                    >
                        ×
                    </button>


                    <!-- =============================================
                         TOP LABEL
                    ============================================== -->

                    <div
                        class="
                            history-annexe-book__top
                        "
                    >

                        <span
                            aria-hidden="true"
                        >
                            {{ annexe.icon }}
                        </span>


                        <div>

                            <small>
                                ANNEXE
                                {{ annexe.number }}
                            </small>


                            <strong>
                                {{ annexe.title }}
                            </strong>

                        </div>

                    </div>


                    <!-- =================================================
                         BOOK SCENE
                    ================================================== -->

                    <div
                        class="
                            history-annexe-book__scene
                        "
                    >

                        <div
                            class="
                                history-annexe-book__book
                            "
                        >

                            <!-- =========================================
                                 LEFT PAGE
                            ========================================== -->

                            <article
                                v-if="
                                    currentPage
                                "

                                class="
                                    history-annexe-book__page
                                    history-annexe-book__page--left
                                "
                            >

                                <div
                                    class="
                                        history-annexe-book__page-inner
                                    "
                                >

                                    <!-- ANNEXE NUMBER -->

                                    <span
                                        class="
                                            history-annexe-book__number
                                        "
                                    >
                                        ANNEXE
                                        {{ annexe.number }}
                                    </span>


                                    <!-- SUBTITLE -->

                                    <p
                                        class="
                                            history-annexe-book__subtitle
                                        "
                                    >
                                        {{
                                            currentPage.subtitle
                                            ??
                                            annexe.subtitle
                                        }}
                                    </p>


                                    <!-- TITLE -->

                                    <h3
                                        class="
                                            history-annexe-book__title
                                        "
                                    >
                                        {{
                                            currentPage.title
                                            ??
                                            annexe.title
                                        }}
                                    </h3>


                                    <!-- =================================
                                         IMAGE
                                    ================================== -->

                                    <div
                                        v-if="
                                            currentPage.image
                                        "

                                        class="
                                            history-annexe-book__illustration
                                        "
                                    >

                                        <div
                                            class="
                                                history-annexe-book__image-glow
                                            "
                                            aria-hidden="true"
                                        ></div>


                                        <img
                                            :src="
                                                currentPage.image
                                            "

                                            :alt="
                                                currentPage.imageAlt
                                                ??
                                                currentPage.title
                                                ??
                                                annexe.title
                                            "

                                            class="
                                                history-annexe-book__image
                                            "
                                        >

                                    </div>


                                    <!-- =================================
                                         DECORATION
                                    ================================== -->

                                    <div
                                        v-else

                                        class="
                                            history-annexe-book__decoration
                                        "

                                        aria-hidden="true"
                                    >

                                        <span>
                                            {{ annexe.icon }}
                                        </span>


                                        <span>
                                            ✦
                                        </span>

                                    </div>


                                    <!-- PAGE NUMBER -->

                                    <span
                                        class="
                                            history-annexe-book__paper-number
                                        "
                                    >
                                        {{
                                            currentPageIndex
                                            *
                                            2
                                            +
                                            1
                                        }}
                                    </span>

                                </div>

                            </article>


                            <!-- =========================================
                                 SPINE
                            ========================================== -->

                            <div
                                class="
                                    history-annexe-book__spine
                                "

                                aria-hidden="true"
                            ></div>


                            <!-- =========================================
                                 RIGHT PAGE
                            ========================================== -->

                            <article
                                v-if="
                                    currentPage
                                "

                                class="
                                    history-annexe-book__page
                                    history-annexe-book__page--right
                                "
                            >

                                <div
                                    class="
                                        history-annexe-book__page-inner
                                    "
                                >

                                    <!-- =================================
                                         TEXT
                                    ================================== -->

                                    <div
                                        class="
                                            history-annexe-book__text
                                        "
                                    >

                                        <p
                                            v-for="(
                                                paragraph,
                                                index
                                            ) in currentPage.text"

                                            :key="
                                                `${currentPage.id}-${index}`
                                            "

                                            class="
                                                history-annexe-book__paragraph
                                            "
                                        >
                                            {{ paragraph }}
                                        </p>

                                    </div>


                                    <!-- PAGE NUMBER -->

                                    <span
                                        class="
                                            history-annexe-book__paper-number
                                        "
                                    >
                                        {{
                                            currentPageIndex
                                            *
                                            2
                                            +
                                            2
                                        }}
                                    </span>

                                </div>

                            </article>


                            <!-- =========================================
                                 TURNING SHEET
                            ========================================== -->

                            <div
                                v-if="
                                    turning &&
                                    currentPage &&
                                    targetPage
                                "

                                class="
                                    history-annexe-book__sheet
                                "

                                :class="[
                                    `history-annexe-book__sheet--${turnDirection}`
                                ]"

                                aria-hidden="true"
                            >

                                <!-- =====================================
                                     FRONT
                                ====================================== -->

                                <div
                                    class="
                                        history-annexe-book__sheet-face
                                        history-annexe-book__sheet-face--front
                                    "
                                >

                                    <div
                                        class="
                                            history-annexe-book__sheet-content
                                        "
                                    >

                                        <small>
                                            ANNEXE
                                            {{ annexe.number }}
                                        </small>


                                        <strong>
                                            {{
                                                currentPage.title
                                                ??
                                                annexe.title
                                            }}
                                        </strong>


                                        <span>
                                            {{
                                                currentPage.subtitle
                                                ??
                                                annexe.subtitle
                                            }}
                                        </span>

                                    </div>

                                </div>


                                <!-- =====================================
                                     BACK
                                ====================================== -->

                                <div
                                    class="
                                        history-annexe-book__sheet-face
                                        history-annexe-book__sheet-face--back
                                    "
                                >

                                    <div
                                        class="
                                            history-annexe-book__sheet-content
                                        "
                                    >

                                        <small>
                                            ANNEXE
                                            {{ annexe.number }}
                                        </small>


                                        <strong>
                                            {{
                                                targetPage.title
                                                ??
                                                annexe.title
                                            }}
                                        </strong>


                                        <span>
                                            {{
                                                targetPage.subtitle
                                                ??
                                                annexe.subtitle
                                            }}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    <!-- =================================================
                         NAVIGATION
                    ================================================== -->

                    <nav
                        class="
                            history-annexe-book__navigation
                        "

                        aria-label="
                            Navigation dans l’annexe
                        "
                    >

                        <!-- =============================================
                             PREVIOUS
                        ============================================== -->

                        <button
                            type="button"

                            class="
                                history-annexe-book__nav-button
                                history-annexe-book__nav-button--previous
                            "

                            :disabled="
                                !canGoPrevious ||
                                turning
                            "

                            @mouseenter="
                                speakAboutPrevious
                            "

                            @mouseleave="
                                stopMascotHover()
                            "

                            @focus="
                                speakAboutPrevious
                            "

                            @blur="
                                stopMascotHover()
                            "

                            @click="
                                turnPage(
                                    'previous'
                                )
                            "
                        >

                            <span
                                aria-hidden="true"
                            >
                                ←
                            </span>


                            <span>
                                Page précédente
                            </span>

                        </button>


                        <!-- =============================================
                             PAGINATION
                        ============================================== -->

                        <div
                            class="
                                history-annexe-book__pagination
                            "
                        >

                            <span>
                                Page
                            </span>


                            <strong>
                                {{ currentPageIndex + 1 }}
                            </strong>


                            <span>
                                /
                            </span>


                            <strong>
                                {{ totalPages }}
                            </strong>

                        </div>


                        <!-- =============================================
                             NEXT
                        ============================================== -->

                        <button
                            type="button"

                            class="
                                history-annexe-book__nav-button
                                history-annexe-book__nav-button--next
                            "

                            :disabled="
                                !canGoNext ||
                                turning
                            "

                            @mouseenter="
                                speakAboutNext
                            "

                            @mouseleave="
                                stopMascotHover()
                            "

                            @focus="
                                speakAboutNext
                            "

                            @blur="
                                stopMascotHover()
                            "

                            @click="
                                turnPage(
                                    'next'
                                )
                            "
                        >

                            <span>
                                Page suivante
                            </span>


                            <span
                                aria-hidden="true"
                            >
                                →
                            </span>

                        </button>

                    </nav>


                    <!-- =================================================
                         HELP
                    ================================================== -->

                    <p
                        class="
                            history-annexe-book__keyboard
                        "
                    >

                        <span
                            aria-hidden="true"
                        >
                            ⌨️
                        </span>

                        <span>
                            Utilise
                        </span>

                        <kbd>
                            ←
                        </kbd>

                        <kbd>
                            →
                        </kbd>

                        <span>
                            pour tourner les pages
                        </span>

                        <span>
                            et
                        </span>

                        <kbd>
                            Échap
                        </kbd>

                        <span>
                            pour fermer.
                        </span>

                    </p>

                </div>

            </div>

        </Transition>

    </Teleport>

</template>