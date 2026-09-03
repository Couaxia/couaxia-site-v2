<script setup lang="ts">

import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    watch
} from "vue";

import type {
    CreditArtwork
} from "./Cards.vue";


/* =========================================================
   PROPS
========================================================= */

const props =
    defineProps<{
        artwork:
            CreditArtwork;

        artworks:
            CreditArtwork[];
    }>();


/* =========================================================
   EMITS
========================================================= */

const emit =
    defineEmits<{
        (
            event: "close"
        ): void;

        (
            event: "previous"
        ): void;

        (
            event: "next"
        ): void;

        (
            event: "toggle-like",
            artwork: CreditArtwork
        ): void;
    }>();


/* =========================================================
   WATERMARK
========================================================= */

const watermarkUrl =
    "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/logo/Logo_Glow.png";


/* =========================================================
   POSITION
========================================================= */

const currentIndex =
    computed(
        () => {

            return props.artworks.findIndex(
                artwork =>
                    artwork.id ===
                    props.artwork.id
            );

        }
    );


const positionText =
    computed(
        () => {

            if (
                currentIndex.value ===
                -1
            ) {

                return (
                    `1 / ${props.artworks.length}`
                );

            }


            return (
                `${currentIndex.value + 1} / ${props.artworks.length}`
            );

        }
    );


/* =========================================================
   MEDIA TYPE
========================================================= */

const isVideo =
    computed(
        () => {

            const mediaType =
                props.artwork.mediaType
                    ?.trim()
                    .toLowerCase()
                ??
                "";


            const url =
                props.artwork.imageUrl
                    ?.toLowerCase()
                    .split("?")[0]
                ??
                "";


            return (
                mediaType === "video"
                ||
                mediaType === "mp4"
                ||
                mediaType === "webm"
                ||
                mediaType.startsWith(
                    "video/"
                )
                ||
                url.endsWith(
                    ".mp4"
                )
                ||
                url.endsWith(
                    ".webm"
                )
            );

        }
    );


/* =========================================================
   CATEGORY LABEL
========================================================= */

const categoryLabel =
    computed(
        () => {

            if (
                props.artwork.subcategory
            ) {

                return (
                    props.artwork.subcategory
                );

            }


            const labels:
                Record<string, string> = {

                    couaxia:
                        "Couaxia",

                    "forme-2":
                        "Forme 2",

                    "forme-3":
                        "Forme 3",

                    compagnons:
                        "Compagnons",

                    stream:
                        "Stream",

                    collab:
                        "Collab",

                    couple:
                        "Couple",

                    fanart:
                        "Fan Art"

                };


            return (
                labels[
                    props.artwork.category
                ]
                ??
                props.artwork.category
            );

        }
    );


/* =========================================================
   DATE
========================================================= */

const formattedDate =
    computed(
        () => {

            if (
                !props.artwork.createdAt
            ) {

                return null;

            }


            const date =
                new Date(
                    props.artwork.createdAt
                );


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return (
                    props.artwork.createdAt
                );

            }


            return new Intl.DateTimeFormat(
                "fr-FR",
                {
                    day:
                        "2-digit",

                    month:
                        "long",

                    year:
                        "numeric"
                }
            ).format(
                date
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
        !messages ||
        messages.length ===
        0
    ) {

        return "";

    }


    const randomIndex =
        Math.floor(
            Math.random() *
            messages.length
        );


    return (
        messages[
            randomIndex
        ]
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
   ARTWORK MESSAGE
========================================================= */

function speakArtworkMessage() {

    /*
     * Priorité aux messages personnalisés
     * provenant de Supabase.
     */

    if (
        props.artwork.imageMessages &&
        props.artwork.imageMessages.length >
            0
    ) {

        sendMascotMessage(
            getRandomMessage(
                props.artwork.imageMessages
            )
        );


        return;

    }


    /*
     * Fallback si aucun image_messages
     * n'est enregistré dans Supabase.
     */

    const defaultMessages = [

        `Regarde cette création de ${props.artwork.artistName} ! 🎨`,

        `Cette œuvre a été réalisée par ${props.artwork.artistName} ! 💜`,

        "Regarde-moi tous ces détails ! 👀",

        "Encore une création magnifique dans la galerie ! ✨",

        "Tu peux utiliser les flèches pour continuer la visite ! 🐙"

    ];


    sendMascotMessage(
        getRandomMessage(
            defaultMessages
        )
    );

}


/* =========================================================
   PREVIOUS
========================================================= */

function previousArtwork() {

    emit(
        "previous"
    );

}


/* =========================================================
   NEXT
========================================================= */

function nextArtwork() {

    emit(
        "next"
    );

}


/* =========================================================
   LIKE
========================================================= */

function toggleLike() {

    /*
     * On mémorise l'état AVANT le clic.
     *
     * false → l'utilisateur ajoute aux favoris
     * true  → l'utilisateur retire des favoris
     */

    const wasLiked =
        props.artwork.liked;


    emit(
        "toggle-like",
        props.artwork
    );


    /* =====================================================
       AJOUT AUX FAVORIS
    ===================================================== */

    if (
        !wasLiked
    ) {

        const likeMessages = [

            "Oh, tu aimes celle-là ? 👀💜",

            "Hop ! Dans tes favoris ! 💜",

            "Héhé, elle t'a tapé dans l'œil ? ✨",

            "Excellent choix ! Je valide aussi. 🐙💜",

            "Ooooh, celle-là mérite son petit cœur ! 💕",

            "Je vois que quelqu'un a du goût... 👀✨",

            "Et hop, directement dans tes favoris ! 💜",

            "Un petit cœur pour cette création ? Adorable ! 🥰"

        ];


        sendMascotMessage(
            getRandomMessage(
                likeMessages
            )
        );


        return;

    }


    /* =====================================================
       RETRAIT DES FAVORIS
    ===================================================== */

    const unlikeMessages = [

        "Oh... tu ne l'aimes plus ? 🥺",

        "Noooon ! Son petit cœur ! 💔",

        "Elle vient de perdre sa place dans tes favoris... 😭",

        "Aïe... le cœur vient de disparaître. 🥺",

        "Bon... je vais faire comme si je n'avais rien vu. 👀",

        "Un favori en moins... mes tentacules sont tristes. 🐙🥺",

        "Tu as changé d'avis ? Ça arrive ! 💜",

        "Et pouf ! Plus dans les favoris. 👋"

    ];


    sendMascotMessage(
        getRandomMessage(
            unlikeMessages
        )
    );

}


/* =========================================================
   ARTIST LINK MESSAGE
========================================================= */

function speakArtistMessage() {

    if (
        props.artwork.buttonMessages &&
        props.artwork.buttonMessages.length >
            0
    ) {

        sendMascotMessage(
            getRandomMessage(
                props.artwork.buttonMessages
            )
        );


        return;

    }


    sendMascotMessage(
        `Va jeter un œil au travail de ${props.artwork.artistName} ! 🎨`
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

        emit(
            "close"
        );


        return;

    }


    if (
        event.key ===
        "ArrowLeft"
    ) {

        event.preventDefault();


        previousArtwork();


        return;

    }


    if (
        event.key ===
        "ArrowRight"
    ) {

        event.preventDefault();


        nextArtwork();

    }

}


/* =========================================================
   WATCH ARTWORK
========================================================= */

watch(
    () =>
        props.artwork.id,

    async () => {

        await nextTick();


        /*
         * À chaque changement avec
         * précédent / suivant,
         * la mascotte lit image_messages.
         */

        speakArtworkMessage();

    }
);


/* =========================================================
   MOUNT
========================================================= */

onMounted(
    async () => {

        window.addEventListener(
            "keydown",
            handleKeydown
        );


        document.body.style.overflow =
            "hidden";


        await nextTick();


        speakArtworkMessage();

    }
);


/* =========================================================
   UNMOUNT
========================================================= */

onBeforeUnmount(
    () => {

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

        <div
            class="credits-lightbox"

            role="dialog"

            aria-modal="true"

            aria-label="Visionneuse d'œuvre"

            @click.self="
                emit(
                    'close'
                )
            "
        >

            <!-- =================================================
                 PANEL
            ================================================== -->

            <div class="credits-lightbox__panel">


                <!-- =============================================
                     TOP BAR
                ============================================== -->

                <div class="credits-lightbox__topbar">

                    <!-- COUNTER -->

                    <span
                        class="
                            credits-lightbox__counter
                        "
                    >
                        {{ positionText }}
                    </span>


                    <!-- ACTIONS -->

                    <div
                        class="
                            credits-lightbox__actions
                        "
                    >

                        <!-- LIKE -->

                        <button
                            type="button"

                            class="
                                credits-lightbox__action
                            "

                            :class="{
                                'credits-lightbox__action--liked':
                                    artwork.liked
                            }"

                            :aria-label="
                                artwork.liked
                                    ? 'Retirer des favoris'
                                    : 'Ajouter aux favoris'
                            "

                            :aria-pressed="
                                artwork.liked
                            "

                            @click="
                                toggleLike
                            "
                        >

                            <span aria-hidden="true">
                                {{
                                    artwork.liked
                                        ? "♥"
                                        : "♡"
                                }}
                            </span>

                        </button>


                        <!-- CLOSE -->

                        <button
                            type="button"

                            class="
                                credits-lightbox__action
                                credits-lightbox__action--close
                            "

                            aria-label="Fermer"

                            @click="
                                emit(
                                    'close'
                                )
                            "
                        >
                            ✕
                        </button>

                    </div>

                </div>


                <!-- =============================================
                     MAIN
                ============================================== -->

                <div
                    class="
                        credits-lightbox__main
                    "
                >

                    <!-- =========================================
                         PREVIOUS
                    ========================================== -->

                    <button
                        v-if="
                            artworks.length > 1
                        "

                        type="button"

                        class="
                            credits-lightbox__navigation
                            credits-lightbox__navigation--previous
                        "

                        aria-label="Œuvre précédente"

                        @click="
                            previousArtwork
                        "
                    >
                        ‹
                    </button>


                    <!-- =========================================
                         VISUAL
                    ========================================== -->

                    <div
                        class="
                            credits-lightbox__visual
                        "
                    >

                        <!-- IMAGE -->

                        <img
                            v-if="
                                !isVideo
                            "

                            :key="
                                artwork.id
                            "

                            :src="
                                artwork.imageUrl
                            "

                            :alt="
                                artwork.title
                            "

                            class="
                                credits-lightbox__image
                            "

                            draggable="false"
                        >


                        <!-- VIDEO -->

                        <video
                            v-else

                            :key="
                                artwork.id"

                            :src="
                                artwork.imageUrl
                            "

                            class="
                                credits-lightbox__image
                                credits-lightbox__video
                            "

                            autoplay
                            loop
                            muted
                            playsinline

                            preload="auto"

                            disablepictureinpicture
                            disableremoteplayback

                            @contextmenu.prevent
                        ></video>


                        <!-- WATERMARK -->

                        <div
                            class="
                                credits-lightbox__watermark
                            "

                            aria-hidden="true"
                        >

                            <img
                                :src="
                                    watermarkUrl
                                "

                                alt=""

                                draggable="false"
                            >

                        </div>

                    </div>


                    <!-- =========================================
                         NEXT
                    ========================================== -->

                    <button
                        v-if="
                            artworks.length > 1
                        "

                        type="button"

                        class="
                            credits-lightbox__navigation
                            credits-lightbox__navigation--next
                        "

                        aria-label="Œuvre suivante"

                        @click="
                            nextArtwork
                        "
                    >
                        ›
                    </button>

                </div>


                <!-- =============================================
                     INFORMATION
                ============================================== -->

                <div
                    class="
                        credits-lightbox__content
                    "
                >

                    <!-- =========================================
                         ARTIST
                    ========================================== -->

                    <div
                        class="
                            credits-lightbox__artist
                        "
                    >

                        <div
                            class="
                                credits-lightbox__artist-main
                            "
                        >

                            <span
                                class="
                                    credits-lightbox__artist-icon
                                "

                                aria-hidden="true"
                            >
                                🎨
                            </span>


                            <div
                                class="
                                    credits-lightbox__artist-info
                                "
                            >

                                <h2>
                                    {{ artwork.artistName }}
                                </h2>


                                <span
                                    v-if="
                                        artwork.artistRole
                                    "

                                    class="
                                        credits-lightbox__artist-role
                                    "
                                >
                                    {{ artwork.artistRole }}
                                </span>

                            </div>

                        </div>


                        <!-- ARTIST LINK -->

                        <a
                            v-if="
                                artwork.artistUrl
                            "

                            :href="
                                artwork.artistUrl
                            "

                            target="_blank"

                            rel="
                                noopener noreferrer
                            "

                            class="
                                credits-lightbox__artist-link
                            "

                            @mouseenter="
                                speakArtistMessage
                            "

                            @focus="
                                speakArtistMessage
                            "
                        >

                            <span>
                                {{
                                    artwork.buttonText
                                    ||
                                    "Voir son profil"
                                }}
                            </span>


                            <span aria-hidden="true">
                                ↗
                            </span>

                        </a>

                    </div>


                    <!-- =========================================
                         DESCRIPTION
                    ========================================== -->

                    <p
                        v-if="
                            artwork.description
                        "

                        class="
                            credits-lightbox__description
                        "
                    >
                        {{ artwork.description }}
                    </p>


                    <!-- =========================================
                         META
                    ========================================== -->

                    <div
                        class="
                            credits-lightbox__meta
                        "
                    >

                        <!-- CATEGORY -->

                        <div
                            class="
                                credits-lightbox__meta-item
                            "
                        >

                            <span>
                                Catégorie
                            </span>


                            <strong>
                                {{ categoryLabel }}
                            </strong>

                        </div>


                        <!-- LIKES -->

                        <div
                            class="
                                credits-lightbox__meta-item
                            "
                        >

                            <span>
                                Likes
                            </span>


                            <strong>
                                ♥ {{ artwork.likes }}
                            </strong>

                        </div>


                        <!-- DATE -->

                        <div
                            v-if="
                                formattedDate
                            "

                            class="
                                credits-lightbox__meta-item
                            "
                        >

                            <span>
                                Ajoutée le
                            </span>


                            <strong>
                                {{ formattedDate }}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </Teleport>

</template>