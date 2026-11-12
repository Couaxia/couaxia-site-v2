<script setup lang="ts">
/* =========================================================
   IMPORTS
========================================================= */

import {
    computed,
    onMounted,
    onBeforeUnmount,
    ref
} from "vue";

import CardItem from "./CardItem.vue";

import AppLoader from "../ui/AppLoader.vue";

import {
    getMyCardCollection,
    getCardRarities
} from "../../services/cards.service";

import type {
    Card,
    CardCollection,
    CardRarityConfig
} from "../../types/card.types";


/* =========================================================
   STATE
========================================================= */

const loading = ref(true);

const errorMessage = ref("");

const collection = ref<CardCollection | null>(null);

const rarities = ref<CardRarityConfig[]>([]);

const search = ref("");

const selectedRarity = ref("all");

const selectedCategory = ref("all");

const selectedOrientation = ref("all");

const selectedCard = ref<Card | null>(null);


/* =========================================================
   COLLECTION
========================================================= */

const ownedCards = computed(() => {
    return collection.value?.cards ?? [];
});

const stats = computed(() => {
    return collection.value?.stats ?? {
        uniqueCards: 0,
        totalCards: 0,
        totalCopies: 0,
        completion: 0
    };
});


/* =========================================================
   FILTER OPTIONS
========================================================= */

const rarityOptions = [
    { value: "all", label: "Toutes les raretés" },
    { value: "common", label: "Commune" },
    { value: "uncommon", label: "Peu commune" },
    { value: "rare", label: "Rare" },
    { value: "epic", label: "Épique" },
    { value: "legendary", label: "Légendaire" },
    { value: "mythic", label: "Mythique" }
];

const categoryOptions = computed(() => {
    const categories = new Set(
        ownedCards.value.map(
            (item) => item.card.category
        )
    );

    return [
        { value: "all", label: "Toutes les catégories" },

        ...Array.from(categories).map((category) => ({
            value: category,
            label: getCategoryLabel(category)
        }))
    ];
});

const orientationOptions = [
    { value: "all", label: "Tous les formats" },
    { value: "portrait", label: "🃏 Vertical" },
    { value: "landscape", label: "🌍 Horizontal" }
];


/* =========================================================
   CATEGORY LABEL
========================================================= */

function getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
        couaxia: "Couaxia",
        natsu: "Natsu",
        character: "Personnages",
        lore: "Histoire",
        terrain: "Terrain",
        event: "Événement",
        special: "Spéciale"
    };

    return labels[category] ?? category;
}


/* =========================================================
   FILTERED CARDS
========================================================= */

const filteredCards = computed(() => {
    const query = search.value
        .trim()
        .toLocaleLowerCase("fr");

    return ownedCards.value.filter((item) => {
        const card = item.card;

        const matchesSearch =
            !query ||
            card.name.toLocaleLowerCase("fr").includes(query) ||
            String(card.number).includes(query);

        const matchesRarity =
            selectedRarity.value === "all" ||
            card.rarity === selectedRarity.value;

        const matchesCategory =
            selectedCategory.value === "all" ||
            card.category === selectedCategory.value;

        const orientation =
            card.orientation === "landscape"
                ? "landscape"
                : "portrait";

        const matchesOrientation =
            selectedOrientation.value === "all" ||
            orientation === selectedOrientation.value;

        return (
            matchesSearch &&
            matchesRarity &&
            matchesCategory &&
            matchesOrientation
        );
    });
});


/* =========================================================
   RARITY CONFIG
========================================================= */

function getRarityConfig(
    card: Card
): CardRarityConfig | null {
    return (
        rarities.value.find(
            (rarity) => rarity.id === card.rarity
        ) ?? null
    );
}


/* =========================================================
   QUANTITY
========================================================= */

function getCardQuantity(cardId: string): number {
    return (
        ownedCards.value.find(
            (item) => item.cardId === cardId
        )?.quantity ?? 0
    );
}


/* =========================================================
   LOAD COLLECTION
========================================================= */

async function loadCollection() {
    loading.value = true;
    errorMessage.value = "";

    try {
        const [collectionData, rarityData] =
            await Promise.all([
                getMyCardCollection(),
                getCardRarities()
            ]);

        collection.value = collectionData;
        rarities.value = rarityData;
    } catch (error) {
        console.error(
            "[CardCollection] Erreur :",
            error
        );

        errorMessage.value =
            error instanceof Error
                ? error.message
                : "Impossible de charger ta collection.";
    } finally {
        loading.value = false;
    }
}


/* =========================================================
   CARD MODAL
========================================================= */

function openCard(card: Card) {
    selectedCard.value = card;
}

function closeCard() {
    selectedCard.value = null;
}

function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
        closeCard();
    }
}


/* =========================================================
   LIFECYCLE
========================================================= */

onMounted(() => {
    void loadCollection();

    window.addEventListener(
        "keydown",
        handleKeydown
    );
});

onBeforeUnmount(() => {
    window.removeEventListener(
        "keydown",
        handleKeydown
    );
});
</script>


<template>
    <section class="card-collection">

        <!-- =========================================
             LOADING
        ========================================== -->

        <AppLoader
            v-if="loading"
            text="Chargement de ta collection..."
            size="large"
        />


        <!-- =========================================
             ERROR
        ========================================== -->

        <div
            v-else-if="errorMessage"
            class="collection-message"
        >
            <span class="collection-message__icon">
                ⚠️
            </span>

            <h2>Une erreur est survenue</h2>

            <p>{{ errorMessage }}</p>

            <button
                type="button"
                @click="loadCollection"
            >
                Réessayer
            </button>
        </div>


        <!-- =========================================
             NOT CONNECTED
        ========================================== -->

        <div
            v-else-if="!collection"
            class="collection-message"
        >
            <span class="collection-message__icon">
                🐙
            </span>

            <h2>Connecte-toi pour voir ta collection</h2>

            <p>
                Tes cartes Couaxia sont liées à ton compte.
                Connecte-toi pour retrouver tes découvertes !
            </p>

            <RouterLink to="/login">
                Se connecter
            </RouterLink>
        </div>


        <!-- =========================================
             COLLECTION CONTENT
        ========================================== -->

        <template v-else>

            <!-- STATISTICS -->

            <div class="collection-stats">

                <article class="collection-stat">
                    <span class="collection-stat__icon">
                        🃏
                    </span>

                    <strong>
                        {{ stats.uniqueCards }}
                    </strong>

                    <span>
                        Cartes différentes
                    </span>
                </article>

                <article class="collection-stat">
                    <span class="collection-stat__icon">
                        📚
                    </span>

                    <strong>
                        {{ stats.totalCopies }}
                    </strong>

                    <span>
                        Exemplaires
                    </span>
                </article>

                <article class="collection-stat">
                    <span class="collection-stat__icon">
                        ✨
                    </span>

                    <strong>
                        {{ stats.completion }} %
                    </strong>

                    <span>
                        Collection complétée
                    </span>
                </article>

                <article class="collection-stat">
                    <span class="collection-stat__icon">
                        🌌
                    </span>

                    <strong>
                        {{ stats.totalCards }}
                    </strong>

                    <span>
                        Cartes disponibles
                    </span>
                </article>

            </div>


            <!-- PROGRESS -->

            <div class="collection-progress">

                <div class="collection-progress__header">
                    <span>Progression de la collection</span>

                    <strong>
                        {{ stats.uniqueCards }}
                        /
                        {{ stats.totalCards }}
                    </strong>
                </div>

                <div
                    class="collection-progress__track"
                    role="progressbar"
                    :aria-valuenow="stats.completion"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-label="Progression de la collection"
                >
                    <div
                        class="collection-progress__fill"
                        :style="{
                            width: `${Math.min(
                                100,
                                Math.max(0, stats.completion)
                            )}%`
                        }"
                    ></div>
                </div>

            </div>


            <!-- FILTERS -->

            <div class="collection-filters">

                <label class="collection-field">
                    <span>Rechercher une carte</span>

                    <input
                        v-model="search"
                        type="search"
                        placeholder="Nom ou numéro..."
                    >
                </label>

                <label class="collection-field">
                    <span>Rareté</span>

                    <select v-model="selectedRarity">
                        <option
                            v-for="option in rarityOptions"
                            :key="option.value"
                            :value="option.value"
                        >
                            {{ option.label }}
                        </option>
                    </select>
                </label>

                <label class="collection-field">
                    <span>Catégorie</span>

                    <select v-model="selectedCategory">
                        <option
                            v-for="option in categoryOptions"
                            :key="option.value"
                            :value="option.value"
                        >
                            {{ option.label }}
                        </option>
                    </select>
                </label>

                <label class="collection-field">
                    <span>Format</span>

                    <select v-model="selectedOrientation">
                        <option
                            v-for="option in orientationOptions"
                            :key="option.value"
                            :value="option.value"
                        >
                            {{ option.label }}
                        </option>
                    </select>
                </label>

            </div>


            <!-- RESULTS HEADER -->

            <div class="collection-results">

                <h2>
                    Mes cartes
                </h2>

                <span>
                    {{ filteredCards.length }}
                    carte(s) affichée(s)
                </span>

            </div>


            <!-- EMPTY COLLECTION -->

            <div
                v-if="ownedCards.length === 0"
                class="collection-message"
            >
                <span class="collection-message__icon">
                    🎁
                </span>

                <h2>Ta collection est encore vide !</h2>

                <p>
                    Ouvre des packs pour découvrir
                    tes premières cartes Couaxia.
                </p>

                <RouterLink to="/cards">
                    Découvrir les cartes
                </RouterLink>
            </div>


            <!-- NO FILTER RESULTS -->

            <div
                v-else-if="filteredCards.length === 0"
                class="collection-message"
            >
                <span class="collection-message__icon">
                    🔎
                </span>

                <h2>Aucune carte trouvée</h2>

                <p>
                    Essaie de modifier tes filtres.
                </p>

                <button
                    type="button"
                    @click="
                        search = '';
                        selectedRarity = 'all';
                        selectedCategory = 'all';
                        selectedOrientation = 'all';
                    "
                >
                    Réinitialiser les filtres
                </button>
            </div>


            <!-- CARDS GRID -->

            <div
                v-else
                class="collection-grid"
            >
                <div
                    v-for="item in filteredCards"
                    :key="item.id"
                    class="collection-grid__item"
                    :class="{
                        'collection-grid__item--landscape':
                            item.card.orientation === 'landscape'
                    }"
                >
                    <CardItem
                        :card="item.card"
                        :rarity-config="getRarityConfig(item.card)"
                        :owned="true"
                        :quantity="item.quantity"
                        :interactive="true"
                        @select="openCard"
                    />
                </div>
            </div>

        </template>


        <!-- =========================================
             CARD DETAIL MODAL
        ========================================== -->

        <Teleport to="body">

            <div
                v-if="selectedCard"
                class="collection-modal"
                role="presentation"
                @click.self="closeCard"
            >
                <section
                    class="collection-modal__panel"
                    role="dialog"
                    aria-modal="true"
                    :aria-label="selectedCard.name"
                >
                    <button
                        type="button"
                        class="collection-modal__close"
                        aria-label="Fermer"
                        @click="closeCard"
                    >
                        ✕
                    </button>

                    <div
                        class="collection-modal__card"
                        :class="{
                            'collection-modal__card--landscape':
                                selectedCard.orientation === 'landscape'
                        }"
                    >
                        <CardItem
                            :card="selectedCard"
                            :rarity-config="
                                getRarityConfig(selectedCard)
                            "
                            :owned="true"
                            :quantity="
                                getCardQuantity(selectedCard.id)
                            "
                            :interactive="false"
                        />
                    </div>

                    <div class="collection-modal__details">

                        <h2>{{ selectedCard.name }}</h2>

                        <p v-if="selectedCard.description">
                            {{ selectedCard.description }}
                        </p>

                        <span>
                            Carte n°{{ selectedCard.number }}
                        </span>

                        <span>
                            {{
                                selectedCard.orientation === "landscape"
                                    ? "🌍 Format horizontal"
                                    : "🃏 Format vertical"
                            }}
                        </span>

                        <span>
                            Exemplaires :
                            {{ getCardQuantity(selectedCard.id) }}
                        </span>

                        <p v-if="selectedCard.artist">
                            Illustration :
                            <a
                                v-if="selectedCard.artistUrl"
                                :href="selectedCard.artistUrl"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {{ selectedCard.artist }}
                            </a>

                            <span v-else>
                                {{ selectedCard.artist }}
                            </span>
                        </p>

                    </div>
                </section>
            </div>

        </Teleport>

    </section>
</template>


<style scoped>
/* =========================================================
   COLLECTION
========================================================= */

.card-collection {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px 0 60px;
}


/* =========================================================
   STATISTICS
========================================================= */

.collection-stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
    margin-bottom: 26px;
}

.collection-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 150px;
    padding: 22px;
    border: 1px solid rgba(192, 132, 252, 0.25);
    border-radius: 22px;
    background: linear-gradient(
        145deg,
        rgba(81, 29, 112, 0.25),
        rgba(18, 8, 35, 0.35)
    );
    text-align: center;
}

.collection-stat__icon {
    font-size: 1.8rem;
}

.collection-stat strong {
    color: #f5d5ff;
    font-size: clamp(1.6rem, 3vw, 2.2rem);
}

.collection-stat > span:last-child {
    color: #cdb8dc;
    font-size: 0.85rem;
}


/* =========================================================
   PROGRESS
========================================================= */

.collection-progress {
    margin-bottom: 30px;
    padding: 20px 24px;
    border: 1px solid rgba(192, 132, 252, 0.2);
    border-radius: 20px;
    background: rgba(32, 12, 52, 0.3);
}

.collection-progress__header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 14px;
    color: #f7eaff;
    font-weight: 700;
}

.collection-progress__track {
    height: 12px;
    overflow: hidden;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.1);
}

.collection-progress__fill {
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(
        90deg,
        #a855f7,
        #f22292,
        #22f2ef
    );
    transition: width 0.4s ease;
}


/* =========================================================
   FILTERS
========================================================= */

.collection-filters {
    display: grid;
    grid-template-columns: 1.5fr repeat(3, 1fr);
    gap: 14px;
    margin-bottom: 30px;
}

.collection-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.collection-field span {
    color: #dec7ed;
    font-size: 0.85rem;
    font-weight: 700;
}

.collection-field input,
.collection-field select {
    width: 100%;
    min-height: 46px;
    padding: 11px 14px;
    border: 1px solid rgba(192, 132, 252, 0.35);
    border-radius: 12px;
    outline: none;
    background: #21132f;
    color: #fff;
    font: inherit;
}

.collection-field input:focus,
.collection-field select:focus {
    border-color: #c084fc;
    box-shadow: 0 0 0 3px rgba(192, 132, 252, 0.12);
}


/* =========================================================
   RESULTS
========================================================= */

.collection-results {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 22px;
}

.collection-results h2 {
    margin: 0;
    color: #fff;
    font-size: 1.5rem;
}

.collection-results span {
    color: #cbb7d8;
}


/* =========================================================
   GRID
========================================================= */

.collection-grid {
    display: grid;
    grid-template-columns: repeat(
        auto-fill,
        minmax(220px, 1fr)
    );
    gap: 28px;
    align-items: start;
}

.collection-grid__item {
    display: flex;
    justify-content: center;
    min-width: 0;
}

.collection-grid__item--landscape {
    grid-column: span 2;
}


/* =========================================================
   EMPTY / ERROR
========================================================= */

.collection-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    min-height: 280px;
    padding: 35px 20px;
    border: 1px dashed rgba(192, 132, 252, 0.3);
    border-radius: 24px;
    background: rgba(43, 18, 67, 0.2);
    text-align: center;
}

.collection-message__icon {
    font-size: 3rem;
}

.collection-message h2 {
    margin: 0;
    color: #fff;
}

.collection-message p {
    max-width: 500px;
    margin: 0;
    color: #cbb7d8;
    line-height: 1.6;
}

.collection-message button,
.collection-message a {
    padding: 12px 22px;
    border: 1px solid #c084fc;
    border-radius: 12px;
    background: rgba(168, 85, 247, 0.15);
    color: #fff;
    font: inherit;
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
}


/* =========================================================
   MODAL
========================================================= */

.collection-modal {
    position: fixed;
    z-index: 10000;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    overflow-y: auto;
    background: rgba(5, 2, 12, 0.88);
    backdrop-filter: blur(12px);
}

.collection-modal__panel {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: min(100%, 800px);
    max-height: 100%;
    overflow-y: auto;
    padding: 36px 24px;
    border: 1px solid rgba(192, 132, 252, 0.4);
    border-radius: 24px;
    background: #1a0c2b;
}

.collection-modal__close {
    position: absolute;
    z-index: 2;
    top: 12px;
    right: 12px;
    width: 38px;
    height: 38px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.45);
    color: #fff;
    font-size: 1.1rem;
    cursor: pointer;
}

.collection-modal__card {
    display: flex;
    justify-content: center;
    width: min(100%, 350px);
}

.collection-modal__card--landscape {
    width: min(100%, 550px);
}

.collection-modal__details {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    color: #eee0f8;
    text-align: center;
}

.collection-modal__details h2 {
    margin: 0;
    color: #fff;
}

.collection-modal__details p {
    margin: 0;
    line-height: 1.6;
}

.collection-modal__details a {
    color: #d8a4ff;
}


/* =========================================================
   LIGHT MODE
========================================================= */

:global(html[data-theme="light"]) .collection-stat,
:global(html[data-theme="light"]) .collection-progress,
:global(html[data-theme="light"]) .collection-modal__panel {
    background: #f9f0ff;
}

:global(html[data-theme="light"]) .collection-stat strong,
:global(html[data-theme="light"]) .collection-progress__header,
:global(html[data-theme="light"]) .collection-results h2,
:global(html[data-theme="light"]) .collection-modal__details h2 {
    color: #47175d;
}

:global(html[data-theme="light"]) .collection-stat > span:last-child,
:global(html[data-theme="light"]) .collection-field span,
:global(html[data-theme="light"]) .collection-results span,
:global(html[data-theme="light"]) .collection-modal__details {
    color: #654c70;
}

:global(html[data-theme="light"]) .collection-field input,
:global(html[data-theme="light"]) .collection-field select {
    background: #fff;
    color: #371448;
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1000px) {
    .collection-stats {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .collection-filters {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 650px) {
    .collection-stats,
    .collection-filters {
        grid-template-columns: 1fr;
    }

    .collection-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px 12px;
    }

    .collection-grid__item--landscape {
        grid-column: span 2;
    }

    .collection-stat {
        min-height: 120px;
    }

    .collection-modal {
        padding: 12px;
    }

    .collection-modal__panel {
        padding: 48px 14px 22px;
    }
}

@media (max-width: 380px) {
    .collection-grid {
        grid-template-columns: 1fr;
    }

    .collection-grid__item--landscape {
        grid-column: span 1;
    }
}
</style>