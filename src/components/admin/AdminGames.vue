<script setup lang="ts">

import {
    computed,
    onMounted,
    ref
} from "vue";

import {
    createAdminGame,
    deleteAdminGame,
    getAdminGames,
    updateAdminGame
} from "../../services/admin.service";

import type {
    AdminGame,
    CreateGamePayload
} from "../../services/admin.service";


/* =========================================================
   TYPES
========================================================= */

interface GameForm {

    twitch_game_id: string;

    twitch_name: string;

    box_art_url: string;

    status: string;

    tags: string;

    description: string;

    rating: string;

    youtube_playlist: string;

    poll_enabled: boolean;
}


/* =========================================================
   STATE
========================================================= */

const games =
    ref<AdminGame[]>([]);


const loading =
    ref(true);


const saving =
    ref(false);


const deletingGameId =
    ref<string | null>(
        null
    );


const selectedGame =
    ref<AdminGame | null>(
        null
    );


const editing =
    ref(false);


const formOpen =
    ref(false);


const search =
    ref("");


const filter =
    ref<
        "all"
        |
        "poll"
        |
        "no-poll"
    >(
        "all"
    );


const errorMessage =
    ref("");


const successMessage =
    ref("");


/* =========================================================
   EMPTY FORM
========================================================= */

function createEmptyForm():
    GameForm {

    return {

        twitch_game_id:
            "",

        twitch_name:
            "",

        box_art_url:
            "",

        status:
            "active",

        tags:
            "",

        description:
            "",

        rating:
            "",

        youtube_playlist:
            "",

        poll_enabled:
            false

    };

}


const form =
    ref<GameForm>(
        createEmptyForm()
    );


/* =========================================================
   COMPUTED — FILTERED GAMES
========================================================= */

const filteredGames =
    computed(
        () => {

            const query =
                search.value
                    .trim()
                    .toLowerCase();


            return games.value.filter(
                game => {

                    /* =========================================
                       SEARCH
                    ========================================= */

                    const name =
                        game.twitch_name
                            ?.toLowerCase()
                        ??
                        "";


                    const description =
                        game.description
                            ?.toLowerCase()
                        ??
                        "";


                    const tags =
                        game.tags
                            ?.toLowerCase()
                        ??
                        "";


                    const status =
                        game.status
                            ?.toLowerCase()
                        ??
                        "";


                    const matchesSearch =
                        !query
                        ||
                        name.includes(
                            query
                        )
                        ||
                        description.includes(
                            query
                        )
                        ||
                        tags.includes(
                            query
                        )
                        ||
                        status.includes(
                            query
                        );


                    /* =========================================
                       FILTER
                    ========================================= */

                    let matchesFilter =
                        true;


                    if (
                        filter.value
                        ===
                        "poll"
                    ) {

                        matchesFilter =
                            game.poll_enabled
                            ===
                            true;

                    }


                    if (
                        filter.value
                        ===
                        "no-poll"
                    ) {

                        matchesFilter =
                            game.poll_enabled
                            !==
                            true;

                    }


                    return (
                        matchesSearch
                        &&
                        matchesFilter
                    );

                }
            );

        }
    );


/* =========================================================
   STATS
========================================================= */

const pollGamesCount =
    computed(
        () =>
            games.value.filter(
                game =>
                    game.poll_enabled
                    ===
                    true
            ).length
    );


const activeGamesCount =
    computed(
        () =>
            games.value.filter(
                game =>
                    game.status
                    ===
                    "active"
            ).length
    );


const gamesWithRatingCount =
    computed(
        () =>
            games.value.filter(
                game =>
                    game.rating
                    !==
                    null
            ).length
    );


/* =========================================================
   CAN SAVE
========================================================= */

const canSave =
    computed(
        () => {

            if (
                saving.value
            ) {

                return false;

            }


            if (
                !form.value.twitch_name.trim()
            ) {

                return false;

            }


            return true;

        }
    );


/* =========================================================
   GAME IMAGE
========================================================= */

function getGameImage(
    game:
        AdminGame
): string | null {

    if (
        !game.box_art_url
    ) {

        return null;

    }


    return game.box_art_url
        .replace(
            "{width}",
            "285"
        )
        .replace(
            "{height}",
            "380"
        );

}


/* =========================================================
   FORM IMAGE
========================================================= */

const formImage =
    computed(
        () => {

            if (
                !form.value.box_art_url
            ) {

                return null;

            }


            return form.value.box_art_url
                .replace(
                    "{width}",
                    "285"
                )
                .replace(
                    "{height}",
                    "380"
                );

        }
    );


/* =========================================================
   LOAD GAMES
========================================================= */

async function loadGames() {

    loading.value =
        true;


    errorMessage.value =
        "";


    try {

        games.value =
            await getAdminGames();

    } catch (error) {

        console.error(
            "Erreur chargement jeux admin :",
            error
        );


        errorMessage.value =
            error instanceof Error
                ? error.message
                : "Impossible de charger les jeux.";

    } finally {

        loading.value =
            false;

    }

}


/* =========================================================
   OPEN CREATE
========================================================= */

function openCreate() {

    selectedGame.value =
        null;


    editing.value =
        false;


    form.value =
        createEmptyForm();


    errorMessage.value =
        "";


    successMessage.value =
        "";


    formOpen.value =
        true;

}


/* =========================================================
   OPEN EDIT
========================================================= */

function openEdit(
    game:
        AdminGame
) {

    selectedGame.value =
        game;


    editing.value =
        true;


    errorMessage.value =
        "";


    successMessage.value =
        "";


    form.value = {

        twitch_game_id:
            game.twitch_game_id
            ??
            "",

        twitch_name:
            game.twitch_name
            ??
            "",

        box_art_url:
            game.box_art_url
            ??
            "",

        status:
            game.status
            ??
            "active",

        tags:
            game.tags
            ??
            "",

        description:
            game.description
            ??
            "",

        rating:
            game.rating
            !==
            null
                ? String(
                    game.rating
                )
                : "",

        youtube_playlist:
            game.youtube_playlist
            ??
            "",

        poll_enabled:
            game.poll_enabled
            ??
            false

    };


    formOpen.value =
        true;

}


/* =========================================================
   CLOSE FORM
========================================================= */

function closeForm() {

    if (
        saving.value
    ) {

        return;

    }


    formOpen.value =
        false;


    selectedGame.value =
        null;


    editing.value =
        false;


    form.value =
        createEmptyForm();

}


/* =========================================================
   PARSE RATING
========================================================= */

function parseRating():
    number | null {

    const value =
        form.value.rating.trim();


    if (
        !value
    ) {

        return null;

    }


    const rating =
        Number(
            value.replace(
                ",",
                "."
            )
        );


    if (
        Number.isNaN(
            rating
        )
    ) {

        return null;

    }


    return rating;

}


/* =========================================================
   SAVE GAME
========================================================= */

async function saveGame() {

    if (
        !canSave.value
    ) {

        return;

    }


    saving.value =
        true;


    errorMessage.value =
        "";


    successMessage.value =
        "";


    try {

        const rating =
            parseRating();


        if (
            form.value.rating.trim()
            &&
            rating
            ===
            null
        ) {

            throw new Error(
                "La note doit être un nombre valide."
            );

        }


        const payload:
            CreateGamePayload = {

            twitch_game_id:
                form.value.twitch_game_id
                    .trim(),

            twitch_name:
                form.value.twitch_name
                    .trim(),

            box_art_url:
                form.value.box_art_url
                    .trim()
                ||
                null,

            status:
                form.value.status
                    .trim()
                ||
                null,

            tags:
                form.value.tags
                    .trim()
                ||
                null,

            description:
                form.value.description
                    .trim()
                ||
                null,

            rating,

            youtube_playlist:
                form.value.youtube_playlist
                    .trim()
                ||
                null,

            poll_enabled:
                form.value.poll_enabled

        };


        /* =================================================
           UPDATE
        ================================================== */

        if (
            editing.value
            &&
            selectedGame.value
        ) {

            await updateAdminGame(
                selectedGame.value.id,
                payload
            );


            successMessage.value =
                "Le jeu a bien été modifié. 🎮";

        }

        /* =================================================
           CREATE
        ================================================== */

        else {

            await createAdminGame(
                payload
            );


            successMessage.value =
                "Le jeu a bien été ajouté. 🎮";

        }


        await loadGames();


        closeForm();

    } catch (error) {

        console.error(
            "Erreur sauvegarde jeu :",
            error
        );


        errorMessage.value =
            error instanceof Error
                ? error.message
                : "Impossible d'enregistrer le jeu.";

    } finally {

        saving.value =
            false;

    }

}


/* =========================================================
   TOGGLE POLL
========================================================= */

async function togglePollEnabled(
    game:
        AdminGame
) {

    errorMessage.value =
        "";


    successMessage.value =
        "";


    try {

        const updatedGame =
            await updateAdminGame(
                game.id,
                {
                    poll_enabled:
                        !game.poll_enabled
                }
            );


        const index =
            games.value.findIndex(
                currentGame =>
                    currentGame.id
                    ===
                    game.id
            );


        if (
            index
            >=
            0
        ) {

            games.value[index] =
                updatedGame;

        }


        successMessage.value =
            updatedGame.poll_enabled

                ? `${updatedGame.twitch_name ?? "Le jeu"} peut maintenant être utilisé dans les sondages.`

                : `${updatedGame.twitch_name ?? "Le jeu"} a été retiré des sondages.`;

    } catch (error) {

        console.error(
            "Erreur modification poll_enabled :",
            error
        );


        errorMessage.value =
            error instanceof Error
                ? error.message
                : "Impossible de modifier le jeu.";

    }

}


/* =========================================================
   DELETE GAME
========================================================= */

async function removeGame(
    game:
        AdminGame
) {

    if (
        deletingGameId.value
    ) {

        return;

    }


    const gameName =
        game.twitch_name
        ??
        "Jeu sans nom";


    const confirmed =
        window.confirm(
            `Supprimer définitivement "${gameName}" ?`
        );


    if (
        !confirmed
    ) {

        return;

    }


    deletingGameId.value =
        game.id;


    errorMessage.value =
        "";


    successMessage.value =
        "";


    try {

        await deleteAdminGame(
            game.id
        );


        games.value =
            games.value.filter(
                currentGame =>
                    currentGame.id
                    !==
                    game.id
            );


        successMessage.value =
            `${gameName} a été supprimé.`;

    } catch (error) {

        console.error(
            "Erreur suppression jeu :",
            error
        );


        errorMessage.value =
            error instanceof Error
                ? error.message
                : "Impossible de supprimer le jeu.";

    } finally {

        deletingGameId.value =
            null;

    }

}


/* =========================================================
   FORMAT RATING
========================================================= */

function formatRating(
    rating:
        number | null
): string {

    if (
        rating
        ===
        null
    ) {

        return "Non noté";

    }


    return `${rating}/10`;

}


/* =========================================================
   MOUNT
========================================================= */

onMounted(
    loadGames
);

</script>


<template>

    <section
        class="admin-games"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header
            class="admin-section-header"
        >

            <div>

                <span
                    class="admin-section-header__eyebrow"
                >
                    🎮 BIBLIOTHÈQUE
                </span>


                <h2>
                    Jeux
                </h2>


                <p>
                    Gère les jeux présents sur ton site
                    et choisis ceux qui peuvent apparaître
                    dans les sondages.
                </p>

            </div>


            <button
                type="button"
                class="
                    admin-button
                    admin-button--primary
                "
                @click="openCreate"
            >
                ＋ Ajouter un jeu
            </button>

        </header>


        <!-- =================================================
             MESSAGES
        ================================================== -->

        <div
            v-if="successMessage"
            class="
                admin-message
                admin-message--success
            "
        >
            ✓ {{ successMessage }}
        </div>


        <div
            v-if="errorMessage"
            class="
                admin-message
                admin-message--error
            "
        >
            ⚠️ {{ errorMessage }}
        </div>


        <!-- =================================================
             LOADING
        ================================================== -->

        <div
            v-if="loading"
            class="admin-loading"
        >

            <span>
                🎮
            </span>


            <strong>
                Chargement des jeux...
            </strong>

        </div>


        <!-- =================================================
             CONTENT
        ================================================== -->

        <template
            v-else
        >

            <!-- =============================================
                 STATS
            ============================================== -->

            <div
                class="admin-mini-stats"
            >

                <article
                    class="admin-mini-stat"
                >

                    <span>
                        Jeux
                    </span>

                    <strong>
                        {{ games.length }}
                    </strong>

                </article>


                <article
                    class="admin-mini-stat"
                >

                    <span>
                        Actifs
                    </span>

                    <strong>
                        {{ activeGamesCount }}
                    </strong>

                </article>


                <article
                    class="admin-mini-stat"
                >

                    <span>
                        Sondages
                    </span>

                    <strong>
                        {{ pollGamesCount }}
                    </strong>

                </article>


                <article
                    class="admin-mini-stat"
                >

                    <span>
                        Notés
                    </span>

                    <strong>
                        {{ gamesWithRatingCount }}
                    </strong>

                </article>

            </div>


            <!-- =============================================
                 TOOLBAR
            ============================================== -->

            <div
                class="admin-games-toolbar"
            >

                <div
                    class="admin-search"
                >

                    <span>
                        🔎
                    </span>


                    <input
                        v-model="search"
                        type="search"
                        placeholder="Rechercher un jeu..."
                    >

                </div>


                <div
                    class="admin-games-filters"
                >

                    <button
                        type="button"
                        :class="{
                            'admin-games-filter--active':
                                filter === 'all'
                        }"
                        @click="filter = 'all'"
                    >
                        Tous
                    </button>


                    <button
                        type="button"
                        :class="{
                            'admin-games-filter--active':
                                filter === 'poll'
                        }"
                        @click="filter = 'poll'"
                    >
                        🗳️ Sondages
                    </button>


                    <button
                        type="button"
                        :class="{
                            'admin-games-filter--active':
                                filter === 'no-poll'
                        }"
                        @click="filter = 'no-poll'"
                    >
                        Hors sondage
                    </button>

                </div>

            </div>


            <!-- =============================================
                 COUNT
            ============================================== -->

            <div
                class="admin-games-count"
            >
                {{ filteredGames.length }}

                jeu{{
                    filteredGames.length > 1
                        ? "x"
                        : ""
                }}
            </div>


            <!-- =============================================
                 EMPTY
            ============================================== -->

            <div
                v-if="
                    filteredGames.length
                    ===
                    0
                "
                class="admin-empty"
            >

                <span>
                    🎮
                </span>


                <strong>
                    Aucun jeu
                </strong>


                <p>
                    Aucun jeu ne correspond
                    à tes critères.
                </p>

            </div>


            <!-- =============================================
                 GRID
            ============================================== -->

            <div
                v-else
                class="admin-games-grid"
            >

                <article
                    v-for="
                        game
                        in
                        filteredGames
                    "
                    :key="game.id"
                    class="admin-game-card"
                >

                    <!-- =====================================
                         IMAGE
                    ====================================== -->

                    <div
                        class="admin-game-card__image"
                    >

                        <img
                            v-if="getGameImage(game)"
                            :src="getGameImage(game) ?? ''"
                            :alt="
                                game.twitch_name
                                ||
                                'Jeu'
                            "
                        >


                        <div
                            v-else
                            class="
                                admin-game-card__placeholder
                            "
                        >
                            🎮
                        </div>


                        <span
                            v-if="game.poll_enabled"
                            class="
                                admin-game-card__poll-badge
                            "
                        >
                            🗳️ Sondage
                        </span>

                    </div>


                    <!-- =====================================
                         CONTENT
                    ====================================== -->

                    <div
                        class="admin-game-card__content"
                    >

                        <div
                            class="
                                admin-game-card__title-row
                            "
                        >

                            <h3>
                                {{
                                    game.twitch_name
                                    ||
                                    "Jeu sans nom"
                                }}
                            </h3>


                            <span
                                class="
                                    admin-game-card__rating
                                "
                            >
                                ⭐
                                {{
                                    formatRating(
                                        game.rating
                                    )
                                }}
                            </span>

                        </div>


                        <p
                            v-if="game.description"
                            class="
                                admin-game-card__description
                            "
                        >
                            {{ game.description }}
                        </p>


                        <p
                            v-else
                            class="
                                admin-game-card__description
                                admin-game-card__description--empty
                            "
                        >
                            Aucune description.
                        </p>


                        <div
                            v-if="game.tags"
                            class="
                                admin-game-card__tags
                            "
                        >
                            {{ game.tags }}
                        </div>


                        <!-- =================================
                             POLL SWITCH
                        ================================== -->

                        <label
                            class="
                                admin-game-card__poll-toggle
                            "
                        >

                            <div>

                                <strong>
                                    Utilisable en sondage
                                </strong>


                                <span>
                                    {{
                                        game.poll_enabled
                                            ? "Ce jeu peut être proposé."
                                            : "Ce jeu n'apparaît pas dans les sondages."
                                    }}
                                </span>

                            </div>


                            <input
                                type="checkbox"
                                :checked="
                                    game.poll_enabled === true
                                "
                                @change="
                                    togglePollEnabled(
                                        game
                                    )
                                "
                            >

                        </label>


                        <!-- =================================
                             ACTIONS
                        ================================== -->

                        <div
                            class="
                                admin-game-card__actions
                            "
                        >

                            <button
                                type="button"
                                class="
                                    admin-button
                                    admin-button--secondary
                                "
                                @click="
                                    openEdit(
                                        game
                                    )
                                "
                            >
                                ✎ Modifier
                            </button>


                            <button
                                type="button"
                                class="
                                    admin-button
                                    admin-button--danger
                                "
                                :disabled="
                                    deletingGameId
                                    ===
                                    game.id
                                "
                                @click="
                                    removeGame(
                                        game
                                    )
                                "
                            >

                                {{
                                    deletingGameId
                                    ===
                                    game.id
                                        ? "Suppression..."
                                        : "🗑"
                                }}

                            </button>

                        </div>

                    </div>

                </article>

            </div>

        </template>


        <!-- =================================================
             MODAL
        ================================================== -->

        <Teleport
            to="body"
        >

            <div
                v-if="formOpen"
                class="admin-modal"
                @click.self="closeForm"
            >

                <div
                    class="
                        admin-modal__dialog
                        admin-modal__dialog--large
                    "
                >

                    <!-- =====================================
                         HEADER
                    ====================================== -->

                    <header
                        class="admin-modal__header"
                    >

                        <div>

                            <span
                                class="admin-modal__eyebrow"
                            >
                                🎮 JEU
                            </span>


                            <h2>
                                {{
                                    editing
                                        ? "Modifier le jeu"
                                        : "Ajouter un jeu"
                                }}
                            </h2>

                        </div>


                        <button
                            type="button"
                            class="admin-modal__close"
                            :disabled="saving"
                            @click="closeForm"
                        >
                            ×
                        </button>

                    </header>


                    <!-- =====================================
                         FORM
                    ====================================== -->

                    <form
                        class="
                            admin-form
                            admin-game-form
                        "
                        @submit.prevent="saveGame"
                    >

                        <!-- =================================
                             PREVIEW + INFO
                        ================================== -->

                        <div
                            class="
                                admin-game-form__layout
                            "
                        >

                            <!-- =============================
                                 PREVIEW
                            ============================== -->

                            <aside
                                class="
                                    admin-game-form__preview
                                "
                            >

                                <div
                                    class="
                                        admin-game-form__cover
                                    "
                                >

                                    <img
                                        v-if="formImage"
                                        :src="
                                            formImage
                                            ??
                                            ''
                                        "
                                        :alt="
                                            form.twitch_name
                                            ||
                                            'Aperçu'
                                        "
                                    >


                                    <span
                                        v-else
                                    >
                                        🎮
                                    </span>

                                </div>


                                <strong>
                                    {{
                                        form.twitch_name
                                        ||
                                        "Nom du jeu"
                                    }}
                                </strong>


                                <small>
                                    Aperçu
                                </small>

                            </aside>


                            <!-- =============================
                                 FIELDS
                            ============================== -->

                            <div
                                class="
                                    admin-game-form__fields
                                "
                            >

                                <div
                                    class="admin-field"
                                >

                                    <label
                                        for="admin-game-name"
                                    >
                                        Nom du jeu *
                                    </label>


                                    <input
                                        id="admin-game-name"
                                        v-model="
                                            form.twitch_name
                                        "
                                        type="text"
                                        required
                                        placeholder="Party Animals"
                                    >

                                </div>


                                <div
                                    class="admin-field"
                                >

                                    <label
                                        for="admin-game-twitch-id"
                                    >
                                        ID Twitch
                                    </label>


                                    <input
                                        id="admin-game-twitch-id"
                                        v-model="
                                            form.twitch_game_id
                                        "
                                        type="text"
                                        placeholder="ID Twitch du jeu"
                                    >

                                </div>


                                <div
                                    class="admin-field"
                                >

                                    <label
                                        for="admin-game-image"
                                    >
                                        Image Twitch
                                    </label>


                                    <input
                                        id="admin-game-image"
                                        v-model="
                                            form.box_art_url
                                        "
                                        type="text"
                                        placeholder="https://..."
                                    >

                                </div>

                            </div>

                        </div>


                        <!-- =================================
                             STATUS + RATING
                        ================================== -->

                        <div
                            class="admin-form__row"
                        >

                            <div
                                class="admin-field"
                            >

                                <label
                                    for="admin-game-status"
                                >
                                    Statut
                                </label>


                                <select
                                    id="admin-game-status"
                                    v-model="
                                        form.status
                                    "
                                >

                                    <option value="active">
                                        Actif
                                    </option>

                                    <option value="inactive">
                                        Inactif
                                    </option>

                                    <option value="completed">
                                        Terminé
                                    </option>

                                    <option value="wishlist">
                                        À jouer
                                    </option>

                                </select>

                            </div>


                            <div
                                class="admin-field"
                            >

                                <label
                                    for="admin-game-rating"
                                >
                                    Note / 10
                                </label>


                                <input
                                    id="admin-game-rating"
                                    v-model="
                                        form.rating
                                    "
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    placeholder="8.5"
                                >

                            </div>

                        </div>


                        <!-- =================================
                             TAGS
                        ================================== -->

                        <div
                            class="admin-field"
                        >

                            <label
                                for="admin-game-tags"
                            >
                                Tags
                            </label>


                            <input
                                id="admin-game-tags"
                                v-model="
                                    form.tags
                                "
                                type="text"
                                placeholder="Multijoueur, Fun, Horreur..."
                            >

                        </div>


                        <!-- =================================
                             DESCRIPTION
                        ================================== -->

                        <div
                            class="admin-field"
                        >

                            <label
                                for="admin-game-description"
                            >
                                Description
                            </label>


                            <textarea
                                id="admin-game-description"
                                v-model="
                                    form.description
                                "
                                rows="5"
                                placeholder="Description du jeu..."
                            ></textarea>

                        </div>


                        <!-- =================================
                             YOUTUBE
                        ================================== -->

                        <div
                            class="admin-field"
                        >

                            <label
                                for="admin-game-youtube"
                            >
                                Playlist YouTube
                            </label>


                            <input
                                id="admin-game-youtube"
                                v-model="
                                    form.youtube_playlist
                                "
                                type="url"
                                placeholder="https://youtube.com/..."
                            >

                        </div>


                        <!-- =================================
                             POLL
                        ================================== -->

                        <label
                            class="
                                admin-switch-row
                                admin-game-form__poll
                            "
                        >

                            <div>

                                <strong>
                                    🗳️ Disponible dans les sondages
                                </strong>


                                <span>
                                    Le jeu pourra être sélectionné
                                    lorsque tu crées un sondage.
                                </span>

                            </div>


                            <input
                                v-model="
                                    form.poll_enabled
                                "
                                type="checkbox"
                            >

                        </label>


                        <!-- =================================
                             ACTIONS
                        ================================== -->

                        <footer
                            class="admin-form__actions"
                        >

                            <button
                                type="button"
                                class="
                                    admin-button
                                    admin-button--secondary
                                "
                                :disabled="saving"
                                @click="closeForm"
                            >
                                Annuler
                            </button>


                            <button
                                type="submit"
                                class="
                                    admin-button
                                    admin-button--primary
                                "
                                :disabled="
                                    !canSave
                                "
                            >

                                {{
                                    saving
                                        ? "Enregistrement..."
                                        : editing
                                            ? "Enregistrer"
                                            : "Ajouter le jeu"
                                }}

                            </button>

                        </footer>

                    </form>

                </div>

            </div>

        </Teleport>

    </section>

</template>