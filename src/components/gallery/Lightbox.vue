<script setup lang="ts">
import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    watch
} from "vue";

import type { CreditArtwork } from "./Cards.vue";
import type { ArtistCredit } from "../../types/artist-credit.types";

/* =========================================================
   PROPS
========================================================= */

const props = defineProps<{
    artwork: CreditArtwork;
    artworks: CreditArtwork[];
}>();

/* =========================================================
   EMITS
========================================================= */

const emit = defineEmits<{
    (event: "close"): void;
    (event: "previous"): void;
    (event: "next"): void;
    (event: "toggle-like", artwork: CreditArtwork): void;
}>();

/* =========================================================
   CRÉDITS ARTISTIQUES MULTIPLES
========================================================= */

const displayedArtistCredits = computed<ArtistCredit[]>(() => {
    const credits = props.artwork.artistCredits;

    if (credits?.length) {
        return [...credits].sort(
            (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
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
                              props.artwork.buttonText ||
                              "Voir son profil",
                          url: props.artwork.artistUrl
                      }
                  ]
                : [],
            sortOrder: 0
        }
    ];
});

/* =========================================================
   WATERMARK
========================================================= */

const watermarkUrl =
    "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/logo/Logo_Glow.png";

/* =========================================================
   POSITION
========================================================= */

const currentIndex = computed(() => {
    return props.artworks.findIndex(
        (artwork) => artwork.id === props.artwork.id
    );
});

const positionText = computed(() => {
    if (currentIndex.value === -1) {
        return `1 / ${props.artworks.length}`;
    }

    return `${currentIndex.value + 1} / ${props.artworks.length}`;
});

/* =========================================================
   MEDIA TYPE
========================================================= */

const isVideo = computed(() => {
    const mediaType =
        props.artwork.mediaType?.trim().toLowerCase() ?? "";

    const url =
        props.artwork.imageUrl?.toLowerCase().split("?")[0] ?? "";

    return (
        mediaType === "video" ||
        mediaType === "mp4" ||
        mediaType === "webm" ||
        mediaType.startsWith("video/") ||
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
    if (props.artwork.subcategory) {
        return props.artwork.subcategory;
    }

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
   DATE
========================================================= */

const formattedDate = computed(() => {
    if (!props.artwork.createdAt) {
        return null;
    }

    const date = new Date(props.artwork.createdAt);

    if (Number.isNaN(date.getTime())) {
        return props.artwork.createdAt;
    }

    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(date);
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
   ARTIST NAMES
========================================================= */

const artistNames = computed(() => {
    return displayedArtistCredits.value
        .map((credit) => credit.artistName)
        .filter(Boolean)
        .join(" et ");
});

/* =========================================================
   ARTWORK MESSAGE
========================================================= */

function speakArtworkMessage() {
    // Priorité aux messages personnalisés de Supabase
    if (props.artwork.imageMessages?.length) {
        sendMascotMessage(
            getRandomMessage(props.artwork.imageMessages)
        );

        return;
    }

    const names = artistNames.value || "nos artistes";

    const defaultMessages = [
        `Regarde cette création de ${names} ! 🎨`,
        `Cette œuvre a été réalisée par ${names} ! 💜`,
        "Regarde-moi tous ces détails ! 👀",
        "Encore une création magnifique dans la galerie ! ✨",
        "Tu peux utiliser les flèches pour continuer la visite ! 🐙"
    ];

    sendMascotMessage(
        getRandomMessage(defaultMessages)
    );
}

/* =========================================================
   NAVIGATION
========================================================= */

function previousArtwork() {
    emit("previous");
}

function nextArtwork() {
    emit("next");
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
            "Hop ! Dans tes favoris ! 💜",
            "Héhé, elle t'a tapé dans l'œil ? ✨",
            "Excellent choix ! Je valide aussi. 🐙💜",
            "Ooooh, celle-là mérite son petit cœur ! 💕",
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
   ARTIST LINK MESSAGE
========================================================= */

function speakArtistMessage() {
    if (props.artwork.buttonMessages?.length) {
        sendMascotMessage(
            getRandomMessage(props.artwork.buttonMessages)
        );

        return;
    }

    sendMascotMessage(
        `Va jeter un œil au travail de ${
            artistNames.value || "nos artistes"
        } ! 🎨`
    );
}

/* =========================================================
   KEYBOARD
========================================================= */

function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
        emit("close");
        return;
    }

    // Ne pas intercepter les flèches dans les champs de saisie
    const target = event.target;

    if (
        target instanceof HTMLElement &&
        (
            target.isContentEditable ||
            ["INPUT", "TEXTAREA", "SELECT"].includes(
                target.tagName
            )
        )
    ) {
        return;
    }

    if (event.key === "ArrowLeft") {
        event.preventDefault();
        previousArtwork();
        return;
    }

    if (event.key === "ArrowRight") {
        event.preventDefault();
        nextArtwork();
    }
}

/* =========================================================
   WATCH ARTWORK
========================================================= */

watch(
    () => props.artwork.id,
    async () => {
        await nextTick();

        speakArtworkMessage();
    }
);

/* =========================================================
   MOUNT / UNMOUNT
========================================================= */

let previousBodyOverflow = "";

onMounted(async () => {
    window.addEventListener("keydown", handleKeydown);

    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    await nextTick();

    speakArtworkMessage();
});

onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeydown);

    document.body.style.overflow = previousBodyOverflow;
});
</script>

<template>
    <Teleport to="body">
        <div
            class="credits-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Visionneuse d'œuvre"
            @click.self="emit('close')"
        >
            <!-- =========================================
                 PANEL
            ========================================== -->

            <div class="credits-lightbox__panel">

                <!-- =====================================
                     TOP BAR
                ====================================== -->

                <div class="credits-lightbox__topbar">

                    <span class="credits-lightbox__counter">
                        {{ positionText }}
                    </span>

                    <div class="credits-lightbox__actions">

                        <!-- LIKE -->

                        <button
                            type="button"
                            class="credits-lightbox__action"
                            :class="{
                                'credits-lightbox__action--liked':
                                    artwork.liked
                            }"
                            :aria-label="
                                artwork.liked
                                    ? 'Retirer des favoris'
                                    : 'Ajouter aux favoris'
                            "
                            :aria-pressed="artwork.liked"
                            @click="toggleLike"
                        >
                            <span aria-hidden="true">
                                {{ artwork.liked ? "♥" : "♡" }}
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
                            @click="emit('close')"
                        >
                            ✕
                        </button>

                    </div>
                </div>

                <!-- =====================================
                     ZONE IMAGE
                ====================================== -->

                <div class="credits-lightbox__main">

                    <!-- PREVIOUS -->

                    <button
                        v-if="artworks.length > 1"
                        type="button"
                        class="
                            credits-lightbox__navigation
                            credits-lightbox__navigation--previous
                        "
                        aria-label="Œuvre précédente"
                        @click="previousArtwork"
                    >
                        ‹
                    </button>

                    <!-- VISUAL -->

                    <div class="credits-lightbox__visual">

                        <!-- IMAGE -->

                        <img
                            v-if="!isVideo"
                            :key="`video-${artwork.id}`"
                            :src="artwork.imageUrl"
                            :alt="artwork.title"
                            class="credits-lightbox__image"
                            draggable="false"
                        />

                        <!-- VIDEO -->

                        <video
                            v-else
                            :key="`image-${artwork.id}`"
                            :src="artwork.imageUrl"
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
                            class="credits-lightbox__watermark"
                            aria-hidden="true"
                        >
                            <img
                                :src="watermarkUrl"
                                alt=""
                                draggable="false"
                            />
                        </div>

                    </div>

                    <!-- NEXT -->

                    <button
                        v-if="artworks.length > 1"
                        type="button"
                        class="
                            credits-lightbox__navigation
                            credits-lightbox__navigation--next
                        "
                        aria-label="Œuvre suivante"
                        @click="nextArtwork"
                    >
                        ›
                    </button>

                </div>

                <!-- =====================================
                     INFORMATIONS
                ====================================== -->

                <div class="credits-lightbox__content">

                    <!-- =================================
                         CRÉDITS ARTISTIQUES
                    ================================== -->

                    <section
                        v-if="displayedArtistCredits.length"
                        class="
                            credits-lightbox__artist
                            credits-lightbox__artists
                        "
                        aria-label="Crédits artistiques"
                    >
                        <div class="credits-lightbox__artists-header">

                            <span aria-hidden="true">
                                ✦
                            </span>

                            <h2>
                                Crédits artistiques
                            </h2>

                            <span
                                class="credits-lightbox__artists-count"
                            >
                                {{ displayedArtistCredits.length }}
                                {{
                                    displayedArtistCredits.length > 1
                                        ? "artistes"
                                        : "artiste"
                                }}
                            </span>

                        </div>

                        <!-- LISTE DES ARTISTES -->

                        <div class="credits-lightbox__artists-list">

                            <article
                                v-for="(credit, index) in displayedArtistCredits"
                                :key="
                                    credit.id ??
                                    `${credit.artistName}-${index}`
                                "
                                class="credits-lightbox__artist-entry"
                            >
                                <!-- IDENTITÉ -->

                                <div class="credits-lightbox__artist-main">

                                    <span
                                        class="credits-lightbox__artist-icon"
                                        aria-hidden="true"
                                    >
                                        🎨
                                    </span>

                                    <div class="credits-lightbox__artist-info">

                                        <h3 class="credits-lightbox__artist-name">
                                            {{ credit.artistName }}
                                        </h3>

                                        <span
                                            v-if="credit.contribution"
                                            class="credits-lightbox__artist-role"
                                        >
                                            {{ credit.contribution }}
                                        </span>

                                    </div>

                                </div>

                                <!-- LIENS -->

                                <div
                                    v-if="credit.links?.length"
                                    class="credits-lightbox__artist-links"
                                >
                                    <a
                                        v-for="(link, linkIndex) in credit.links"
                                        :key="
                                            `${credit.id ?? index}-${linkIndex}`
                                        "
                                        :href="link.url"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="credits-lightbox__artist-link"
                                        @mouseenter="speakArtistMessage"
                                        @focus="speakArtistMessage"
                                    >
                                        <span>
                                            {{
                                                link.label ||
                                                "Voir son profil"
                                            }}
                                        </span>

                                        <span aria-hidden="true">
                                            ↗
                                        </span>
                                    </a>
                                </div>

                            </article>

                        </div>
                    </section>

                    <!-- =================================
                         DESCRIPTION
                    ================================== -->

                    <p
                        v-if="artwork.description"
                        class="credits-lightbox__description"
                    >
                        {{ artwork.description }}
                    </p>

                    <!-- =================================
                         MÉTADONNÉES
                    ================================== -->

                    <div class="credits-lightbox__meta">

                        <!-- CATEGORY -->

                        <div class="credits-lightbox__meta-item">
                            <span>Catégorie</span>

                            <strong>
                                {{ categoryLabel }}
                            </strong>
                        </div>

                        <!-- LIKES -->

                        <div class="credits-lightbox__meta-item">
                            <span>Likes</span>

                            <strong>
                                ♥ {{ artwork.likes }}
                            </strong>
                        </div>

                        <!-- DATE -->

                        <div
                            v-if="formattedDate"
                            class="credits-lightbox__meta-item"
                        >
                            <span>Ajoutée le</span>

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

<style scoped>
/* =========================================================
   LIGHTBOX - CONTENEUR PRINCIPAL
========================================================= */

.credits-lightbox {
    position: fixed;
    inset: 0;
    z-index: 9999;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 20px;

    background: rgba(5, 3, 15, 0.88);
    backdrop-filter: blur(12px);

    overflow: hidden;
    box-sizing: border-box;
}

/* =========================================================
   PANEL
   La fenêtre défile si le contenu est trop grand.
========================================================= */

.credits-lightbox .credits-lightbox__panel {
    position: relative;

    display: flex;
    flex-direction: column;

    width: min(100%, 1050px);
    max-width: 1050px;

    height: auto;
    max-height: calc(100dvh - 40px);

    min-height: 0;

    margin: 0;

    overflow-x: hidden;
    overflow-y: auto;

    background:
        linear-gradient(
            145deg,
            rgba(34, 20, 58, 0.98),
            rgba(13, 9, 28, 0.99)
        );

    border: 1px solid rgba(189, 147, 249, 0.3);
    border-radius: 22px;

    box-shadow:
        0 25px 80px rgba(0, 0, 0, 0.65),
        0 0 35px rgba(139, 92, 246, 0.1);

    scrollbar-width: thin;
    scrollbar-color:
        rgba(177, 125, 255, 0.65)
        rgba(255, 255, 255, 0.05);

    box-sizing: border-box;
}

/* =========================================================
   TOP BAR
========================================================= */

.credits-lightbox .credits-lightbox__topbar {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: space-between;

    width: 100%;
    min-height: 62px;

    padding: 12px 20px;

    flex: 0 0 auto;

    background: rgba(20, 12, 37, 0.95);
    border-bottom: 1px solid rgba(189, 147, 249, 0.16);

    box-sizing: border-box;
}

.credits-lightbox__counter {
    color: #d8c4f7;
    font-size: 0.9rem;
    font-weight: 600;
}

.credits-lightbox__actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.credits-lightbox__action {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 36px;
    height: 36px;

    border: 1px solid rgba(189, 147, 249, 0.3);
    border-radius: 10px;

    background: rgba(255, 255, 255, 0.05);
    color: #ffffff;

    cursor: pointer;

    transition:
        background 0.2s ease,
        border-color 0.2s ease,
        transform 0.2s ease;
}

.credits-lightbox__action:hover {
    background: rgba(168, 85, 247, 0.2);
    border-color: rgba(189, 147, 249, 0.7);
    transform: translateY(-1px);
}

.credits-lightbox__action--liked {
    color: #ff77b7;
}

/* =========================================================
   IMAGE - ZONE INDÉPENDANTE
========================================================= */

.credits-lightbox .credits-lightbox__main {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: auto;

    min-height: 0;

    padding: 16px 60px;

    flex: 0 0 auto;

    background: rgba(5, 4, 13, 0.55);

    box-sizing: border-box;
}

/* =========================================================
   VISUAL
========================================================= */

.credits-lightbox .credits-lightbox__visual {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    max-width: 900px;

    height: auto;
    min-height: 0;

    overflow: hidden;

    background: rgba(0, 0, 0, 0.2);
    border-radius: 12px;
}

/* =========================================================
   IMAGE / VIDEO
========================================================= */

.credits-lightbox .credits-lightbox__image {
    position: relative;

    display: block;

    width: auto;
    max-width: 100%;

    height: auto;
    max-height: min(48dvh, 480px);

    margin: 0 auto;

    object-fit: contain;
    object-position: center;

    border-radius: 10px;

    flex: 0 1 auto;
}

.credits-lightbox .credits-lightbox__video {
    max-width: 100%;
    max-height: min(48dvh, 480px);

    object-fit: contain;
}

/* =========================================================
   NAVIGATION
========================================================= */

.credits-lightbox .credits-lightbox__navigation {
    position: absolute;
    top: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 42px;
    height: 42px;

    transform: translateY(-50%);

    border: 1px solid rgba(189, 147, 249, 0.35);
    border-radius: 50%;

    background: rgba(30, 17, 52, 0.85);
    color: white;

    font-size: 2rem;
    line-height: 1;

    cursor: pointer;

    z-index: 5;

    transition:
        background 0.2s ease,
        border-color 0.2s ease;
}

.credits-lightbox__navigation:hover {
    background: rgba(139, 92, 246, 0.6);
    border-color: rgba(220, 190, 255, 0.8);
}

.credits-lightbox .credits-lightbox__navigation--previous {
    left: 12px;
}

.credits-lightbox .credits-lightbox__navigation--next {
    right: 12px;
}

/* =========================================================
   WATERMARK
========================================================= */

.credits-lightbox .credits-lightbox__watermark {
    position: absolute;

    right: 12px;
    bottom: 12px;

    z-index: 2;

    pointer-events: none;
}

.credits-lightbox__watermark img {
    display: block;

    width: 65px;
    max-width: 100%;
    height: auto;

    opacity: 0.65;
}

/* =========================================================
   CONTENT
   Toujours sous l'image.
========================================================= */

.credits-lightbox .credits-lightbox__content {
    position: relative;

    display: flex;
    flex-direction: column;

    width: 100%;
    height: auto;

    min-height: 0;

    padding: 24px 28px 28px;

    flex: 0 0 auto;

    background: transparent;

    box-sizing: border-box;
}

/* =========================================================
   CRÉDITS ARTISTIQUES
========================================================= */

.credits-lightbox .credits-lightbox__artists {
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: stretch;

    width: 100%;
    height: auto;

    margin: 0 0 20px;
    padding: 0;

    gap: 16px;

    background: transparent;
    border: none;

    box-sizing: border-box;
}

/* =========================================================
   TITRE DES CRÉDITS
========================================================= */

.credits-lightbox__artists-header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    gap: 10px;

    padding-bottom: 12px;

    border-bottom: 1px solid rgba(189, 147, 249, 0.2);
}

.credits-lightbox__artists-header > span:first-child {
    color: #c99aff;
    font-size: 1.1rem;
}

.credits-lightbox__artists-header h2 {
    margin: 0;

    color: #f3e8ff;

    font-size: 1.05rem;
    font-weight: 700;
    line-height: 1.4;
}

.credits-lightbox__artists-count {
    margin-left: auto;

    padding: 5px 10px;

    border: 1px solid rgba(189, 147, 249, 0.2);
    border-radius: 20px;

    background: rgba(139, 92, 246, 0.12);

    color: #d9c1ff;

    font-size: 0.75rem;
    white-space: nowrap;
}

/* =========================================================
   LISTE DES ARTISTES
========================================================= */

.credits-lightbox__artists-list {
    display: flex;
    flex-direction: column;

    width: 100%;

    gap: 12px;
}

/* =========================================================
   CARTE INDIVIDUELLE D'ARTISTE
========================================================= */

.credits-lightbox .credits-lightbox__artist-entry {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;

    width: 100%;
    min-width: 0;
    height: auto;

    padding: 16px 18px;

    gap: 16px 24px;

    background:
        linear-gradient(
            120deg,
            rgba(139, 92, 246, 0.12),
            rgba(255, 255, 255, 0.025)
        );

    border: 1px solid rgba(189, 147, 249, 0.22);
    border-radius: 14px;

    box-sizing: border-box;

    transition:
        background 0.2s ease,
        border-color 0.2s ease;
}

.credits-lightbox__artist-entry:hover {
    background:
        linear-gradient(
            120deg,
            rgba(139, 92, 246, 0.18),
            rgba(255, 255, 255, 0.04)
        );

    border-color: rgba(189, 147, 249, 0.45);
}

/* =========================================================
   IDENTITÉ ARTISTE
========================================================= */

.credits-lightbox .credits-lightbox__artist-main {
    display: flex;
    align-items: center;

    flex: 1 1 220px;

    min-width: 0;

    gap: 14px;
}

.credits-lightbox .credits-lightbox__artist-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 44px;
    height: 44px;

    flex: 0 0 44px;

    background: rgba(168, 85, 247, 0.15);
    border: 1px solid rgba(189, 147, 249, 0.25);
    border-radius: 12px;

    font-size: 1.25rem;
}

.credits-lightbox .credits-lightbox__artist-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    min-width: 0;

    gap: 5px;
}

.credits-lightbox .credits-lightbox__artist-name {
    margin: 0;

    color: #f3e8ff;

    font-size: 1.05rem;
    font-weight: 700;
    line-height: 1.4;

    overflow-wrap: anywhere;
}

.credits-lightbox .credits-lightbox__artist-role {
    display: inline-flex;

    padding: 4px 9px;

    background: rgba(189, 147, 249, 0.12);
    border: 1px solid rgba(189, 147, 249, 0.16);
    border-radius: 6px;

    color: #d5b8f7;

    font-size: 0.78rem;
    line-height: 1.4;
}

/* =========================================================
   LIENS ARTISTES
========================================================= */

.credits-lightbox .credits-lightbox__artist-links {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;

    flex: 0 1 auto;

    min-width: 0;

    gap: 8px;
}

.credits-lightbox .credits-lightbox__artist-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: auto;
    min-width: 0;

    padding: 10px 14px;

    gap: 10px;

    background:
        linear-gradient(
            135deg,
            rgba(139, 92, 246, 0.3),
            rgba(168, 85, 247, 0.18)
        );

    border: 1px solid rgba(189, 147, 249, 0.35);
    border-radius: 9px;

    color: #f5ebff;

    font-size: 0.82rem;
    font-weight: 600;
    line-height: 1.3;

    text-decoration: none;
    overflow-wrap: anywhere;

    transition:
        background 0.2s ease,
        border-color 0.2s ease,
        transform 0.2s ease;
}

.credits-lightbox__artist-link:hover {
    background:
        linear-gradient(
            135deg,
            rgba(139, 92, 246, 0.55),
            rgba(168, 85, 247, 0.3)
        );

    border-color: rgba(220, 190, 255, 0.7);

    transform: translateY(-2px);
}

/* =========================================================
   DESCRIPTION
========================================================= */

.credits-lightbox .credits-lightbox__description {
    width: 100%;

    margin: 0 0 20px;
    padding: 0;

    color: #d7cce5;

    font-size: 0.92rem;
    line-height: 1.7;

    overflow-wrap: anywhere;
}

/* =========================================================
   META
========================================================= */

.credits-lightbox .credits-lightbox__meta {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));

    width: 100%;

    margin: 0;
    padding: 16px 0 0;

    gap: 12px;

    border-top: 1px solid rgba(189, 147, 249, 0.18);

    background: transparent;
}

.credits-lightbox .credits-lightbox__meta-item {
    display: flex;
    flex-direction: column;

    min-width: 0;

    gap: 6px;
}

.credits-lightbox__meta-item span {
    color: #ad9cbe;
    font-size: 0.75rem;
}

.credits-lightbox__meta-item strong {
    color: #f2e8ff;

    font-size: 0.85rem;
    font-weight: 600;

    overflow-wrap: anywhere;
}

/* =========================================================
   SCROLLBAR INVISIBLE
   Le défilement reste fonctionnel
========================================================= */

.credits-lightbox .credits-lightbox__panel {
    /* Firefox */
    scrollbar-width: none;

    /* Ancien Edge / IE */
    -ms-overflow-style: none;
}

/* Chrome, Edge, Safari */
.credits-lightbox .credits-lightbox__panel::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
}
/* =========================================================
   TABLETTE
========================================================= */

@media (max-width: 768px) {
    .credits-lightbox {
        padding: 12px;
    }

    .credits-lightbox .credits-lightbox__panel {
        width: 100%;
        max-height: calc(100dvh - 24px);

        border-radius: 16px;
    }

    .credits-lightbox .credits-lightbox__main {
        padding: 12px 48px;
    }

    .credits-lightbox .credits-lightbox__image {
        max-height: 42dvh;
    }

    .credits-lightbox .credits-lightbox__content {
        padding: 20px;
    }

    .credits-lightbox .credits-lightbox__artist-entry {
        padding: 14px;
    }

    .credits-lightbox .credits-lightbox__artist-links {
        justify-content: flex-start;
    }

    .credits-lightbox .credits-lightbox__meta {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 480px) {
    .credits-lightbox {
        padding: 8px;
    }

    .credits-lightbox .credits-lightbox__panel {
        max-height: calc(100dvh - 16px);

        border-radius: 14px;
    }

    .credits-lightbox .credits-lightbox__topbar {
        min-height: 54px;
        padding: 9px 12px;
    }

    .credits-lightbox .credits-lightbox__main {
        padding: 12px 38px;
    }

    .credits-lightbox .credits-lightbox__visual {
        border-radius: 8px;
    }

    .credits-lightbox .credits-lightbox__image {
        max-height: 35dvh;
    }

    .credits-lightbox .credits-lightbox__navigation {
        width: 32px;
        height: 32px;

        font-size: 1.6rem;
    }

    .credits-lightbox .credits-lightbox__navigation--previous {
        left: 4px;
    }

    .credits-lightbox .credits-lightbox__navigation--next {
        right: 4px;
    }

    .credits-lightbox .credits-lightbox__content {
        padding: 16px 12px 20px;
    }

    .credits-lightbox__artists-header {
        gap: 8px;
    }

    .credits-lightbox__artists-header h2 {
        font-size: 0.95rem;
    }

    .credits-lightbox__artists-count {
        font-size: 0.7rem;
    }

    .credits-lightbox .credits-lightbox__artist-entry {
        flex-direction: column;
        align-items: stretch;

        padding: 14px;

        gap: 14px;
    }

    .credits-lightbox .credits-lightbox__artist-main {
        flex: 0 0 auto;
        width: 100%;
    }

    .credits-lightbox .credits-lightbox__artist-links {
        width: 100%;

        justify-content: flex-start;
    }

    .credits-lightbox .credits-lightbox__artist-link {
        flex: 1 1 auto;
    }

    .credits-lightbox .credits-lightbox__meta {
        grid-template-columns: 1fr 1fr;
        gap: 16px;
    }

    .credits-lightbox .credits-lightbox__watermark img {
        width: 45px;
    }
}
</style>