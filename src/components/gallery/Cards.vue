<script setup lang="ts">

import {
    computed,
    ref
} from "vue";


/* =========================================================
   TYPES
========================================================= */

export interface CreditArtwork {

    id:
        string | number;

    title:
        string;

    imageUrl:
        string;

    artistName:
        string;

    artistHandle?:
        string | null;

    artistUrl?:
        string | null;

    artistRole?:
        string | null;

    category:
        string;

    subcategory?:
        string | null;

    description?:
        string | null;

    likes:
        number;

    liked:
        boolean;

    createdAt?:
        string | null;

    sensitive:
        boolean;

    mediaType:
        string;

    imageMessages:
        string[];

    buttonText:
        string;

    buttonMessages:
        string[];

}


/* =========================================================
   PROPS
========================================================= */

const props =
    defineProps<{
        artwork:
            CreditArtwork;
    }>();


/* =========================================================
   EMITS
========================================================= */

const emit =
    defineEmits<{
        (
            event: "toggle-like",
            artwork: CreditArtwork
        ): void;

        (
            event: "open",
            artwork: CreditArtwork
        ): void;
    }>();


/* =========================================================
   STATE
========================================================= */

const adultContentVisible =
    ref(false);


let mascotHoverTimer:
    number | null =
        null;


/* =========================================================
   MEDIA TYPE
========================================================= */

const isVideo =
    computed(
        () => {

            const type =
                props.artwork.mediaType
                    ?.toLowerCase()
                    .trim()
                ??
                "";


            const url =
                props.artwork.imageUrl
                    ?.toLowerCase()
                    .split("?")[0]
                ??
                "";


            return (
                type === "video"
                ||
                type === "mp4"
                ||
                type === "webm"
                ||
                type.startsWith("video/")
                ||
                url.endsWith(".mp4")
                ||
                url.endsWith(".webm")
            );

        }
    );


/* =========================================================
   CATEGORY LABEL
========================================================= */

const categoryLabel =
    computed(
        () => {

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
   RANDOM MESSAGE
========================================================= */

function getRandomMessage(
    messages:
        string[]
):
    string {

    if (
        !messages ||
        messages.length === 0
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
   CARD HOVER MESSAGE
========================================================= */

function startCardHoverMessage() {

    stopCardHoverMessage();


    const defaultMessages = [

        `Cette création vient de ${props.artwork.artistName} ! 🎨`,

        "Regarde-moi ce talent ! 💜",

        "Encore une superbe œuvre dans la galerie !",

        "Je pourrais passer des heures à regarder toutes ces créations ! 🐙"

    ];


    mascotHoverTimer =
        window.setTimeout(
            () => {

                const message =
                    getRandomMessage(
                        defaultMessages
                    );


                sendMascotMessage(
                    message
                );


                mascotHoverTimer =
                    null;

            },
            500
        );

}


/* =========================================================
   STOP CARD HOVER MESSAGE
========================================================= */

function stopCardHoverMessage() {

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
   OPEN
========================================================= */

function openArtwork() {

    if (
        props.artwork.sensitive &&
        !adultContentVisible.value
    ) {

        return;

    }


    emit(
        "open",
        props.artwork
    );

}


/* =========================================================
   REVEAL SENSITIVE CONTENT
========================================================= */

function revealAdultContent() {

    adultContentVisible.value =
        true;


    sendMascotMessage(
        "Contenu sensible affiché. 🔞"
    );

}


/* =========================================================
   LIKE
========================================================= */

function toggleLike() {

    emit(
        "toggle-like",
        props.artwork
    );

}


/* =========================================================
   ARTIST BUTTON MESSAGE
========================================================= */

function handleArtistButtonHover() {

    if (
        props.artwork.buttonMessages.length === 0
    ) {

        return;

    }


    stopCardHoverMessage();


    mascotHoverTimer =
        window.setTimeout(
            () => {

                const message =
                    getRandomMessage(
                        props.artwork.buttonMessages
                    );


                sendMascotMessage(
                    message
                );


                mascotHoverTimer =
                    null;

            },
            400
        );

}


/* =========================================================
   IMAGE MESSAGE
========================================================= */

function speakImageMessage() {

    if (
        props.artwork.imageMessages.length === 0
    ) {

        return;

    }


    const message =
        getRandomMessage(
            props.artwork.imageMessages
        );


    sendMascotMessage(
        message
    );

}

</script>


<template>

    <article
        class="credits-card"

        :class="{
            'credits-card--liked':
                artwork.liked
        }"

        @mouseenter="
            startCardHoverMessage
        "

        @mouseleave="
            stopCardHoverMessage
        "
    >

        <!-- =================================================
             VISUAL
        ================================================== -->

        <div
            class="credits-card__visual"

            :class="{
                'credits-card__visual--sensitive':
                    artwork.sensitive &&
                    !adultContentVisible,

                'credits-card__visual--revealed':
                    artwork.sensitive &&
                    adultContentVisible
            }"

            role="button"

            tabindex="0"

            :aria-label="
                artwork.sensitive &&
                !adultContentVisible
                    ? 'Contenu sensible masqué'
                    : `Ouvrir ${artwork.title}`
            "

            @click="
                openArtwork
            "

            @keydown.enter="
                openArtwork
            "

            @keydown.space.prevent="
                openArtwork
            "
        >

            <!-- =============================================
                 IMAGE
            ============================================== -->

            <img
                v-if="!isVideo"

                :src="
                    artwork.imageUrl
                "

                :alt="
                    artwork.title
                "

                class="credits-card__image"

                loading="lazy"

                draggable="false"

                @load="
                    () => {}
                "
            >


            <!-- =============================================
                 VIDEO — GIF MODE
            ============================================== -->

            <video
                v-else

                :src="
                    artwork.imageUrl
                "

                class="
                    credits-card__image
                    credits-card__video
                "

                autoplay
                loop
                muted
                playsinline

                preload="metadata"

                disablepictureinpicture
                disableremoteplayback

                draggable="false"

                @contextmenu.prevent
            ></video>


            <!-- =============================================
                 WATERMARK
            ============================================== -->

            <div
                class="credits-card__watermark"
                aria-hidden="true"
            >

                <img
                    src="https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/logo/Logo_Glow.png"

                    alt=""

                    draggable="false"
                >

            </div>


            <!-- =============================================
                 SENSITIVE OVERLAY
            ============================================== -->

            <div
                v-if="
                    artwork.sensitive &&
                    !adultContentVisible
                "

                class="
                    credits-card__sensitive-overlay
                "

                @click.stop="
                    revealAdultContent
                "
            >

                <span
                    class="
                        credits-card__sensitive-icon
                    "

                    aria-hidden="true"
                >
                    🔞
                </span>


                <strong
                    class="
                        credits-card__sensitive-title
                    "
                >
                    Contenu +18
                </strong>


                <p
                    class="
                        credits-card__sensitive-text
                    "
                >
                    Cette illustration contient du contenu
                    réservé à un public averti.
                </p>


                <button
                    type="button"

                    class="
                        credits-card__sensitive-button
                    "

                    @click.stop="
                        revealAdultContent
                    "
                >
                    👁 Afficher l'œuvre
                </button>

            </div>


            <!-- =============================================
                 CATEGORY
            ============================================== -->

            <span
                class="
                    credits-card__category
                "
            >
                ✨ {{ categoryLabel }}
            </span>


            <!-- =============================================
                 LIKE
            ============================================== -->

            <button
                type="button"

                class="
                    credits-card__like
                "

                :class="{
                    'credits-card__like--active':
                        artwork.liked
                }"

                :aria-pressed="
                    artwork.liked
                "

                :aria-label="
                    artwork.liked
                        ? 'Retirer des favoris'
                        : 'Ajouter aux favoris'
                "

                @click.stop="
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


                <strong>
                    {{ artwork.likes }}
                </strong>

            </button>

        </div>


        <!-- =================================================
             CONTENT
        ================================================== -->

        <div
            class="
                credits-card__content
            "
        >

            <!-- =============================================
                 ARTIST
            ============================================== -->

            <div
                class="
                    credits-card__artist
                "
            >

                <div
                    class="
                        credits-card__artist-icon
                    "

                    aria-hidden="true"
                >
                    🎨
                </div>


                <div
                    class="
                        credits-card__artist-info
                    "
                >

                    <h3
                        class="
                            credits-card__artist-name
                        "
                    >
                        {{ artwork.artistName }}
                    </h3>


                    <span
                        v-if="
                            artwork.artistRole
                        "

                        class="
                            credits-card__artist-role
                        "
                    >
                        {{ artwork.artistRole }}
                    </span>


                    <a
                        v-if="
                            artwork.artistHandle &&
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
                            credits-card__artist-handle
                        "

                        @mouseenter.stop="
                            handleArtistButtonHover
                        "

                        @mouseleave.stop="
                            stopCardHoverMessage
                        "
                    >
                        {{ artwork.artistHandle }}
                        ↗
                    </a>

                </div>

            </div>


            <!-- =============================================
                 DESCRIPTION
            ============================================== -->

            <p
                v-if="
                    artwork.description
                "

                class="
                    credits-card__description
                "
            >
                {{ artwork.description }}
            </p>


            <!-- =============================================
                 ARTIST LINK
            ============================================== -->

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
                    credits-card__artist-button
                "

                @mouseenter.stop="
                    handleArtistButtonHover
                "

                @mouseleave.stop="
                    stopCardHoverMessage
                "

                @focus="
                    handleArtistButtonHover
                "

                @blur="
                    stopCardHoverMessage
                "
            >

                <span>
                    {{
                        artwork.buttonText
                        ||
                        "Voir son profil artiste"
                    }}
                </span>


                <span
                    aria-hidden="true"
                >
                    ↗
                </span>

            </a>

        </div>

    </article>

</template>