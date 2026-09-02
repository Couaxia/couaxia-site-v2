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

import {
    searchTwitchGames
} from "../../services/twitch-games.service";

import type {
    TwitchGame
} from "../../services/twitch-games.service";


/* =========================================================
   TYPES
========================================================= */

type GameFilter =
    | "all"
    | "poll"
    | "no-poll";


type GameStatus =
    | "current"
    | "regular"
    | "backlog"
    | "paused"
    | "finished";


interface GameForm {

    twitch_game_id:
        string;

    twitch_name:
        string;

    box_art_url:
        string;

    status:
        GameStatus;

    tags:
        string;

    description:
        string;

    rating:
        string | number;

    youtube_playlist:
        string;

    poll_enabled:
        boolean;

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
    ref<string | null>(null);


const selectedGame =
    ref<AdminGame | null>(null);


const editing =
    ref(false);


const formOpen =
    ref(false);


const search =
    ref("");


const filter =
    ref<GameFilter>("all");


const errorMessage =
    ref("");


const successMessage =
    ref("");


/* =========================================================
   TWITCH SEARCH STATE
========================================================= */

const twitchSearch =
    ref("");


const twitchResults =
    ref<TwitchGame[]>([]);


const twitchSearching =
    ref(false);


const twitchSearchError =
    ref("");


const twitchSearchPerformed =
    ref(false);


const selectedTwitchGame =
    ref<TwitchGame | null>(null);


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
            "backlog",

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
   NORMALIZE TAGS
========================================================= */

function getTagsText(
    value:
        unknown
): string {

    if (
        Array.isArray(value)
    ) {

        return value
            .map(
                tag =>
                    String(tag).trim()
            )
            .filter(Boolean)
            .join(", ");

    }


    if (
        typeof value ===
        "string"
    ) {

        return value;

    }


    return "";

}


/* =========================================================
   NORMALIZE SEARCH TEXT
========================================================= */

function normalizeSearchText(
    value:
        unknown
): string {

    return getTagsText(value)
        .toLowerCase()
        .trim();

}


/* =========================================================
   FILTERED GAMES
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

                    const name =
                        String(
                            game.twitch_name
                            ??
                            ""
                        ).toLowerCase();


                    const description =
                        String(
                            game.description
                            ??
                            ""
                        ).toLowerCase();


                    const tags =
                        normalizeSearchText(
                            game.tags
                        );


                    const status =
                        String(
                            game.status
                            ??
                            ""
                        ).toLowerCase();


                    const matchesSearch =
                        !query
                        ||
                        name.includes(query)
                        ||
                        description.includes(query)
                        ||
                        tags.includes(query)
                        ||
                        status.includes(query);


                    let matchesFilter =
                        true;


                    if (
                        filter.value ===
                        "poll"
                    ) {

                        matchesFilter =
                            game.poll_enabled ===
                            true;

                    }


                    if (
                        filter.value ===
                        "no-poll"
                    ) {

                        matchesFilter =
                            game.poll_enabled !==
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

const currentGamesCount =
    computed(
        () =>
            games.value.filter(
                game =>
                    game.status ===
                    "current"
            ).length
    );


const pollGamesCount =
    computed(
        () =>
            games.value.filter(
                game =>
                    game.poll_enabled ===
                    true
            ).length
    );


const gamesWithRatingCount =
    computed(
        () =>
            games.value.filter(
                game =>
                    game.rating !==
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
                !form.value.twitch_game_id.trim()
                ||
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

function formatBoxArt(
    value:
        string | null | undefined,
    width:
        number = 600,
    height:
        number = 800
): string | null {

    if (
        !value
    ) {

        return null;

    }


    const formattedUrl =
        value
            .replaceAll(
                "{width}",
                String(width)
            )
            .replaceAll(
                "{height}",
                String(height)
            )
            .replaceAll(
                "%{width}",
                String(width)
            )
            .replaceAll(
                "%{height}",
                String(height)
            );


    /*
     * Twitch peut aussi renvoyer une URL déjà dimensionnée,
     * par exemple :
     *
     * .../Phasmophobia-285x380.jpg
     *
     * On remplace alors cette taille par celle demandée.
     */

    return formattedUrl.replace(
        /-\d+x\d+(\.[a-zA-Z0-9]+)(\?.*)?$/,
        `-${width}x${height}$1$2`
    );

}


function getGameImage(
    game:
        AdminGame
): string | null {

    return formatBoxArt(
        game.box_art_url,
        600,
        800
    );

}


const formImage =
    computed(
        () =>
            formatBoxArt(
                form.value.box_art_url,
                400,
                533
            )
    );


function getTwitchResultImage(
    game:
        TwitchGame
): string | null {

    return formatBoxArt(
        game.rawBoxArtUrl
        ??
        game.boxArtUrl,
        285,
        380
    );

}


/* =========================================================
   STATUS LABEL
========================================================= */

function getStatusLabel(
    status:
        string | null
): string {

    switch (status) {

        case "current":
            return "En cours";

        case "regular":
            return "Régulier";

        case "backlog":
            return "À faire";

        case "paused":
            return "En pause";

        case "finished":
            return "Terminé";

        default:
            return status || "Non défini";

    }

}


/* =========================================================
   STATUS CLASS
========================================================= */

function getStatusClass(
    status:
        string | null
): string {

    switch (status) {

        case "current":
            return "admin-game-status--current";

        case "regular":
            return "admin-game-status--regular";

        case "finished":
            return "admin-game-status--finished";

        case "paused":
            return "admin-game-status--paused";

        default:
            return "admin-game-status--backlog";

    }

}


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

    }
    catch (error) {

        console.error(
            "Erreur chargement jeux admin :",
            error
        );


        errorMessage.value =
            error instanceof Error
                ? error.message
                : "Impossible de charger les jeux.";

    }
    finally {

        loading.value =
            false;

    }

}


/* =========================================================
   RESET TWITCH SEARCH
========================================================= */

function resetTwitchSearch() {

    twitchSearch.value =
        "";


    twitchResults.value =
        [];


    twitchSearching.value =
        false;


    twitchSearchError.value =
        "";


    twitchSearchPerformed.value =
        false;


    selectedTwitchGame.value =
        null;

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


    resetTwitchSearch();


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


    twitchSearchError.value =
        "";


    twitchSearchPerformed.value =
        false;


    twitchResults.value =
        [];


    twitchSearch.value =
        game.twitch_name
        ??
        "";


    selectedTwitchGame.value = {

        id:
            game.twitch_game_id
            ??
            "",

        name:
            game.twitch_name
            ??
            "",

        boxArtUrl:
            formatBoxArt(
                game.box_art_url,
                285,
                380
            ),

        rawBoxArtUrl:
            game.box_art_url
            ??
            null

    };


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
            (
                game.status
                ??
                "backlog"
            ) as GameStatus,

        tags:
            getTagsText(
                game.tags
            ),

        description:
            game.description
            ??
            "",

        rating:
            game.rating !==
            null
                ? String(game.rating)
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


    resetTwitchSearch();

}


/* =========================================================
   FORCE CLOSE FORM
========================================================= */

function forceCloseForm() {

    formOpen.value =
        false;


    selectedGame.value =
        null;


    editing.value =
        false;


    form.value =
        createEmptyForm();


    resetTwitchSearch();

}


/* =========================================================
   SEARCH TWITCH
========================================================= */

async function searchGameOnTwitch() {

    const query =
        twitchSearch.value.trim();


    twitchSearchError.value =
        "";


    twitchSearchPerformed.value =
        false;


    if (
        query.length <
        2
    ) {

        twitchResults.value =
            [];


        twitchSearchError.value =
            "Écris au moins 2 caractères pour rechercher un jeu.";


        return;

    }


    twitchSearching.value =
        true;


    try {

        twitchResults.value =
            await searchTwitchGames(
                query,
                20
            );


        twitchSearchPerformed.value =
            true;

    }
    catch (error) {

        console.error(
            "Erreur recherche Twitch :",
            error
        );


        twitchResults.value =
            [];


        twitchSearchError.value =
            error instanceof Error
                ? error.message
                : "Impossible de rechercher les jeux Twitch.";

    }
    finally {

        twitchSearching.value =
            false;

    }

}


/* =========================================================
   SELECT TWITCH GAME
========================================================= */

function selectTwitchGame(
    game:
        TwitchGame
) {

    const duplicate =
        games.value.find(
            currentGame =>
                currentGame.twitch_game_id ===
                game.id
                &&
                currentGame.id !==
                selectedGame.value?.id
        );


    if (
        duplicate
    ) {

        twitchSearchError.value =
            `"${game.name}" est déjà présent dans ta bibliothèque.`;


        return;

    }


    selectedTwitchGame.value =
        game;


    form.value.twitch_game_id =
        game.id;


    form.value.twitch_name =
        game.name;


    form.value.box_art_url =
        game.rawBoxArtUrl
        ??
        game.boxArtUrl
        ??
        "";


    twitchSearch.value =
        game.name;


    twitchSearchError.value =
        "";

}


/* =========================================================
   CHANGE TWITCH GAME
========================================================= */

function changeSelectedTwitchGame() {

    selectedTwitchGame.value =
        null;


    form.value.twitch_game_id =
        "";


    form.value.twitch_name =
        "";


    form.value.box_art_url =
        "";


    twitchResults.value =
        [];


    twitchSearchPerformed.value =
        false;

}


/* =========================================================
   RATING TEXT
========================================================= */

function getRatingText():
    string {

    if (
        form.value.rating ===
        null
        ||
        form.value.rating ===
        undefined
    ) {

        return "";

    }


    return String(
        form.value.rating
    ).trim();

}


/* =========================================================
   PARSE RATING
========================================================= */

function parseRating():
    number | null {

    const value =
        getRatingText();


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
        Number.isNaN(rating)
    ) {

        return null;

    }


    return rating;

}


/* =========================================================
   PARSE TAGS
========================================================= */

function parseTags():
    string[] {

    return form.value.tags
        .split(",")
        .map(
            tag =>
                tag.trim()
        )
        .filter(Boolean);

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
            getRatingText()
            &&
            rating === null
        ) {

            throw new Error(
                "La note doit être un nombre valide."
            );

        }


        if (
            rating !== null
            &&
            (
                rating < 0
                ||
                rating > 10
            )
        ) {

            throw new Error(
                "La note doit être comprise entre 0 et 10."
            );

        }


        if (
            !form.value.twitch_game_id.trim()
            ||
            !form.value.twitch_name.trim()
        ) {

            throw new Error(
                "Sélectionne d'abord un jeu dans les résultats Twitch."
            );

        }


        const duplicate =
            games.value.find(
                game =>
                    game.twitch_game_id ===
                    form.value.twitch_game_id.trim()
                    &&
                    game.id !==
                    selectedGame.value?.id
            );


        if (
            duplicate
        ) {

            throw new Error(
                `"${form.value.twitch_name}" est déjà présent dans ta bibliothèque.`
            );

        }


        const payload:
            CreateGamePayload = {

            twitch_game_id:
                form.value.twitch_game_id.trim(),

            twitch_name:
                form.value.twitch_name.trim(),

            box_art_url:
                form.value.box_art_url.trim()
                ||
                null,

            status:
                form.value.status,

            tags:
                parseTags(),

            description:
                form.value.description.trim()
                ||
                null,

            rating,

            youtube_playlist:
                form.value.youtube_playlist.trim()
                ||
                null,

            poll_enabled:
                form.value.poll_enabled

        };


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
        else {

            await createAdminGame(
                payload
            );


            successMessage.value =
                "Le jeu a bien été ajouté depuis Twitch. 🎮";

        }


        await loadGames();


        forceCloseForm();

    }
    catch (error) {

        console.error(
            "Erreur sauvegarde jeu :",
            error
        );


        errorMessage.value =
            error instanceof Error
                ? error.message
                : "Impossible d'enregistrer le jeu.";

    }
    finally {

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
                    currentGame.id ===
                    game.id
            );


        if (
            index >= 0
        ) {

            games.value[index] =
                updatedGame;

        }


        successMessage.value =
            updatedGame.poll_enabled
                ? `${updatedGame.twitch_name ?? "Le jeu"} peut maintenant apparaître dans les sondages.`
                : `${updatedGame.twitch_name ?? "Le jeu"} a été retiré des sondages.`;

    }
    catch (error) {

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
                    currentGame.id !==
                    game.id
            );


        successMessage.value =
            `${gameName} a été supprimé.`;

    }
    catch (error) {

        console.error(
            "Erreur suppression jeu :",
            error
        );


        errorMessage.value =
            error instanceof Error
                ? error.message
                : "Impossible de supprimer le jeu.";

    }
    finally {

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
        rating === null
    ) {

        return "—";

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

    <section class="admin-games">

        <!-- =================================================
             HEADER
        ================================================== -->

        <header class="admin-section-header">

            <div>

                <span class="admin-section-header__eyebrow">
                    🎮 BIBLIOTHÈQUE
                </span>

                <h2>
                    Jeux
                </h2>

                <p>
                    Gère les jeux présents sur ton site et choisis
                    ceux qui peuvent apparaître dans les sondages.
                </p>

            </div>


            <button
                type="button"
                class="admin-button admin-button--primary"
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
            class="admin-message admin-message--success"
        >
            ✓ {{ successMessage }}
        </div>


        <div
            v-if="errorMessage"
            class="admin-message admin-message--error"
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

        <template v-else>

            <div class="admin-games-stats">

                <article class="admin-games-stat">
                    <span>Jeux</span>
                    <strong>{{ games.length }}</strong>
                </article>

                <article class="admin-games-stat">
                    <span>En cours</span>
                    <strong>{{ currentGamesCount }}</strong>
                </article>

                <article class="admin-games-stat">
                    <span>Sondages</span>
                    <strong>{{ pollGamesCount }}</strong>
                </article>

                <article class="admin-games-stat">
                    <span>Notés</span>
                    <strong>{{ gamesWithRatingCount }}</strong>
                </article>

            </div>


            <div class="admin-games-toolbar">

                <div class="admin-games-search">
                    <span aria-hidden="true">🔎</span>
                    <input
                        v-model="search"
                        type="search"
                        placeholder="Rechercher dans ta bibliothèque..."
                    >
                </div>

            </div>


            <div class="admin-games-filters">

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


            <div class="admin-games-count">
                {{ filteredGames.length }}
                jeu{{ filteredGames.length > 1 ? "x" : "" }}
            </div>


            <div
                v-if="filteredGames.length === 0"
                class="admin-games-empty"
            >
                <span>🎮</span>
                <strong>Aucun jeu</strong>
                <p>Aucun jeu ne correspond à tes critères.</p>
            </div>


            <div
                v-else
                class="admin-games-grid"
            >

                <article
                    v-for="game in filteredGames"
                    :key="game.id"
                    class="admin-game-card"
                >

                    <div class="admin-game-card__image">

                        <img
                            v-if="getGameImage(game)"
                            :src="getGameImage(game) ?? ''"
                            :alt="game.twitch_name || 'Jeu'"
                        >

                        <div
                            v-else
                            class="admin-game-card__placeholder"
                        >
                            🎮
                        </div>

                        <span
                            class="admin-game-status"
                            :class="getStatusClass(game.status)"
                        >
                            {{ getStatusLabel(game.status) }}
                        </span>

                        <span
                            v-if="game.poll_enabled"
                            class="admin-game-card__poll-badge"
                        >
                            🗳️ Sondage
                        </span>

                    </div>


                    <div class="admin-game-card__content">

                        <div class="admin-game-card__title-row">

                            <h3>
                                {{ game.twitch_name || "Jeu sans nom" }}
                            </h3>

                            <span class="admin-game-card__rating">
                                ⭐ {{ formatRating(game.rating) }}
                            </span>

                        </div>


                        <p
                            v-if="game.description"
                            class="admin-game-card__description"
                        >
                            {{ game.description }}
                        </p>

                        <p
                            v-else
                            class="admin-game-card__description admin-game-card__description--empty"
                        >
                            Aucune description.
                        </p>


                        <div
                            v-if="getTagsText(game.tags)"
                            class="admin-game-card__tags"
                        >

                            <span
                                v-for="tag in getTagsText(game.tags)
                                    .split(',')
                                    .map(item => item.trim())
                                    .filter(Boolean)"
                                :key="tag"
                            >
                                {{ tag }}
                            </span>

                        </div>


                        <label class="admin-game-card__poll-toggle">

                            <div>
                                <strong>Utilisable en sondage</strong>
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
                                :checked="game.poll_enabled === true"
                                @change="togglePollEnabled(game)"
                            >

                        </label>


                        <div class="admin-game-card__actions">

                            <button
                                type="button"
                                class="admin-game-button admin-game-button--edit"
                                @click="openEdit(game)"
                            >
                                ✏️ Modifier
                            </button>

                            <button
                                type="button"
                                class="admin-game-button admin-game-button--delete"
                                :disabled="deletingGameId === game.id"
                                @click="removeGame(game)"
                            >
                                {{ deletingGameId === game.id ? "..." : "🗑️" }}
                            </button>

                        </div>

                    </div>

                </article>

            </div>

        </template>

    
        <!-- =================================================
             MODAL
        ================================================== -->

        <Teleport to="body">

            <div
                v-if="formOpen"
                class="admin-game-modal"
                @click.self="closeForm"
            >

                <div class="admin-game-modal__dialog">

                    <header class="admin-game-modal__header">

                        <div>
                            <span>🎮 JEU TWITCH</span>
                            <h2>
                                {{ editing ? "Modifier le jeu" : "Ajouter un jeu" }}
                            </h2>
                        </div>

                        <button
                            type="button"
                            class="admin-game-modal__close"
                            :disabled="saving"
                            @click="closeForm"
                        >
                            ×
                        </button>

                    </header>


                    <form
                        class="admin-game-form"
                        @submit.prevent="saveGame"
                    >

                        <div class="admin-game-form__layout">

                            <!-- PREVIEW -->

                            <aside class="admin-game-form__preview">

                                <div class="admin-game-form__cover">

                                    <img
                                        v-if="formImage"
                                        :src="formImage ?? ''"
                                        :alt="form.twitch_name || 'Aperçu'"
                                    >

                                    <span v-else>🎮</span>

                                </div>

                                <strong>
                                    {{ form.twitch_name || "Aucun jeu sélectionné" }}
                                </strong>

                                <small v-if="form.twitch_game_id">
                                    Jeu lié automatiquement à Twitch
                                </small>

                                <small v-else>
                                    Recherche puis sélectionne un jeu
                                </small>

                            </aside>


                            <!-- TWITCH SEARCH -->

                            <div class="admin-game-form__fields">

                                <section class="admin-twitch-search">

                                    <div class="admin-twitch-search__heading">
                                        <span>🔎 RECHERCHE TWITCH</span>
                                        <h3>Choisir le jeu</h3>
                                        <p>
                                            Recherche simplement son nom. L'ID Twitch et la jaquette
                                            seront récupérés automatiquement.
                                        </p>
                                    </div>


                                    <div class="admin-twitch-search__bar">

                                        <input
                                            v-model="twitchSearch"
                                            type="search"
                                            autocomplete="off"
                                            placeholder="Ex. Party Animals, Phasmophobia..."
                                            @keydown.enter.prevent="searchGameOnTwitch"
                                        >

                                        <button
                                            type="button"
                                            :disabled="twitchSearching"
                                            @click="searchGameOnTwitch"
                                        >
                                            {{ twitchSearching ? "Recherche..." : "Rechercher" }}
                                        </button>

                                    </div>


                                    <p
                                        v-if="twitchSearchError"
                                        class="admin-twitch-search__error"
                                    >
                                        ⚠️ {{ twitchSearchError }}
                                    </p>


                                    <div
                                        v-if="selectedTwitchGame"
                                        class="admin-twitch-selected"
                                    >

                                        <img
                                            v-if="getTwitchResultImage(selectedTwitchGame)"
                                            :src="getTwitchResultImage(selectedTwitchGame) ?? ''"
                                            :alt="selectedTwitchGame.name"
                                        >

                                        <div class="admin-twitch-selected__info">
                                            <span>✓ JEU SÉLECTIONNÉ</span>
                                            <strong>{{ selectedTwitchGame.name }}</strong>
                                            <small>
                                                L'ID et l'image seront enregistrés automatiquement.
                                            </small>
                                        </div>

                                        <button
                                            type="button"
                                            class="admin-twitch-selected__change"
                                            @click="changeSelectedTwitchGame"
                                        >
                                            Changer
                                        </button>

                                    </div>


                                    <div
                                        v-if="twitchSearching"
                                        class="admin-twitch-search__loading"
                                    >
                                        <span>🎮</span>
                                        Recherche sur Twitch...
                                    </div>


                                    <div
                                        v-else-if="twitchResults.length > 0"
                                        class="admin-twitch-results"
                                    >

                                        <button
                                            v-for="result in twitchResults"
                                            :key="result.id"
                                            type="button"
                                            class="admin-twitch-result"
                                            :class="{
                                                'admin-twitch-result--selected':
                                                    form.twitch_game_id === result.id
                                            }"
                                            @click="selectTwitchGame(result)"
                                        >

                                            <div class="admin-twitch-result__cover">

                                                <img
                                                    v-if="getTwitchResultImage(result)"
                                                    :src="getTwitchResultImage(result) ?? ''"
                                                    :alt="result.name"
                                                >

                                                <span v-else>🎮</span>

                                            </div>

                                            <strong>{{ result.name }}</strong>

                                            <span class="admin-twitch-result__select">
                                                {{
                                                    form.twitch_game_id === result.id
                                                        ? "✓ Sélectionné"
                                                        : "Choisir"
                                                }}
                                            </span>

                                        </button>

                                    </div>


                                    <div
                                        v-else-if="twitchSearchPerformed && !twitchSearching"
                                        class="admin-twitch-search__empty"
                                    >
                                        Aucun jeu Twitch trouvé pour cette recherche.
                                    </div>

                                </section>

                            </div>

                        </div>


                        <div class="admin-game-form__row">

                            <div class="admin-game-field">

                                <label for="admin-game-status">
                                    Statut
                                </label>

                                <select
                                    id="admin-game-status"
                                    v-model="form.status"
                                >
                                    <option value="current">🔥 En cours</option>
                                    <option value="regular">🔁 Régulier</option>
                                    <option value="backlog">📚 À faire</option>
                                    <option value="paused">⏸️ En pause</option>
                                    <option value="finished">🏆 Terminé</option>
                                </select>

                            </div>


                            <div class="admin-game-field">

                                <label for="admin-game-rating">
                                    Note / 10
                                </label>

                                <input
                                    id="admin-game-rating"
                                    v-model="form.rating"
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    placeholder="8.5"
                                >

                            </div>

                        </div>


                        <div class="admin-game-field">

                            <label for="admin-game-tags">
                                Tags
                            </label>

                            <input
                                id="admin-game-tags"
                                v-model="form.tags"
                                type="text"
                                placeholder="Multijoueur, Fun, Horreur..."
                            >

                        </div>


                        <div class="admin-game-field">

                            <label for="admin-game-description">
                                Description
                            </label>

                            <textarea
                                id="admin-game-description"
                                v-model="form.description"
                                rows="5"
                                placeholder="Description du jeu..."
                            ></textarea>

                        </div>


                        <div class="admin-game-field">

                            <label for="admin-game-youtube">
                                Playlist YouTube
                            </label>

                            <input
                                id="admin-game-youtube"
                                v-model="form.youtube_playlist"
                                type="url"
                                placeholder="https://youtube.com/..."
                            >

                        </div>


                        <label class="admin-game-form__poll">

                            <div>
                                <strong>🗳️ Disponible dans les sondages</strong>
                                <span>
                                    Le jeu pourra être sélectionné lorsque tu crées un sondage.
                                </span>
                            </div>

                            <input
                                v-model="form.poll_enabled"
                                type="checkbox"
                            >

                        </label>


                        <footer class="admin-game-form__actions">

                            <button
                                type="button"
                                class="admin-game-form__cancel"
                                :disabled="saving"
                                @click="closeForm">
                                Annuler
                            </button>

                            <button
                                type="submit"
                                class="admin-game-form__save"
                                :disabled="!canSave"
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


<style>

/* =========================================================
   ROOT
========================================================= */

.admin-games {
    width: 100%;

    --pink: #ff2ca8;
    --purple: #8d2cff;
    --cyan: #22f2ef;

    --panel: #180a23;
    --panel-dark: #100618;

    --border: rgba(255, 255, 255, 0.08);
    --muted: rgba(255, 255, 255, 0.5);

    color: #ffffff;
}


/* =========================================================
   HEADER
========================================================= */

.admin-section-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    gap: 25px;

    margin-bottom: 28px;
}


.admin-section-header__eyebrow {
    color: var(--cyan);

    font-size: 0.7rem;
    font-weight: 900;

    letter-spacing: 0.16em;
}


.admin-section-header h2 {
    margin: 5px 0 0;

    color: #ffffff;

    font-size: clamp(1.8rem, 3vw, 2.8rem);
    font-weight: 950;
}


.admin-section-header p {
    max-width: 650px;

    margin: 9px 0 0;

    color: var(--muted);

    line-height: 1.6;
}


/* =========================================================
   GLOBAL BUTTON
========================================================= */

.admin-button {
    min-height: 44px;

    padding: 10px 18px;

    color: #ffffff;

    border-radius: 13px;

    font: inherit;
    font-weight: 900;

    cursor: pointer;
}


.admin-button--primary {
    background:
        linear-gradient(
            135deg,
            var(--purple),
            var(--pink)
        );

    border:
        1px solid
        rgba(255, 44, 168, 0.45);
}


/* =========================================================
   MESSAGES
========================================================= */

.admin-message {
    margin-bottom: 20px;

    padding: 14px 17px;

    border-radius: 14px;

    font-weight: 800;
}


.admin-message--success {
    color: #8ff4bb;

    background:
        rgba(42, 200, 113, 0.08);

    border:
        1px solid
        rgba(42, 200, 113, 0.23);
}


.admin-message--error {
    color: #ff9db4;

    background:
        rgba(255, 62, 103, 0.08);

    border:
        1px solid
        rgba(255, 62, 103, 0.23);
}


/* =========================================================
   LOADING
========================================================= */

.admin-loading,
.admin-games-empty {
    min-height: 220px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: 10px;

    padding: 30px;

    text-align: center;

    background:
        rgba(255, 255, 255, 0.025);

    border:
        1px dashed
        rgba(255, 255, 255, 0.09);

    border-radius: 20px;
}


/* =========================================================
   STATS
========================================================= */

.admin-games-stats {
    display: grid;

    grid-template-columns:
        repeat(
            4,
            minmax(0, 1fr)
        );

    gap: 18px;

    margin-bottom: 28px;
}


.admin-games-stat {
    min-height: 128px;

    display: flex;
    flex-direction: column;
    justify-content: center;

    padding: 24px;

    background:
        linear-gradient(
            145deg,
            rgba(31, 12, 45, 0.94),
            rgba(15, 6, 23, 0.98)
        );

    border:
        1px solid
        var(--border);

    border-radius: 21px;
}


.admin-games-stat span {
    color: var(--muted);

    font-size: 0.82rem;
    font-weight: 800;
}


.admin-games-stat strong {
    margin-top: 8px;

    color: #ffffff;

    font-size: 2.5rem;
    font-weight: 950;
}


/* =========================================================
   SEARCH
========================================================= */

.admin-games-toolbar {
    display: flex;

    margin-bottom: 13px;
}


.admin-games-search {
    width: min(100%, 620px);
    min-height: 54px;

    display: flex;
    align-items: center;

    gap: 12px;

    padding: 0 17px;

    background:
        rgba(29, 12, 42, 0.92);

    border:
        1px solid
        rgba(184, 70, 255, 0.2);

    border-radius: 18px;
}


.admin-games-search:focus-within {
    border-color:
        rgba(255, 44, 168, 0.55);

    box-shadow:
        0 0 0 3px
        rgba(255, 44, 168, 0.08);
}


.admin-games-search input {
    width: 100%;

    padding: 15px 0;

    color: #ffffff;

    background: transparent;

    border: 0;

    outline: 0;

    font: inherit;
}


.admin-games-search input::placeholder {
    color:
        rgba(255, 255, 255, 0.3);
}


/* =========================================================
   FILTERS
========================================================= */

.admin-games-filters {
    display: flex;
    flex-wrap: wrap;

    gap: 10px;

    margin-bottom: 14px;
}


.admin-games-filters button {
    appearance: none;

    min-height: 42px;

    padding: 9px 17px;

    color:
        rgba(255, 255, 255, 0.64);

    background:
        rgba(255, 255, 255, 0.035);

    border:
        1px solid
        rgba(255, 255, 255, 0.09);

    border-radius: 999px;

    font: inherit;
    font-size: 0.83rem;
    font-weight: 850;

    cursor: pointer;

    transition: 0.2s ease;
}


.admin-games-filters button:hover {
    color: #ffffff;

    border-color:
        rgba(255, 44, 168, 0.35);

    background:
        rgba(255, 44, 168, 0.08);
}


.admin-games-filter--active {
    color: #ffffff !important;

    background:
        linear-gradient(
            135deg,
            rgba(141, 44, 255, 0.45),
            rgba(255, 44, 168, 0.25)
        ) !important;

    border-color:
        rgba(255, 44, 168, 0.5) !important;
}


.admin-games-count {
    margin-bottom: 18px;

    color: var(--muted);

    font-size: 0.8rem;
}


/* =========================================================
   GRID
========================================================= */

.admin-games-grid {
    display: grid;

    grid-template-columns:
        repeat(
            auto-fill,
            minmax(280px, 1fr)
        );

    align-items: stretch;

    gap: 22px;
}


/* =========================================================
   CARD
========================================================= */

.admin-game-card {
    min-width: 0;

    display: flex;
    flex-direction: column;

    overflow: hidden;

    background:
        linear-gradient(
            145deg,
            rgba(31, 12, 45, 0.96),
            rgba(15, 6, 23, 0.99)
        );

    border:
        1px solid
        var(--border);

    border-radius: 22px;

    box-shadow:
        0 18px 45px
        rgba(0, 0, 0, 0.22);

    transition:
        transform 0.22s ease,
        border-color 0.22s ease;
}


.admin-game-card:hover {
    transform:
        translateY(-4px);

    border-color:
        rgba(255, 44, 168, 0.35);
}


/* =========================================================
   IMAGE
========================================================= */

.admin-game-card__image {
    position: relative;

    width: 100%;

    aspect-ratio: 16 / 9;

    overflow: hidden;

    background: #12091a;
}


.admin-game-card__image img {
    width: 100%;
    height: 100%;

    display: block;

    object-fit: cover;
}


.admin-game-card__placeholder {
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 3rem;
}


/* =========================================================
   STATUS
========================================================= */

.admin-game-status {
    position: absolute;

    top: 12px;
    right: 12px;

    padding: 6px 10px;

    border-radius: 999px;

    font-size: 0.67rem;
    font-weight: 900;

    backdrop-filter: blur(10px);
}


.admin-game-status--current {
    color: #ff9bba;

    background:
        rgba(255, 44, 168, 0.18);

    border:
        1px solid
        rgba(255, 44, 168, 0.35);
}


.admin-game-status--regular {
    color: #8cf9f6;

    background:
        rgba(34, 242, 239, 0.12);

    border:
        1px solid
        rgba(34, 242, 239, 0.3);
}


.admin-game-status--backlog {
    color: #d4b4ff;

    background:
        rgba(141, 44, 255, 0.15);

    border:
        1px solid
        rgba(141, 44, 255, 0.3);
}


.admin-game-status--paused {
    color: #ffd58a;

    background:
        rgba(255, 190, 80, 0.12);

    border:
        1px solid
        rgba(255, 190, 80, 0.3);
}


.admin-game-status--finished {
    color: #90f3b6;

    background:
        rgba(50, 200, 110, 0.12);

    border:
        1px solid
        rgba(50, 200, 110, 0.3);
}


.admin-game-card__poll-badge {
    position: absolute;

    left: 12px;
    bottom: 12px;

    padding: 6px 10px;

    color: var(--cyan);

    background:
        rgba(5, 12, 20, 0.83);

    border:
        1px solid
        rgba(34, 242, 239, 0.27);

    border-radius: 999px;

    font-size: 0.67rem;
    font-weight: 900;
}


/* =========================================================
   CONTENT
========================================================= */

.admin-game-card__content {
    display: flex;
    flex-direction: column;

    flex: 1;

    padding: 20px;
}


.admin-game-card__title-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    gap: 12px;
}


.admin-game-card__title-row h3 {
    margin: 0;

    color: #ffffff;

    font-size: 1.05rem;
    font-weight: 950;

    line-height: 1.3;
}


.admin-game-card__rating {
    flex-shrink: 0;

    padding: 5px 8px;

    color: #ffd66f;

    background:
        rgba(255, 200, 70, 0.07);

    border:
        1px solid
        rgba(255, 200, 70, 0.17);

    border-radius: 999px;

    font-size: 0.7rem;
    font-weight: 900;
}


/* =========================================================
   DESCRIPTION
========================================================= */

.admin-game-card__description {
    display: -webkit-box;

    margin: 14px 0 0;

    overflow: hidden;

    color:
        rgba(255, 255, 255, 0.58);

    font-size: 0.81rem;

    line-height: 1.55;

    
    -webkit-box-orient: vertical;
}


.admin-game-card__description--empty {
    color:
        rgba(255, 255, 255, 0.3);

    font-style: italic;
}


/* =========================================================
   TAGS
========================================================= */

.admin-game-card__tags {
    display: flex;
    flex-wrap: wrap;

    gap: 6px;

    margin-top: 15px;
}


.admin-game-card__tags span {
    padding: 5px 8px;

    color: #d9b7ff;

    background:
        rgba(141, 44, 255, 0.1);

    border:
        1px solid
        rgba(141, 44, 255, 0.18);

    border-radius: 999px;

    font-size: 0.68rem;
    font-weight: 750;
}


/* =========================================================
   POLL
========================================================= */

.admin-game-card__poll-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: 15px;

    margin-top: 17px;

    padding: 13px;

    background:
        rgba(255, 255, 255, 0.025);

    border:
        1px solid
        rgba(255, 255, 255, 0.07);

    border-radius: 14px;

    cursor: pointer;
}


.admin-game-card__poll-toggle div {
    display: flex;
    flex-direction: column;

    gap: 3px;
}


.admin-game-card__poll-toggle strong {
    color: #ffffff;

    font-size: 0.76rem;
}


.admin-game-card__poll-toggle span {
    color:
        rgba(255, 255, 255, 0.4);

    font-size: 0.67rem;
}


.admin-game-card__poll-toggle input,
.admin-game-form__poll input {
    appearance: none;

    width: 24px;
    height: 24px;

    flex-shrink: 0;

    position: relative;

    background:
        rgba(255, 255, 255, 0.06);

    border:
        1px solid
        rgba(255, 255, 255, 0.2);

    border-radius: 7px;

    cursor: pointer;
}


.admin-game-card__poll-toggle input:checked,
.admin-game-form__poll input:checked {
    background:
        linear-gradient(
            135deg,
            var(--purple),
            var(--pink)
        );

    border-color: var(--pink);
}


.admin-game-card__poll-toggle input:checked::after,
.admin-game-form__poll input:checked::after {
    content: "✓";

    position: absolute;

    inset: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    color: #ffffff;

    font-size: 0.8rem;
    font-weight: 950;
}


/* =========================================================
   ACTIONS
========================================================= */

.admin-game-card__actions {
    display: grid;

    grid-template-columns:
        minmax(0, 1fr)
        48px;

    gap: 10px;

    margin-top: auto;

    padding-top: 18px;
}


.admin-game-button {
    min-height: 46px;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    gap: 7px;

    border-radius: 13px;

    font: inherit;
    font-size: 0.8rem;
    font-weight: 900;

    cursor: pointer;
}


.admin-game-button--edit {
    color: #ffffff;

    background:
        linear-gradient(
            135deg,
            rgba(141, 44, 255, 0.3),
            rgba(255, 44, 168, 0.12)
        );

    border:
        1px solid
        rgba(190, 90, 255, 0.25);
}


.admin-game-button--delete {
    color: #ff8caa;

    background:
        rgba(255, 60, 110, 0.08);

    border:
        1px solid
        rgba(255, 60, 110, 0.2);
}


/* =========================================================
   MODAL
========================================================= */

.admin-game-modal {
    position: fixed;

    inset: 0;

    z-index: 9999;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 24px;

    background:
        rgba(4, 1, 8, 0.82);

    backdrop-filter:
        blur(10px);
}


.admin-game-modal__dialog {
    width: min(100%, 950px);
    max-height: calc(100vh - 48px);

    overflow-y: auto;

    color: #ffffff;

    background:
        linear-gradient(
            145deg,
            #1d0d2a,
            #0f0717
        );

    border:
        1px solid
        rgba(255, 44, 168, 0.22);

    border-radius: 24px;

    box-shadow:
        0 30px 100px
        rgba(0, 0, 0, 0.55);
}


.admin-game-modal__header {
    position: sticky;

    top: 0;

    z-index: 2;

    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: 20px;

    padding: 22px 25px;

    background:
        rgba(20, 8, 30, 0.97);

    border-bottom:
        1px solid
        rgba(255, 255, 255, 0.07);

    backdrop-filter:
        blur(12px);
}


.admin-game-modal__header span {
    color: var(--cyan);

    font-size: 0.68rem;
    font-weight: 900;

    letter-spacing: 0.15em;
}


.admin-game-modal__header h2 {
    margin: 4px 0 0;

    color: #ffffff;
}


.admin-game-modal__close {
    width: 42px;
    height: 42px;

    display: flex;
    align-items: center;
    justify-content: center;

    color: #ffffff;

    background:
        rgba(255, 255, 255, 0.05);

    border:
        1px solid
        rgba(255, 255, 255, 0.1);

    border-radius: 50%;

    font-size: 1.5rem;

    cursor: pointer;
}


/* =========================================================
   FORM
========================================================= */

.admin-game-form {
    padding: 26px;
}


.admin-game-form__layout {
    display: grid;

    grid-template-columns:
        210px
        minmax(0, 1fr);

    gap: 28px;

    margin-bottom: 22px;
}


.admin-game-form__preview {
    display: flex;
    flex-direction: column;
    align-items: center;

    gap: 9px;

    text-align: center;
}


.admin-game-form__cover {
    width: 100%;

    aspect-ratio: 3 / 4;

    display: flex;
    align-items: center;
    justify-content: center;

    overflow: hidden;

    background: #12091a;

    border:
        1px solid
        rgba(255, 255, 255, 0.08);

    border-radius: 18px;
}


.admin-game-form__cover img {
    width: 100%;
    height: 100%;

    object-fit: cover;
}


.admin-game-form__cover span {
    font-size: 3rem;
}


.admin-game-form__row {
    display: grid;

    grid-template-columns:
        repeat(
            2,
            minmax(0, 1fr)
        );

    gap: 18px;
}


.admin-game-field {
    margin-bottom: 19px;
}


.admin-game-field label {
    display: block;

    margin-bottom: 7px;

    color: #ffffff;

    font-size: 0.8rem;
    font-weight: 850;
}


.admin-game-field input,
.admin-game-field textarea,
.admin-game-field select {
    width: 100%;

    box-sizing: border-box;

    padding: 12px 14px;

    color: #ffffff;

    background:
        rgba(5, 2, 10, 0.55);

    border:
        1px solid
        rgba(255, 255, 255, 0.09);

    border-radius: 12px;

    outline: 0;

    font: inherit;
}


.admin-game-field select {
    cursor: pointer;
}


.admin-game-field textarea {
    resize: vertical;

    min-height: 110px;
}


.admin-game-field input:focus,
.admin-game-field textarea:focus,
.admin-game-field select:focus {
    border-color:
        rgba(255, 44, 168, 0.55);

    box-shadow:
        0 0 0 3px
        rgba(255, 44, 168, 0.07);
}


/* =========================================================
   FORM POLL
========================================================= */

.admin-game-form__poll {
    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: 18px;

    padding: 16px;

    background:
        rgba(255, 255, 255, 0.025);

    border:
        1px solid
        rgba(255, 255, 255, 0.07);

    border-radius: 14px;

    cursor: pointer;
}


.admin-game-form__poll div {
    display: flex;
    flex-direction: column;

    gap: 4px;
}


.admin-game-form__poll strong {
    color: #ffffff;
}


.admin-game-form__poll span {
    color:
        rgba(255, 255, 255, 0.44);

    font-size: 0.75rem;
}


/* =========================================================
   FORM ACTIONS
========================================================= */

.admin-game-form__actions {
    display: flex;
    justify-content: flex-end;

    gap: 10px;

    margin-top: 25px;

    padding-top: 20px;

    border-top:
        1px solid
        rgba(255, 255, 255, 0.06);
}


.admin-game-form__cancel,
.admin-game-form__save {
    min-height: 44px;

    padding: 10px 18px;

    border-radius: 12px;

    font: inherit;
    font-weight: 900;

    cursor: pointer;
}


.admin-game-form__cancel {
    color:
        rgba(255, 255, 255, 0.8);

    background:
        rgba(255, 255, 255, 0.04);

    border:
        1px solid
        rgba(255, 255, 255, 0.09);
}


.admin-game-form__save {
    color: #ffffff;

    background:
        linear-gradient(
            135deg,
            var(--purple),
            var(--pink)
        );

    border:
        1px solid
        rgba(255, 44, 168, 0.4);
}


.admin-game-form__save:disabled {
    opacity: 0.45;

    cursor: not-allowed;
}


/* =========================================================
   TABLET
========================================================= */

@media screen and (max-width: 1050px) {

    .admin-games-stats {
        grid-template-columns:
            repeat(
                2,
                minmax(0, 1fr)
            );
    }


    .admin-games-grid {
        grid-template-columns:
            repeat(
                2,
                minmax(0, 1fr)
            );
    }

}


/* =========================================================
   MOBILE
========================================================= */

@media screen and (max-width: 700px) {

    .admin-section-header {
        flex-direction: column;

        align-items: stretch;
    }


    .admin-games-stats {
        grid-template-columns:
            repeat(
                2,
                minmax(0, 1fr)
            );

        gap: 11px;
    }


    .admin-games-stat {
        min-height: 105px;

        padding: 17px;
    }


    .admin-games-grid {
        grid-template-columns:
            1fr;
    }


    .admin-games-filters {
        display: grid;

        grid-template-columns:
            1fr;
    }


    .admin-games-filters button {
        width: 100%;
    }


    .admin-game-form__layout,
    .admin-game-form__row {
        grid-template-columns:
            1fr;
    }


    .admin-game-form__preview {
        width: min(100%, 220px);

        margin: 0 auto;
    }


    .admin-game-form__actions {
        flex-direction: column-reverse;
    }


    .admin-game-form__actions button {
        width: 100%;
    }

}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media screen and (max-width: 450px) {

    .admin-games-stats {
        grid-template-columns:
            1fr;
    }


    .admin-game-card__content {
        padding: 17px;
    }

}


/* =========================================================
   TWITCH SEARCH — MODAL
========================================================= */

.admin-twitch-search {
    width: 100%;
}

.admin-twitch-search__heading {
    margin-bottom: 16px;
}

.admin-twitch-search__heading > span {
    color: var(--cyan);
    font-size: 0.68rem;
    font-weight: 900;
    letter-spacing: 0.14em;
}

.admin-twitch-search__heading h3 {
    margin: 5px 0 6px;
    color: #ffffff;
    font-size: 1.15rem;
}

.admin-twitch-search__heading p {
    margin: 0;
    color: rgba(255, 255, 255, 0.48);
    font-size: 0.78rem;
    line-height: 1.55;
}

.admin-twitch-search__bar {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px;
}

.admin-twitch-search__bar input {
    width: 100%;
    min-width: 0;
    padding: 13px 14px;
    color: #ffffff;
    background: rgba(5, 2, 10, 0.55);
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 12px;
    outline: 0;
    font: inherit;
}

.admin-twitch-search__bar input:focus {
    border-color: rgba(255, 44, 168, 0.55);
    box-shadow: 0 0 0 3px rgba(255, 44, 168, 0.07);
}

.admin-twitch-search__bar button {
    min-height: 46px;
    padding: 0 17px;
    color: #ffffff;
    background: linear-gradient(135deg, var(--purple), var(--pink));
    border: 1px solid rgba(255, 44, 168, 0.4);
    border-radius: 12px;
    font: inherit;
    font-size: 0.78rem;
    font-weight: 900;
    cursor: pointer;
}

.admin-twitch-search__bar button:disabled {
    opacity: 0.55;
    cursor: wait;
}

.admin-twitch-search__error {
    margin: 10px 0 0;
    padding: 10px 12px;
    color: #ff9db4;
    background: rgba(255, 62, 103, 0.08);
    border: 1px solid rgba(255, 62, 103, 0.2);
    border-radius: 10px;
    font-size: 0.75rem;
    font-weight: 750;
}

.admin-twitch-selected {
    display: grid;
    grid-template-columns: 62px minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    margin-top: 14px;
    padding: 12px;
    background: linear-gradient(135deg, rgba(34, 242, 239, 0.07), rgba(141, 44, 255, 0.08));
    border: 1px solid rgba(34, 242, 239, 0.22);
    border-radius: 14px;
}

.admin-twitch-selected > img {
    width: 62px;
    height: 82px;
    object-fit: cover;
    border-radius: 10px;
}

.admin-twitch-selected__info {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.admin-twitch-selected__info > span {
    color: var(--cyan);
    font-size: 0.62rem;
    font-weight: 900;
    letter-spacing: 0.1em;
}

.admin-twitch-selected__info strong {
    overflow: hidden;
    color: #ffffff;
    font-size: 0.9rem;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.admin-twitch-selected__info small {
    color: rgba(255, 255, 255, 0.42);
    font-size: 0.68rem;
}

.admin-twitch-selected__change {
    min-height: 38px;
    padding: 7px 11px;
    color: #ffffff;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    font: inherit;
    font-size: 0.7rem;
    font-weight: 850;
    cursor: pointer;
}

.admin-twitch-search__loading,
.admin-twitch-search__empty {
    margin-top: 14px;
    padding: 20px;
    color: rgba(255, 255, 255, 0.48);
    text-align: center;
    background: rgba(255, 255, 255, 0.025);
    border: 1px dashed rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    font-size: 0.76rem;
}

.admin-twitch-results {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
    margin-top: 14px;
    max-height: 390px;
    overflow-y: auto;
    padding-right: 4px;
}

.admin-twitch-result {
    appearance: none;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 7px;
    padding: 8px;
    color: #ffffff;
    text-align: left;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 13px;
    cursor: pointer;
    transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
}

.admin-twitch-result:hover {
    transform: translateY(-2px);
    background: rgba(141, 44, 255, 0.08);
    border-color: rgba(255, 44, 168, 0.34);
}

.admin-twitch-result--selected {
    border-color: rgba(34, 242, 239, 0.5);
    box-shadow: 0 0 0 2px rgba(34, 242, 239, 0.07);
}

.admin-twitch-result__cover {
    width: 100%;
    aspect-ratio: 3 / 4;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: #12091a;
    border-radius: 9px;
}

.admin-twitch-result__cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.admin-twitch-result__cover span {
    font-size: 2rem;
}

.admin-twitch-result > strong {
    min-height: 2.5em;
    display: -webkit-box;
    overflow: hidden;
    color: #ffffff;
    font-size: 0.72rem;
    line-height: 1.25;
    -webkit-box-orient: vertical;
}

.admin-twitch-result__select {
    color: var(--cyan);
    font-size: 0.64rem;
    font-weight: 900;
}

@media screen and (max-width: 850px) {
    .admin-twitch-results {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

@media screen and (max-width: 600px) {
    .admin-twitch-search__bar {
        grid-template-columns: 1fr;
    }

    .admin-twitch-selected {
        grid-template-columns: 54px minmax(0, 1fr);
    }

    .admin-twitch-selected__change {
        grid-column: 1 / -1;
        width: 100%;
    }

    .admin-twitch-results {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}


/* =========================================================
   LIGHT MODE
========================================================= */

html[data-theme="light"] .admin-games {

    --pink:
        #c21878;

    --purple:
        #6d00a3;

    --cyan:
        #008f91;

    --panel:
        #ffffff;

    --panel-dark:
        #f7eefb;

    --border:
        rgba(
            109,
            0,
            163,
            0.18
        );

    --muted:
        #74527f;

    color:
        #48135d;

}


/* =========================================================
   LIGHT MODE — HEADER
========================================================= */

html[data-theme="light"] .admin-section-header {
    border-bottom-color:
        rgba(109, 0, 163, 0.16);
}

html[data-theme="light"] .admin-section-header h2 {
    color: #48135d;
}

html[data-theme="light"] .admin-section-header p {
    color: #74527f;
}

html[data-theme="light"] .admin-section-header__eyebrow {
    color: #008f91;
}


/* =========================================================
   LIGHT MODE — MESSAGES
========================================================= */

html[data-theme="light"] .admin-message--success {
    color: #087c68;
    background: rgba(8, 124, 104, 0.07);
    border-color: rgba(8, 124, 104, 0.24);
}

html[data-theme="light"] .admin-message--error {
    color: #c62563;
    background: rgba(198, 37, 99, 0.07);
    border-color: rgba(198, 37, 99, 0.25);
}


/* =========================================================
   LIGHT MODE — LOADING / EMPTY
========================================================= */

html[data-theme="light"] .admin-loading,
html[data-theme="light"] .admin-games-empty {
    color: #74527f;
    background: #ffffff;
    border-color: rgba(109, 0, 163, 0.16);
    box-shadow: 0 14px 32px rgba(72, 19, 93, 0.08);
}

html[data-theme="light"] .admin-games-empty strong {
    color: #48135d;
}

html[data-theme="light"] .admin-games-empty p {
    color: #74527f;
}


/* =========================================================
   LIGHT MODE — STATS
========================================================= */

html[data-theme="light"] .admin-games-stat {
    background:
        linear-gradient(
            145deg,
            #ffffff,
            #f8effd
        );
    border-color: rgba(109, 0, 163, 0.18);
    box-shadow: 0 14px 34px rgba(72, 19, 93, 0.10);
}

html[data-theme="light"] .admin-games-stat span {
    color: #74527f;
}

html[data-theme="light"] .admin-games-stat strong {
    color: #48135d;
}


/* =========================================================
   LIGHT MODE — SEARCH
========================================================= */

html[data-theme="light"] .admin-games-search {
    background: #ffffff;
    border-color: rgba(109, 0, 163, 0.18);
    box-shadow: 0 10px 26px rgba(72, 19, 93, 0.07);
}

html[data-theme="light"] .admin-games-search input {
    color: #48135d;
}

html[data-theme="light"] .admin-games-search input::placeholder {
    color: #9b82a3;
}


/* =========================================================
   LIGHT MODE — FILTERS
========================================================= */

html[data-theme="light"] .admin-games-filters button {
    color: #74527f;
    background: rgba(255, 255, 255, 0.88);
    border-color: rgba(109, 0, 163, 0.16);
}

html[data-theme="light"] .admin-games-filters button:hover {
    color: #48135d;
    background: #f6eefe;
    border-color: rgba(194, 24, 120, 0.28);
}

html[data-theme="light"] .admin-games-filter--active {
    color: #ffffff !important;
    background:
        linear-gradient(
            135deg,
            #8d2cff,
            #ff2ca8
        ) !important;
    border-color: rgba(194, 24, 120, 0.34) !important;
}

html[data-theme="light"] .admin-games-count {
    color: #74527f;
}


/* =========================================================
   LIGHT MODE — GAME CARDS
========================================================= */

html[data-theme="light"] .admin-game-card {
    color: #48135d;
    background:
        linear-gradient(
            145deg,
            #ffffff,
            #f8effd
        );
    border-color: rgba(109, 0, 163, 0.18);
    box-shadow: 0 16px 38px rgba(72, 19, 93, 0.10);
}

html[data-theme="light"] .admin-game-card:hover {
    border-color: rgba(194, 24, 120, 0.30);
}

html[data-theme="light"] .admin-game-card__image {
    background: #efe4f4;
}

html[data-theme="light"] .admin-game-card__placeholder {
    color: #6d00a3;
    background:
        linear-gradient(
            145deg,
            #f3e6f8,
            #ead8f2
        );
}

html[data-theme="light"] .admin-game-card__content {
    background: transparent;
}

html[data-theme="light"] .admin-game-card__title-row h3 {
    color: #48135d;
}

html[data-theme="light"] .admin-game-card__rating {
    color: #805700;
    background: rgba(255, 187, 0, 0.09);
    border-color: rgba(150, 100, 0, 0.20);
}

html[data-theme="light"] .admin-game-card__description {
    color: #74527f;
}

html[data-theme="light"] .admin-game-card__description--empty {
    color: #9b82a3;
}

html[data-theme="light"] .admin-game-card__tags span {
    color: #6d00a3;
    background: rgba(109, 0, 163, 0.06);
    border-color: rgba(109, 0, 163, 0.16);
}

html[data-theme="light"] .admin-game-card__poll-toggle {
    color: #74527f;
    background: #f7eefb;
    border-color: rgba(109, 0, 163, 0.16);
}

html[data-theme="light"] .admin-game-card__poll-toggle:hover {
    color: #48135d;
    border-color: rgba(194, 24, 120, 0.25);
}

html[data-theme="light"] .admin-game-card__actions {
    border-top-color: rgba(109, 0, 163, 0.12);
}


/* =========================================================
   LIGHT MODE — GAME BUTTONS
========================================================= */

html[data-theme="light"] .admin-game-button {
    color: #48135d;
    background: #ffffff;
    border-color: rgba(109, 0, 163, 0.16);
}

html[data-theme="light"] .admin-game-button:hover {
    background: #f6eefe;
}

html[data-theme="light"] .admin-game-button--edit {
    color: #6d00a3;
}

html[data-theme="light"] .admin-game-button--delete {
    color: #c62563;
    background: rgba(198, 37, 99, 0.055);
    border-color: rgba(198, 37, 99, 0.24);
}


/* =========================================================
   LIGHT MODE — MODAL
========================================================= */

html[data-theme="light"] .admin-game-modal {
    background: rgba(72, 19, 93, 0.28);
}

html[data-theme="light"] .admin-game-modal__dialog {
    color: #48135d;
    background:
        linear-gradient(
            145deg,
            #ffffff,
            #f8effd
        );
    border-color: rgba(109, 0, 163, 0.20);
    box-shadow: 0 28px 80px rgba(72, 19, 93, 0.22);
}

html[data-theme="light"] .admin-game-modal__header {
    background: rgba(255, 251, 255, 0.97);
    border-bottom-color: rgba(109, 0, 163, 0.15);
}

html[data-theme="light"] .admin-game-modal__header h2 {
    color: #48135d;
}

html[data-theme="light"] .admin-game-modal__header p {
    color: #74527f;
}

html[data-theme="light"] .admin-game-modal__close {
    color: #48135d;
    background: #f7eefb;
    border-color: rgba(109, 0, 163, 0.16);
}


/* =========================================================
   LIGHT MODE — FORM
========================================================= */

html[data-theme="light"] .admin-game-form {
    color: #48135d;
}

html[data-theme="light"] .admin-game-field > span,
html[data-theme="light"] .admin-game-field label,
html[data-theme="light"] .admin-game-form__poll strong {
    color: #48135d;
}

html[data-theme="light"] .admin-game-field small,
html[data-theme="light"] .admin-game-form__poll small {
    color: #74527f;
}

html[data-theme="light"] .admin-game-field input,
html[data-theme="light"] .admin-game-field textarea,
html[data-theme="light"] .admin-game-field select {
    color: #48135d;
    background: #ffffff;
    border-color: rgba(109, 0, 163, 0.18);
}

html[data-theme="light"] .admin-game-field input::placeholder,
html[data-theme="light"] .admin-game-field textarea::placeholder {
    color: #9b82a3;
}

html[data-theme="light"] .admin-game-field select option {
    color: #48135d;
    background: #ffffff;
}

html[data-theme="light"] .admin-game-form__preview,
html[data-theme="light"] .admin-game-form__cover {
    background: #efe4f4;
    border-color: rgba(109, 0, 163, 0.16);
}

html[data-theme="light"] .admin-game-form__poll {
    color: #48135d;
    background: #f7eefb;
    border-color: rgba(109, 0, 163, 0.16);
}

html[data-theme="light"] .admin-game-form__actions {
    border-top-color: rgba(109, 0, 163, 0.13);
}

html[data-theme="light"] .admin-game-form__cancel {
    color: #48135d;
    background: #ffffff;
    border-color: rgba(109, 0, 163, 0.18);
}


/* =========================================================
   LIGHT MODE — TWITCH SEARCH
========================================================= */

html[data-theme="light"] .admin-twitch-search {
    color: #48135d;
    background: #f8effd;
    border-color: rgba(109, 0, 163, 0.16);
}

html[data-theme="light"] .admin-twitch-search__heading strong {
    color: #48135d;
}

html[data-theme="light"] .admin-twitch-search__heading p {
    color: #74527f;
}

html[data-theme="light"] .admin-twitch-search__bar input {
    color: #48135d;
    background: #ffffff;
    border-color: rgba(109, 0, 163, 0.18);
}

html[data-theme="light"] .admin-twitch-search__bar input::placeholder {
    color: #9b82a3;
}

html[data-theme="light"] .admin-twitch-selected {
    background:
        linear-gradient(
            135deg,
            rgba(0, 143, 145, 0.07),
            rgba(109, 0, 163, 0.06)
        );
    border-color: rgba(0, 143, 145, 0.22);
}

html[data-theme="light"] .admin-twitch-selected__info strong {
    color: #48135d;
}

html[data-theme="light"] .admin-twitch-selected__info small {
    color: #74527f;
}

html[data-theme="light"] .admin-twitch-selected__change {
    color: #48135d;
    background: #ffffff;
    border-color: rgba(109, 0, 163, 0.16);
}

html[data-theme="light"] .admin-twitch-search__loading,
html[data-theme="light"] .admin-twitch-search__empty {
    color: #74527f;
    background: rgba(255, 255, 255, 0.75);
    border-color: rgba(109, 0, 163, 0.16);
}

html[data-theme="light"] .admin-twitch-result {
    color: #48135d;
    background: #ffffff;
    border-color: rgba(109, 0, 163, 0.16);
}

html[data-theme="light"] .admin-twitch-result:hover {
    background: #f6eefe;
    border-color: rgba(194, 24, 120, 0.28);
}

html[data-theme="light"] .admin-twitch-result__cover {
    background: #efe4f4;
}

html[data-theme="light"] .admin-twitch-result > strong {
    color: #48135d;
}

html[data-theme="light"] .admin-twitch-result__select {
    color: #008f91;
}


</style>