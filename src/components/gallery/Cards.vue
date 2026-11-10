<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from "vue";
import type { ArtistCredit } from "../../types/artist-credit.types";

/* =========================================================
   TYPES
========================================================= */

export interface CreditArtwork {
    id: string | number;
    title: string;
    imageUrl: string;

    artistName: string;
    artistHandle?: string | null;
    artistUrl?: string | null;
    artistRole?: string | null;

    artistCredits?: ArtistCredit[];

    category: string;
    subcategory?: string | null;
    description?: string | null;

    likes: number;
    liked: boolean;

    createdAt?: string | null;
    sensitive: boolean;
    mediaType: string;

    imageMessages: string[];
    buttonText: string;
    buttonMessages: string[];
}

/* =========================================================
   PROPS
========================================================= */

const props = defineProps<{
    artwork: CreditArtwork;
    randomSelected?: boolean;
}>();

/* =========================================================
   CRÉDITS ARTISTIQUES MULTIPLES
========================================================= */

const displayedArtistCredits = computed<ArtistCredit[]>(() => {
    const credits = props.artwork.artistCredits;

    if (credits?.length) {
        return [...credits].sort(
            (a, b) => a.sortOrder - b.sortOrder
        );
    }

    // Compatibilité avec les anciennes illustrations
    const artistName = props.artwork.artistName?.trim();

    if (!artistName) {
        return [];
    }

    return [
        {
            artistName,
            contribution: props.artwork.artistRole ?? "",
            links: props.artwork.artistUrl
                ? [
                      {
                          label:
                              props.artwork.artistHandle ||
                              props.artwork.buttonText ||
                              "Profil artiste",
                          url: props.artwork.artistUrl
                      }
                  ]
                : [],
            sortOrder: 0
        }
    ];
});

/* =========================================================
   EMITS
========================================================= */

const emit = defineEmits<{
    (event: "toggle-like", artwork: CreditArtwork): void;
    (event: "open", artwork: CreditArtwork): void;
}>();

/* =========================================================
   STATE
========================================================= */

const adultContentVisible = ref(false);

let mascotHoverTimer: number | null = null;

/* =========================================================
   MEDIA TYPE
========================================================= */

const isVideo = computed(() => {
    const type =
        props.artwork.mediaType
            ?.toLowerCase()
            .trim() ?? "";

    const url =
        props.artwork.imageUrl
            ?.toLowerCase()
            .split("?")[0] ?? "";

    return (
        type === "video" ||
        type === "mp4" ||
        type === "webm" ||
        type.startsWith("video/") ||
        url.endsWith(".mp4") ||
        url.endsWith(".webm") ||
        url.endsWith(".mov") ||
        url.endsWith(".m4v")
    );
});

/* =========================================================
   CATEGORY LABEL
========================================================= */

const categoryLabel = computed(() => {
    const labels: Record<string, string> = {
        couaxia: "Couaxia",
        "forme-2": "Forme 2",
        "forme-3": "Forme 3",
        compagnons: "Compagnons",
        stream: "Stream",
        collab: "Collab",
        couple: "Couple",
        fanart: "Fan Art"
    };

    return (
        labels[props.artwork.category] ??
        props.artwork.category
    );
});

/* =========================================================
   RANDOM MESSAGE
========================================================= */

function getRandomMessage(messages: string[]): string {
    if (!messages?.length) {
        return "";
    }

    const randomIndex = Math.floor(
        Math.random() * messages.length
    );

    return messages[randomIndex] ?? "";
}

/* =========================================================
   SEND MASCOT MESSAGE
========================================================= */

function sendMascotMessage(message: string) {
    if (!message.trim()) {
        return;
    }

    window.dispatchEvent(
        new CustomEvent("couaxia-mascot-message", {
            detail: {
                message
            }
        })
    );
}

/* =========================================================
   STOP CARD HOVER MESSAGE
========================================================= */

function stopCardHoverMessage() {
    if (mascotHoverTimer === null) {
        return;
    }

    window.clearTimeout(mascotHoverTimer);

    mascotHoverTimer = null;
}

/* =========================================================
   CARD HOVER MESSAGE
========================================================= */

function startCardHoverMessage() {
    stopCardHoverMessage();

    const artistNames = displayedArtistCredits.value
        .map((credit) => credit.artistName)
        .filter(Boolean);

    const artistText =
        artistNames.join(" et ") ||
        "des artistes talentueux";

    const defaultMessages = [
        `Cette création vient de ${artistText} ! 🎨`,
        "Regarde-moi ce talent ! 💜",
        "Encore une superbe œuvre dans la galerie !",
        "Je pourrais passer des heures à regarder toutes ces créations ! 🐙"
    ];

    mascotHoverTimer = window.setTimeout(() => {
        sendMascotMessage(
            getRandomMessage(defaultMessages)
        );

        mascotHoverTimer = null;
    }, 500);
}

/* =========================================================
   IMAGE MESSAGE
========================================================= */

function speakImageMessage() {
    stopCardHoverMessage();

    if (!props.artwork.imageMessages?.length) {
        startCardHoverMessage();
        return;
    }

    mascotHoverTimer = window.setTimeout(() => {
        sendMascotMessage(
            getRandomMessage(props.artwork.imageMessages)
        );

        mascotHoverTimer = null;
    }, 400);
}

/* =========================================================
   OPEN ARTWORK
========================================================= */

function openArtwork() {
    if (
        props.artwork.sensitive &&
        !adultContentVisible.value
    ) {
        return;
    }

    emit("open", props.artwork);
}

/* =========================================================
   REVEAL SENSITIVE CONTENT
========================================================= */

function revealAdultContent() {
    adultContentVisible.value = true;

    sendMascotMessage(
        "Contenu sensible affiché. 🔞"
    );
}

/* =========================================================
   LIKE
========================================================= */

function toggleLike() {
    const wasLiked = props.artwork.liked;

    emit("toggle-like", props.artwork);

    if (!wasLiked) {
        const likeMessages = [
            "Oh, tu aimes celle-là ? 👀💜",
            "Hop ! Une création de plus dans tes favoris ! 💜",
            "Héhé, celle-ci t'a tapé dans l'œil ? ✨",
            "Excellent choix ! Je valide aussi. 🐙💜",
            "Ooooh, celle-là mérite un petit cœur ! 💕",
            "Je vois que quelqu'un a du goût... 👀✨",
            "Et hop, directement dans tes favoris ! 💜",
            "Un petit cœur pour cette création ? Adorable ! 🥰"
        ];

        sendMascotMessage(
            getRandomMessage(likeMessages)
        );

        return;
    }

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
        getRandomMessage(unlikeMessages)
    );
}

/* =========================================================
   ARTIST BUTTON MESSAGE
========================================================= */

function handleArtistButtonHover() {
    stopCardHoverMessage();

    if (!props.artwork.buttonMessages?.length) {
        const artistNames = displayedArtistCredits.value
            .map((credit) => credit.artistName)
            .filter(Boolean);

        const artistText =
            artistNames.join(" et ") ||
            "ces artistes";

        const fallbackMessages = [
            `Tu veux découvrir le travail de ${artistText} ? 🎨`,
            `Va jeter un œil aux profils de ${artistText} ! 💜`,
            "N'hésite pas à soutenir les artistes ! ✨"
        ];

        mascotHoverTimer = window.setTimeout(() => {
            sendMascotMessage(
                getRandomMessage(fallbackMessages)
            );

            mascotHoverTimer = null;
        }, 400);

        return;
    }

    mascotHoverTimer = window.setTimeout(() => {
        sendMascotMessage(
            getRandomMessage(props.artwork.buttonMessages)
        );

        mascotHoverTimer = null;
    }, 400);
}

/* =========================================================
   CLEANUP
========================================================= */

onBeforeUnmount(() => {
    stopCardHoverMessage();
});
</script>

<template>
    <article
        class="credits-card"
        :class="{
            'credits-card--liked': artwork.liked,
            'credits-card--random-selected':
                props.randomSelected === true
        }"
        @mouseenter="startCardHoverMessage"
        @mouseleave="stopCardHoverMessage"
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
            @mouseenter.stop="speakImageMessage"
            @mouseleave.stop="stopCardHoverMessage"
            @focus="speakImageMessage"
            @blur="stopCardHoverMessage"
            @click="openArtwork"
            @keydown.enter="openArtwork"
            @keydown.space.prevent="openArtwork"
        >
            <!-- =============================================
                 IMAGE
            ============================================== -->

            <img
                v-if="!isVideo"
                :src="artwork.imageUrl"
                :alt="artwork.title"
                class="credits-card__image"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                draggable="false"
            />

            <!-- =============================================
                 VIDEO
            ============================================== -->

            <video
                v-else
                :src="artwork.imageUrl"
                class="credits-card__image credits-card__video"
                autoplay
                muted
                loop
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
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                />
            </div>

            <!-- =============================================
                 SENSITIVE OVERLAY
            ============================================== -->

            <div
                v-if="
                    artwork.sensitive &&
                    !adultContentVisible
                "
                class="credits-card__sensitive-overlay"
                @click.stop="revealAdultContent"
            >
                <span
                    class="credits-card__sensitive-icon"
                    aria-hidden="true"
                >
                    🔞
                </span>

                <strong
                    class="credits-card__sensitive-title"
                >
                    Contenu +18
                </strong>

                <p
                    class="credits-card__sensitive-text"
                >
                    Cette illustration contient du contenu
                    réservé à un public averti.
                </p>

                <button
                    type="button"
                    class="credits-card__sensitive-button"
                    @click.stop="revealAdultContent"
                >
                    👁 Afficher l'œuvre
                </button>
            </div>

            <!-- =============================================
                 CATEGORY
            ============================================== -->

            <span class="credits-card__category">
                ✨ {{ categoryLabel }}
            </span>

            <!-- =============================================
                 LIKE
            ============================================== -->

            <button
                type="button"
                class="credits-card__like"
                :class="{
                    'credits-card__like--active':
                        artwork.liked
                }"
                :aria-pressed="artwork.liked"
                :aria-label="
                    artwork.liked
                        ? 'Retirer des favoris'
                        : 'Ajouter aux favoris'
                "
                @click.stop="toggleLike"
            >
                <span aria-hidden="true">
                    {{ artwork.liked ? "♥" : "♡" }}
                </span>

                <strong>
                    {{ artwork.likes }}
                </strong>
            </button>
        </div>

        <!-- =================================================
             CONTENT
        ================================================== -->

        <div class="credits-card__content">

            <!-- =============================================
                 ARTISTES MULTIPLES
            ============================================== -->

            <div
                v-if="displayedArtistCredits.length"
                class="credits-card__artist"
            >
                <div
                    class="credits-card__artist-icon"
                    aria-hidden="true"
                >
                    🎨
                </div>

                <div class="credits-card__artist-info">

                    <div
                        v-for="(credit, index) in displayedArtistCredits"
                        :key="
                            credit.id ??
                            `${credit.artistName}-${index}`
                        "
                        class="credits-card__artist-entry"
                    >
                        <!-- NOM -->

                        <h3 class="credits-card__artist-name">
                            {{ credit.artistName }}
                        </h3>

                        <!-- CONTRIBUTION -->

                        <span
                            v-if="credit.contribution"
                            class="credits-card__artist-role"
                        >
                            {{ credit.contribution }}
                        </span>

                        <!-- LIENS DE L'ARTISTE -->

                        <div
                            v-if="credit.links?.length"
                            class="credits-card__artist-links"
                        >
                            <a
                                v-for="(link, linkIndex) in credit.links"
                                :key="linkIndex"
                                :href="link.url"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="credits-card__artist-handle"
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
                                {{ link.label || "Profil" }} ↗
                            </a>
                        </div>
                    </div>

                </div>
            </div>

            <!-- =============================================
                 DESCRIPTION
            ============================================== -->

            <p
                v-if="artwork.description"
                class="credits-card__description"
            >
                {{ artwork.description }}
            </p>

            <!-- =============================================
                 ANCIEN BOUTON ARTISTE
                 Compatibilité avec les anciennes données
            ============================================== -->

            <a
                v-if="
                    artwork.artistUrl &&
                    !artwork.artistCredits?.length
                "
                :href="artwork.artistUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="credits-card__artist-button"
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
                        artwork.buttonText ||
                        "Voir son profil artiste"
                    }}
                </span>

                <span aria-hidden="true">
                    ↗
                </span>
            </a>

        </div>
    </article>
</template>