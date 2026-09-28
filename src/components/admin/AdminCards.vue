<script setup lang="ts">

import {
    computed,
    onMounted,
    ref
} from "vue";


import type {
    Card,
    CardRarity,
    CardStatus
} from "../../types/card.types";


import {
    deleteCard,
    getAdminCards,
    updateCardStatus
} from "../../services/cardAdmin.service";


import AdminCardForm from
    "./AdminCardForm.vue";


/* =========================================================
   STATE
========================================================= */

const cards =
    ref<Card[]>(
        []
    );


const loading =
    ref(
        true
    );


const errorMessage =
    ref(
        ""
    );


const successMessage =
    ref(
        ""
    );


const search =
    ref(
        ""
    );


const rarityFilter =
    ref<CardRarity | "all">(
        "all"
    );


const statusFilter =
    ref<CardStatus | "all">(
        "all"
    );


const processingCardId =
    ref<string | null>(
        null
    );


/* =========================================================
   MODAL / FORM STATE
========================================================= */

const showForm =
    ref(
        false
    );


const selectedCard =
    ref<Card | null>(
        null
    );


/* =========================================================
   RARITIES
========================================================= */

const rarities:
    {
        id: CardRarity;
        label: string;
        icon: string;
    }[] = [

        {
            id:
                "common",

            label:
                "Commune",

            icon:
                "⚪"
        },

        {
            id:
                "uncommon",

            label:
                "Peu commune",

            icon:
                "🟢"
        },

        {
            id:
                "rare",

            label:
                "Rare",

            icon:
                "🔵"
        },

        {
            id:
                "epic",

            label:
                "Épique",

            icon:
                "🟣"
        },

        {
            id:
                "legendary",

            label:
                "Légendaire",

            icon:
                "🟡"
        },

        {
            id:
                "mythic",

            label:
                "Mythique",

            icon:
                "💗"
        }

    ];


/* =========================================================
   COMPUTED — STATS
========================================================= */

const totalCards =
    computed(
        () =>
            cards.value.length
    );


const activeCards =
    computed(
        () =>
            cards.value.filter(
                card =>
                    card.status
                    ===
                    "active"
            ).length
    );


const draftCards =
    computed(
        () =>
            cards.value.filter(
                card =>
                    card.status
                    ===
                    "draft"
            ).length
    );


const limitedCards =
    computed(
        () =>
            cards.value.filter(
                card =>
                    card.limited
            ).length
    );


/* =========================================================
   COMPUTED — FILTERED CARDS
========================================================= */

const filteredCards =
    computed(
        () => {

            const query =
                search.value
                    .trim()
                    .toLowerCase();


            return cards.value.filter(
                card => {

                    /* =====================================
                       SEARCH
                    ====================================== */

                    const matchesSearch =
                        !query
                        ||
                        card.name
                            .toLowerCase()
                            .includes(
                                query
                            )
                        ||
                        String(
                            card.number
                        )
                            .includes(
                                query
                            )
                        ||
                        (
                            card.artist
                            ??
                            ""
                        )
                            .toLowerCase()
                            .includes(
                                query
                            );


                    /* =====================================
                       RARITY
                    ====================================== */

                    const matchesRarity =
                        rarityFilter.value
                        ===
                        "all"
                        ||
                        card.rarity
                        ===
                        rarityFilter.value;


                    /* =====================================
                       STATUS
                    ====================================== */

                    const matchesStatus =
                        statusFilter.value
                        ===
                        "all"
                        ||
                        card.status
                        ===
                        statusFilter.value;


                    return (
                        matchesSearch
                        &&
                        matchesRarity
                        &&
                        matchesStatus
                    );

                }
            );

        }
    );


/* =========================================================
   HELPERS
========================================================= */

function getRarityLabel(
    rarity:
        CardRarity
): string {

    return (
        rarities.find(
            item =>
                item.id
                ===
                rarity
        )?.label
        ??
        rarity
    );

}


function getRarityIcon(
    rarity:
        CardRarity
): string {

    return (
        rarities.find(
            item =>
                item.id
                ===
                rarity
        )?.icon
        ??
        "🃏"
    );

}


function getStatusLabel(
    status:
        CardStatus
): string {

    switch (
        status
    ) {

        case "active":

            return "Active";


        case "draft":

            return "Brouillon";


        case "disabled":

            return "Désactivée";


        default:

            return status;

    }

}


function formatCardNumber(
    number:
        number
): string {

    return `#${String(
        number
    ).padStart(
        3,
        "0"
    )}`;

}


/* =========================================================
   MESSAGE
========================================================= */

function clearMessages() {

    errorMessage.value =
        "";


    successMessage.value =
        "";

}


/* =========================================================
   LOAD CARDS
========================================================= */

async function loadCards() {

    loading.value =
        true;


    clearMessages();


    try {

        cards.value =
            await getAdminCards();

    }
    catch (
        error
    ) {

        console.error(
            "Erreur chargement cartes admin :",
            error
        );


        errorMessage.value =
            error instanceof Error

                ? error.message

                : "Impossible de récupérer les cartes.";

    }
    finally {

        loading.value =
            false;

    }

}


/* =========================================================
   CREATE
========================================================= */

function openCreateForm() {

    clearMessages();


    selectedCard.value =
        null;


    showForm.value =
        true;

}


/* =========================================================
   EDIT
========================================================= */

function openEditForm(
    card:
        Card
) {

    clearMessages();


    selectedCard.value =
        card;


    showForm.value =
        true;

}


/* =========================================================
   CLOSE FORM
========================================================= */

function closeForm() {

    showForm.value =
        false;


    selectedCard.value =
        null;

}


/* =========================================================
   CARD SAVED
========================================================= */

function handleCardSaved(
    savedCard:
        Card
) {

    const index =
        cards.value.findIndex(
            card =>
                card.id
                ===
                savedCard.id
        );


    /* =====================================================
       UPDATE EXISTING CARD
    ===================================================== */

    if (
        index
        !==
        -1
    ) {

        cards.value[index] =
            savedCard;


        successMessage.value =
            `La carte "${savedCard.name}" a été modifiée.`;

    }


    /* =====================================================
       NEW CARD
    ===================================================== */

    else {

        cards.value.push(
            savedCard
        );


        cards.value.sort(
            (
                a,
                b
            ) =>
                a.number
                -
                b.number
        );


        successMessage.value =
            `La carte "${savedCard.name}" a été créée.`;

    }


    closeForm();

}


/* =========================================================
   TOGGLE STATUS
========================================================= */

async function toggleCardStatus(
    card:
        Card
) {

    if (
        processingCardId.value
    ) {

        return;

    }


    clearMessages();


    const newStatus:
        CardStatus =
            card.status
            ===
            "active"

                ? "disabled"

                : "active";


    processingCardId.value =
        card.id;


    try {

        const updated =
            await updateCardStatus(
                card.id,
                newStatus
            );


        const index =
            cards.value.findIndex(
                item =>
                    item.id
                    ===
                    card.id
            );


        if (
            index
            !==
            -1
        ) {

            cards.value[index] =
                updated;

        }


        successMessage.value =
            newStatus
            ===
            "active"

                ? `La carte "${card.name}" est maintenant active.`

                : `La carte "${card.name}" a été désactivée.`;

    }
    catch (
        error
    ) {

        console.error(
            "Erreur changement statut carte :",
            error
        );


        errorMessage.value =
            error instanceof Error

                ? error.message

                : "Impossible de modifier le statut de la carte.";

    }
    finally {

        processingCardId.value =
            null;

    }

}


/* =========================================================
   DELETE
========================================================= */

async function removeCard(
    card:
        Card
) {

    if (
        processingCardId.value
    ) {

        return;

    }


    const confirmed =
        window.confirm(
            `Supprimer définitivement la carte ${formatCardNumber(
                card.number
            )} "${card.name}" ?\n\nUne carte déjà obtenue par un utilisateur ne pourra pas être supprimée.`
        );


    if (
        !confirmed
    ) {

        return;

    }


    clearMessages();


    processingCardId.value =
        card.id;


    try {

        await deleteCard(
            card.id
        );


        cards.value =
            cards.value.filter(
                item =>
                    item.id
                    !==
                    card.id
            );


        successMessage.value =
            `La carte "${card.name}" a été supprimée.`;

    }
    catch (
        error
    ) {

        console.error(
            "Erreur suppression carte :",
            error
        );


        errorMessage.value =
            error instanceof Error

                ? error.message

                : "Impossible de supprimer la carte.";

    }
    finally {

        processingCardId.value =
            null;

    }

}


/* =========================================================
   MOUNT
========================================================= */

onMounted(
    loadCards
);

</script>


<template>

    <section
        class="admin-cards"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header
            class="admin-cards__header"
        >

            <div>

                <span
                    class="admin-cards__eyebrow"
                >
                    🃏 COLLECTION
                </span>


                <h2>
                    Gestion des cartes
                </h2>


                <p>
                    Crée, organise et publie les cartes
                    disponibles dans la collection Couaxia.
                </p>

            </div>


            <button
                type="button"
                class="
                    admin-button
                    admin-button--primary
                "
                @click="
                    openCreateForm
                "
            >
                ＋ Nouvelle carte
            </button>

        </header>


        <!-- =================================================
             STATS
        ================================================== -->

        <div
            class="admin-cards__stats"
        >

            <article
                class="admin-cards__stat"
            >

                <span>
                    🃏
                </span>

                <div>

                    <strong>
                        {{ totalCards }}
                    </strong>

                    <small>
                        Cartes
                    </small>

                </div>

            </article>


            <article
                class="admin-cards__stat"
            >

                <span>
                    ✨
                </span>

                <div>

                    <strong>
                        {{ activeCards }}
                    </strong>

                    <small>
                        Actives
                    </small>

                </div>

            </article>


            <article
                class="admin-cards__stat"
            >

                <span>
                    📝
                </span>

                <div>

                    <strong>
                        {{ draftCards }}
                    </strong>

                    <small>
                        Brouillons
                    </small>

                </div>

            </article>


            <article
                class="admin-cards__stat"
            >

                <span>
                    ⏳
                </span>

                <div>

                    <strong>
                        {{ limitedCards }}
                    </strong>

                    <small>
                        Limitées
                    </small>

                </div>

            </article>

        </div>


        <!-- =================================================
             MESSAGES
        ================================================== -->

        <div
            v-if="
                errorMessage
            "
            class="
                admin-message
                admin-message--error
            "
        >
            ⚠️ {{ errorMessage }}
        </div>


        <div
            v-if="
                successMessage
            "
            class="
                admin-message
                admin-message--success
            "
        >
            ✓ {{ successMessage }}
        </div>


        <!-- =================================================
             TOOLBAR
        ================================================== -->

        <div
            class="admin-cards__toolbar"
        >

            <label
                class="admin-cards__search"
            >

                <span>
                    🔎
                </span>

                <input
                    v-model="
                        search
                    "
                    type="search"
                    placeholder="Rechercher une carte..."
                >

            </label>


            <select
                v-model="
                    rarityFilter
                "
                class="admin-cards__select"
            >

                <option
                    value="all"
                >
                    Toutes les raretés
                </option>


                <option
                    v-for="
                        rarity
                        in
                        rarities
                    "
                    :key="
                        rarity.id
                    "
                    :value="
                        rarity.id
                    "
                >
                    {{ rarity.label }}
                </option>

            </select>


            <select
                v-model="
                    statusFilter
                "
                class="admin-cards__select"
            >

                <option
                    value="all"
                >
                    Tous les statuts
                </option>

                <option
                    value="active"
                >
                    Actives
                </option>

                <option
                    value="draft"
                >
                    Brouillons
                </option>

                <option
                    value="disabled"
                >
                    Désactivées
                </option>

            </select>


            <button
                type="button"
                class="
                    admin-button
                    admin-button--secondary
                "
                :disabled="
                    loading
                "
                @click="
                    loadCards
                "
            >
                ↻ Actualiser
            </button>

        </div>


        <!-- =================================================
             LOADING
        ================================================== -->

        <div
            v-if="
                loading
            "
            class="admin-cards__state"
        >

            <span>
                🐙
            </span>

            <strong>
                Chargement des cartes...
            </strong>

        </div>


        <!-- =================================================
             EMPTY
        ================================================== -->

        <div
            v-else-if="
                filteredCards.length
                ===
                0
            "
            class="admin-cards__state"
        >

            <span>
                🃏
            </span>


            <strong>
                Aucune carte
            </strong>


            <p
                v-if="
                    cards.length
                    ===
                    0
                "
            >
                Ta collection ne contient encore aucune carte.
            </p>


            <p
                v-else
            >
                Aucune carte ne correspond à tes filtres.
            </p>


            <button
                v-if="
                    cards.length
                    ===
                    0
                "
                type="button"
                class="
                    admin-button
                    admin-button--primary
                "
                @click="
                    openCreateForm
                "
            >
                Créer ma première carte
            </button>

        </div>


        <!-- =================================================
             CARDS
        ================================================== -->

        <div
            v-else
            class="admin-cards__grid"
        >

            <article
                v-for="
                    card
                    in
                    filteredCards
                "
                :key="
                    card.id
                "
                class="admin-card"
            >

                <!-- =========================================
                     IMAGE
                ========================================== -->

                <div
                    class="admin-card__image"
                >

                    <img
                        :src="
                            card.imageUrl
                        "
                        :alt="
                            card.name
                        "
                        loading="lazy"
                    >


                    <span
                        class="admin-card__number"
                    >
                        {{
                            formatCardNumber(
                                card.number
                            )
                        }}
                    </span>


                    <span
                        v-if="
                            card.limited
                        "
                        class="admin-card__limited"
                    >
                        LIMITÉE
                    </span>

                </div>


                <!-- =========================================
                     BODY
                ========================================== -->

                <div
                    class="admin-card__body"
                >

                    <div
                        class="admin-card__heading"
                    >

                        <div>

                            <span
                                class="admin-card__rarity"
                                :data-rarity="
                                    card.rarity
                                "
                            >
                                {{
                                    getRarityIcon(
                                        card.rarity
                                    )
                                }}

                                {{
                                    getRarityLabel(
                                        card.rarity
                                    )
                                }}
                            </span>


                            <h3>
                                {{ card.name }}
                            </h3>

                        </div>


                        <span
                            class="admin-card__status"
                            :data-status="
                                card.status
                            "
                        >
                            {{
                                getStatusLabel(
                                    card.status
                                )
                            }}
                        </span>

                    </div>


                    <p
                        v-if="
                            card.description
                        "
                        class="admin-card__description"
                    >
                        {{ card.description }}
                    </p>


                    <div
                        class="admin-card__meta"
                    >

                        <span>
                            Catégorie :
                            <strong>
                                {{ card.category }}
                            </strong>
                        </span>


                        <span>
                            Poids :
                            <strong>
                                {{ card.weight }}
                            </strong>
                        </span>


                        <span
                            v-if="
                                card.artist
                            "
                        >
                            Art :
                            <strong>
                                {{ card.artist }}
                            </strong>
                        </span>

                    </div>

                </div>


                <!-- =========================================
                     ACTIONS
                ========================================== -->

                <footer
                    class="admin-card__actions"
                >

                    <button
                        type="button"
                        class="
                            admin-button
                            admin-button--secondary
                        "
                        :disabled="
                            processingCardId
                            ===
                            card.id
                        "
                        @click="
                            openEditForm(
                                card
                            )
                        "
                    >
                        ✏️ Modifier
                    </button>


                    <button
                        type="button"
                        class="
                            admin-button
                            admin-button--secondary
                        "
                        :disabled="
                            processingCardId
                            ===
                            card.id
                        "
                        @click="
                            toggleCardStatus(
                                card
                            )
                        "
                    >
                        {{
                            card.status
                            ===
                            "active"

                                ? "⏸ Désactiver"

                                : "▶ Activer"
                        }}
                    </button>


                    <button
                        type="button"
                        class="
                            admin-button
                            admin-card__delete
                        "
                        :disabled="
                            processingCardId
                            ===
                            card.id
                        "
                        @click="
                            removeCard(
                                card
                            )
                        "
                    >
                        🗑 Supprimer
                    </button>

                </footer>

            </article>

        </div>


        <!-- =================================================
             CARD FORM MODAL
        ================================================== -->

        <div
            v-if="
                showForm
            "
            class="admin-card-modal"
            @click.self="
                closeForm
            "
        >

            <section
                class="admin-card-modal__content"
            >

                <header>

                    <div>

                        <span>
                            🃏 ADMINISTRATION
                        </span>


                        <h2>
                            {{
                                selectedCard
                                    ? "Modifier la carte"
                                    : "Nouvelle carte"
                            }}
                        </h2>

                    </div>


                    <button
                        type="button"
                        class="admin-card-modal__close"
                        aria-label="Fermer"
                        @click="
                            closeForm
                        "
                    >
                        ×
                    </button>

                </header>


                <AdminCardForm
                    :card="
                        selectedCard
                    "
                    @saved="
                        handleCardSaved
                    "
                    @cancel="
                        closeForm
                    "
                />

            </section>

        </div>

    </section>

</template>


<style scoped>

/* =========================================================
   ROOT
========================================================= */

.admin-cards {
    display: grid;
    gap: 24px;
}


/* =========================================================
   HEADER
========================================================= */

.admin-cards__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
}


.admin-cards__header h2 {
    margin: 6px 0 8px;
    font-size: clamp(1.5rem, 3vw, 2rem);
}


.admin-cards__header p {
    margin: 0;
    max-width: 700px;
    opacity: 0.72;
}


.admin-cards__eyebrow {
    color: #f22292;
    font-size: 0.76rem;
    font-weight: 900;
    letter-spacing: 0.14em;
}


/* =========================================================
   BUTTONS
========================================================= */

.admin-button {
    min-height: 42px;
    padding: 0 15px;
    border: 1px solid transparent;
    border-radius: 11px;
    color: inherit;
    font: inherit;
    font-weight: 800;
    cursor: pointer;
    transition:
        transform 160ms ease,
        opacity 160ms ease,
        background 160ms ease,
        border-color 160ms ease;
}


.admin-button:hover:not(:disabled) {
    transform: translateY(-1px);
}


.admin-button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}


.admin-button--primary {
    border-color:
        rgba(
            242,
            34,
            146,
            0.35
        );
    background:
        linear-gradient(
            135deg,
            #f22292,
            #6d00a3
        );
    color: #ffffff;
}


.admin-button--secondary {
    border-color:
        rgba(
            255,
            255,
            255,
            0.1
        );
    background:
        rgba(
            255,
            255,
            255,
            0.05
        );
}


/* =========================================================
   STATS
========================================================= */

.admin-cards__stats {
    display: grid;
    grid-template-columns:
        repeat(
            4,
            minmax(
                0,
                1fr
            )
        );
    gap: 14px;
}


.admin-cards__stat {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
    padding: 18px;
    border:
        1px solid
        rgba(
            255,
            255,
            255,
            0.09
        );
    border-radius: 18px;
    background:
        rgba(
            255,
            255,
            255,
            0.04
        );
}


.admin-cards__stat > span {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    flex: 0 0 44px;
    border-radius: 14px;
    background:
        rgba(
            242,
            34,
            146,
            0.12
        );
    font-size: 1.35rem;
}


.admin-cards__stat div {
    display: grid;
}


.admin-cards__stat strong {
    font-size: 1.35rem;
}


.admin-cards__stat small {
    opacity: 0.62;
}


/* =========================================================
   MESSAGES
========================================================= */

.admin-message {
    padding: 13px 15px;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 700;
}


.admin-message--error {
    border:
        1px solid
        rgba(
            255,
            90,
            90,
            0.2
        );
    background:
        rgba(
            255,
            90,
            90,
            0.08
        );
    color: #ff9d9d;
}


.admin-message--success {
    border:
        1px solid
        rgba(
            85,
            214,
            139,
            0.2
        );
    background:
        rgba(
            85,
            214,
            139,
            0.08
        );
    color: #7ee8a9;
}


/* =========================================================
   TOOLBAR
========================================================= */

.admin-cards__toolbar {
    display: grid;
    grid-template-columns:
        minmax(
            220px,
            1fr
        )
        auto
        auto
        auto;
    gap: 12px;
}


.admin-cards__search {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    padding: 0 14px;
    border:
        1px solid
        rgba(
            255,
            255,
            255,
            0.1
        );
    border-radius: 12px;
    background:
        rgba(
            0,
            0,
            0,
            0.18
        );
}


.admin-cards__search input {
    width: 100%;
    min-width: 0;
    padding: 12px 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: inherit;
    font: inherit;
}


.admin-cards__select {
    min-height: 44px;
    padding: 0 14px;
    border:
        1px solid
        rgba(
            255,
            255,
            255,
            0.1
        );
    border-radius: 12px;
    background: #18131f;
    color: inherit;
    font: inherit;
}


/* =========================================================
   STATE
========================================================= */

.admin-cards__state {
    display: grid;
    place-items: center;
    gap: 10px;
    min-height: 280px;
    padding: 30px;
    border:
        1px dashed
        rgba(
            255,
            255,
            255,
            0.14
        );
    border-radius: 20px;
    text-align: center;
}


.admin-cards__state > span {
    font-size: 2.8rem;
}


.admin-cards__state p {
    margin: 0;
    opacity: 0.7;
}


/* =========================================================
   GRID
========================================================= */

.admin-cards__grid {
    display: grid;
    grid-template-columns:
        repeat(
            auto-fill,
            minmax(
                280px,
                1fr
            )
        );
    gap: 20px;
}


/* =========================================================
   CARD
========================================================= */

.admin-card {
    display: flex;
    min-width: 0;
    overflow: hidden;
    flex-direction: column;
    border:
        1px solid
        rgba(
            255,
            255,
            255,
            0.09
        );
    border-radius: 20px;
    background:
        rgba(
            255,
            255,
            255,
            0.035
        );
    transition:
        transform 180ms ease,
        border-color 180ms ease;
}


.admin-card:hover {
    transform:
        translateY(
            -3px
        );
    border-color:
        rgba(
            242,
            34,
            146,
            0.35
        );
}


/* =========================================================
   IMAGE
========================================================= */

.admin-card__image {
    position: relative;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background:
        rgba(
            0,
            0,
            0,
            0.3
        );
}


.admin-card__image img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}


.admin-card__number,
.admin-card__limited {
    position: absolute;
    top: 12px;
    padding: 6px 9px;
    border-radius: 9px;
    background:
        rgba(
            8,
            5,
            13,
            0.84
        );
    backdrop-filter:
        blur(
            8px
        );
    font-size: 0.72rem;
    font-weight: 900;
}


.admin-card__number {
    left: 12px;
}


.admin-card__limited {
    right: 12px;
    color: #ffe49a;
}


/* =========================================================
   BODY
========================================================= */

.admin-card__body {
    display: grid;
    gap: 14px;
    padding: 18px;
    flex: 1;
}


.admin-card__heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
}


.admin-card__heading h3 {
    margin: 5px 0 0;
    font-size: 1.12rem;
}


.admin-card__rarity {
    font-size: 0.75rem;
    font-weight: 800;
}


.admin-card__rarity[data-rarity="common"] {
    color: #b8b8b8;
}


.admin-card__rarity[data-rarity="uncommon"] {
    color: #55d68b;
}


.admin-card__rarity[data-rarity="rare"] {
    color: #3fa9f5;
}


.admin-card__rarity[data-rarity="epic"] {
    color: #c07aff;
}


.admin-card__rarity[data-rarity="legendary"] {
    color: #f6b73c;
}


.admin-card__rarity[data-rarity="mythic"] {
    color: #f22292;
}


/* =========================================================
   STATUS
========================================================= */

.admin-card__status {
    flex: 0 0 auto;
    padding: 5px 8px;
    border-radius: 999px;
    font-size: 0.68rem;
    font-weight: 900;
}


.admin-card__status[data-status="active"] {
    background:
        rgba(
            85,
            214,
            139,
            0.14
        );
    color: #55d68b;
}


.admin-card__status[data-status="draft"] {
    background:
        rgba(
            246,
            183,
            60,
            0.14
        );
    color: #f6b73c;
}


.admin-card__status[data-status="disabled"] {
    background:
        rgba(
            255,
            255,
            255,
            0.08
        );
    opacity: 0.7;
}


/* =========================================================
   DESCRIPTION
========================================================= */

.admin-card__description {
    margin: 0;
    opacity: 0.7;
    line-height: 1.55;
}


/* =========================================================
   META
========================================================= */

.admin-card__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}


.admin-card__meta span {
    padding: 5px 8px;
    border-radius: 8px;
    background:
        rgba(
            255,
            255,
            255,
            0.05
        );
    font-size: 0.72rem;
}


/* =========================================================
   ACTIONS
========================================================= */

.admin-card__actions {
    display: grid;
    grid-template-columns:
        repeat(
            3,
            minmax(
                0,
                1fr
            )
        );
    gap: 8px;
    padding: 14px 18px 18px;
}


.admin-card__actions button {
    min-width: 0;
}


.admin-card__delete {
    border:
        1px solid
        rgba(
            255,
            90,
            90,
            0.22
        );
    background:
        rgba(
            255,
            90,
            90,
            0.08
        );
    color: #ff8e8e;
}


/* =========================================================
   MODAL
========================================================= */

.admin-card-modal {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: grid;
    place-items: center;
    padding: 24px;
    background:
        rgba(
            5,
            3,
            10,
            0.78
        );
    backdrop-filter:
        blur(
            10px
        );
}


.admin-card-modal__content {
    width:
        min(
            100%,
            1100px
        );
    max-height:
        calc(
            100vh
            -
            48px
        );
    overflow: auto;
    border:
        1px solid
        rgba(
            255,
            255,
            255,
            0.12
        );
    border-radius: 24px;
    background: #17111f;
    box-shadow:
        0
        30px
        100px
        rgba(
            0,
            0,
            0,
            0.5
        );
}


.admin-card-modal__content > header {
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 20px 24px;
    border-bottom:
        1px solid
        rgba(
            255,
            255,
            255,
            0.08
        );
    background:
        rgba(
            23,
            17,
            31,
            0.94
        );
    backdrop-filter:
        blur(
            12px
        );
}


.admin-card-modal__content h2 {
    margin: 5px 0 0;
}


.admin-card-modal__content header span {
    color: #f22292;
    font-size: 0.72rem;
    font-weight: 900;
    letter-spacing: 0.12em;
}


.admin-card-modal__close {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    flex: 0 0 42px;
    border:
        1px solid
        rgba(
            255,
            255,
            255,
            0.1
        );
    border-radius: 50%;
    background:
        rgba(
            255,
            255,
            255,
            0.05
        );
    color: inherit;
    cursor: pointer;
    font-size: 1.5rem;
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (
    max-width: 1000px
) {

    .admin-cards__stats {
        grid-template-columns:
            repeat(
                2,
                minmax(
                    0,
                    1fr
                )
            );
    }


    .admin-cards__toolbar {
        grid-template-columns:
            1fr
            1fr;
    }

}


@media (
    max-width: 680px
) {

    .admin-cards__header {
        flex-direction: column;
    }


    .admin-cards__header > button {
        width: 100%;
    }


    .admin-cards__stats {
        grid-template-columns:
            1fr;
    }


    .admin-cards__toolbar {
        grid-template-columns:
            1fr;
    }


    .admin-cards__grid {
        grid-template-columns:
            1fr;
    }


    .admin-card__actions {
        grid-template-columns:
            1fr;
    }


    .admin-card-modal {
        padding: 10px;
    }


    .admin-card-modal__content {
        max-height:
            calc(
                100vh
                -
                20px
            );
        border-radius: 18px;
    }

}


/* =========================================================
   LIGHT THEME
========================================================= */

:global(
    html[data-theme="light"]
)
.admin-cards__stat,

:global(
    html[data-theme="light"]
)
.admin-card {
    border-color:
        rgba(
            109,
            0,
            163,
            0.12
        );
    background:
        rgba(
            255,
            255,
            255,
            0.7
        );
}


:global(
    html[data-theme="light"]
)
.admin-cards__search {
    border-color:
        rgba(
            109,
            0,
            163,
            0.15
        );
    background:
        rgba(
            255,
            255,
            255,
            0.7
        );
}


:global(
    html[data-theme="light"]
)
.admin-cards__select {
    border-color:
        rgba(
            109,
            0,
            163,
            0.15
        );
    background: #ffffff;
}


:global(
    html[data-theme="light"]
)
.admin-button--secondary {
    border-color:
        rgba(
            109,
            0,
            163,
            0.15
        );
    background:
        rgba(
            109,
            0,
            163,
            0.05
        );
}


:global(
    html[data-theme="light"]
)
.admin-card-modal__content {
    background: #ffffff;
}


:global(
    html[data-theme="light"]
)
.admin-card-modal__content > header {
    background:
        rgba(
            255,
            255,
            255,
            0.94
        );
}

</style>