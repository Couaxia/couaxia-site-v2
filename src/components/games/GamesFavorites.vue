<script setup lang="ts">

import {
    computed,
    onMounted,
    ref
} from "vue";

import {
    getGames,
    type Game,
    type GameStatus
} from "../../services/games.service";

import {
    getTwitchGamesByIds,
    type TwitchGameData
} from "../../services/twitch-games.service";


/* =========================================================
   DATA
========================================================= */

const games =
    ref<Game[]>([]);


const loading =
    ref(
        true
    );


const error =
    ref<string | null>(
        null
    );


/* =========================================================
   TWITCH GAMES
========================================================= */

const twitchGames =
    ref<
        Record<
            string,
            TwitchGameData
        >
    >(
        {}
    );


/* =========================================================
   FAVORITE GAMES
========================================================= */

/*
 * Pour le moment, tous les jeux présents dans Supabase
 * sont considérés comme faisant partie de la bibliothèque.
 *
 * Plus tard, on pourra ajouter une colonne "favorite"
 * dans Supabase pour distinguer réellement les favoris.
 */

const favoriteGames =
    computed(
        () => games.value
    );


/* =========================================================
   FILTER
========================================================= */

const selectedStatus =
    ref<
        "all" |
        GameStatus
    >(
        "all"
    );


/* =========================================================
   FILTERED GAMES
========================================================= */

const filteredGames =
    computed(
        () => {

            if (
                selectedStatus.value ===
                "all"
            ) {

                return favoriteGames.value;

            }


            return favoriteGames.value.filter(
                game =>
                    game.status ===
                    selectedStatus.value
            );

        }
    );


/* =========================================================
   FILTER BUTTONS
========================================================= */

const filters = [

    {
        value: "all",
        label: "Tous",
        icon: "🎮"
    },

    {
        value: "current",
        label: "En cours",
        icon: "🔥"
    },

    {
        value: "regular",
        label: "Réguliers",
        icon: "🔁"
    },

    {
        value: "backlog",
        label: "À faire",
        icon: "📚"
    },

    {
        value: "finished",
        label: "Terminés",
        icon: "🏆"
    }

] as const;


/* =========================================================
   LOAD GAMES
========================================================= */

async function loadGames() {

    loading.value =
        true;


    error.value =
        null;


    try {

        /* =============================================
           SUPABASE
        ============================================== */

        games.value =
            await getGames();


        /* =============================================
           TWITCH IDS
        ============================================== */

        const twitchIds =
            games.value
                .map(
                    game =>
                        game.twitch_game_id
                )
                .filter(
                    (
                        id
                    ): id is string =>
                        Boolean(
                            id
                        )
                );


        /* =============================================
           TWITCH
        ============================================== */

        const twitchData =
            await getTwitchGamesByIds(
                twitchIds
            );


        /* =============================================
           CREATE LOOKUP
        ============================================== */

        twitchGames.value =
            Object.fromEntries(
                twitchData.map(
                    game => [
                        game.id,
                        game
                    ]
                )
            );


        console.log(
            "🎮 Supabase :",
            games.value
        );


        console.log(
            "🟣 Twitch :",
            twitchGames.value
        );

    }

    catch (err) {

        console.error(
            "Erreur GamesFavorites :",
            err
        );


        error.value =
            err instanceof Error
                ? err.message
                : "Impossible de récupérer les jeux.";

    }

    finally {

        loading.value =
            false;

    }

}


/* =========================================================
   TWITCH GAME DATA
========================================================= */

function getTwitchGame(
    game: Game
):
    TwitchGameData | null {

    if (
        !game.twitch_game_id
    ) {

        return null;

    }


    return (
        twitchGames.value[
            game.twitch_game_id
        ] ??
        null
    );

}


/* =========================================================
   GAME NAME
========================================================= */

function getGameName(
    game: Game
) {

    const twitchGame =
        getTwitchGame(
            game
        );


    return (
        twitchGame?.name ??
        game.twitch_name ??
        "Jeu sans nom"
    );

}


/* =========================================================
   STATUS LABEL
========================================================= */

function getStatusLabel(
    status: string
) {

    const labels:
        Record<string, string> = {

            current:
                "En cours",

            regular:
                "Régulier",

            backlog:
                "À découvrir",

            paused:
                "En pause",

            finished:
                "Terminé"

        };


    return (
        labels[status] ??
        status
    );

}


/* =========================================================
   STATUS ICON
========================================================= */

function getStatusIcon(
    status: string
) {

    const icons:
        Record<string, string> = {

            current:
                "🔥",

            regular:
                "💜",

            backlog:
                "🎮",

            paused:
                "⏸️",

            finished:
                "✅"

        };


    return (
        icons[status] ??
        "🎮"
    );

}


/* =========================================================
   MASCOT MESSAGES
========================================================= */

const mascotMessages:
    Record<string, string[]> = {

        current: [

            "Celui-là, on est encore en plein dedans !",

            "Pas de spoilers, l'aventure n'est pas terminée !",

            "On continue bientôt cette aventure ensemble !"

        ],


        regular: [

            "Celui-là revient régulièrement sur la chaîne !",

            "Un classique des streams de Couaxia !",

            "Prépare-toi, ça finit généralement en chaos !"

        ],


        backlog: [

            "Encore un jeu dans ma liste à découvrir !",

            "Celui-là attend encore son tour !",

            "Un jour peut-être... quand ma liste de jeux aura diminué !"

        ],


        paused: [

            "Cette aventure est en pause pour le moment.",

            "On y reviendra peut-être plus tard !",

            "Même les Kraduks ont parfois besoin d'une pause !"

        ],


        finished: [

            "Mission accomplie !",

            "Celui-là est terminé !",

            "Une aventure de plus dans les souvenirs des Poups !"

        ]

    };


/* =========================================================
   SPEAK WITH MASCOT
========================================================= */

function speakWithMascot(
    game: Game
) {

    const messages =
        mascotMessages[
            game.status
        ] ??
        [
            "Encore une aventure dans ma bibliothèque !"
        ];


    if (
        messages.length === 0
    ) {

        return;

    }


    const randomIndex =
        Math.floor(
            Math.random() *
            messages.length
        );


    const message =
        messages[
            randomIndex
        ];


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
   MOUNT
========================================================= */

onMounted(
    loadGames
);

</script>


<template>

    <section
        class="games-favorites"
        aria-labelledby="games-favorites-title"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header class="games-favorites__header">

            <div class="games-favorites__heading">

                <span
                    class="games-favorites__heading-icon"
                    aria-hidden="true"
                >
                    💜
                </span>


                <div>

                    <p class="games-favorites__eyebrow">
                        MA BIBLIOTHÈQUE
                    </p>


                    <h2
                        id="games-favorites-title"
                        class="games-favorites__title"
                    >
                        Mes jeux

                        <span>
                            favoris
                        </span>

                    </h2>

                </div>

            </div>


            <p class="games-favorites__description">
                Quelques jeux et aventures que j'aime
                particulièrement retrouver en stream
                avec les Poups.
            </p>

        </header>


        <!-- =================================================
             LOADING
        ================================================== -->

        <div
            v-if="loading"
            class="games-library__loading"
        >

            <span
                class="games-library__loading-icon"
                aria-hidden="true"
            >
                🎮
            </span>

            <p>
                Chargement de ma bibliothèque...
            </p>

        </div>


        <!-- =================================================
             ERROR
        ================================================== -->

        <div
            v-else-if="error"
            class="games-library__error"
        >

            <span aria-hidden="true">
                ⚠️
            </span>


            <p>
                {{ error }}
            </p>

        </div>


        <!-- =================================================
             EMPTY LIBRARY
        ================================================== -->

        <div
            v-else-if="favoriteGames.length === 0"
            class="games-library__empty"
        >

            <span
                class="games-library__empty-icon"
                aria-hidden="true"
            >
                🐙
            </span>


            <h3>
                Aucun jeu pour le moment
            </h3>


            <p>
                Ma bibliothèque intergalactique
                est encore vide !
            </p>

        </div>


        <!-- =================================================
             GAMES
        ================================================== -->

        <template v-else>


            <!-- =============================================
                 FILTERS
            ============================================== -->

            <div class="games-favorites__filters">

                <button
                    v-for="filter in filters"
                    :key="filter.value"
                    type="button"
                    class="games-favorites__filter"
                    :class="{
                        'games-favorites__filter--active':
                            selectedStatus === filter.value
                    }"
                    @click="
                        selectedStatus =
                            filter.value
                    "
                >

                    <span aria-hidden="true">
                        {{ filter.icon }}
                    </span>


                    <span>
                        {{ filter.label }}
                    </span>

                </button>

            </div>


            <!-- =============================================
                 NO RESULT FOR FILTER
            ============================================== -->

            <div
                v-if="filteredGames.length === 0"
                class="games-library__empty"
            >

                <span
                    class="games-library__empty-icon"
                    aria-hidden="true"
                >
                    🐙
                </span>


                <h3>
                    Aucun jeu dans cette catégorie
                </h3>


                <p>
                    Rien à afficher ici pour le moment !
                </p>

            </div>


            <!-- =============================================
                 GAMES GRID
            ============================================== -->

            <div
                v-else
                class="games-favorites__grid"
            >

                <article
                    v-for="game in filteredGames"
                    :key="game.id"
                    class="game-favorite-card"
                    :class="[
                        `game-favorite-card--${game.status}`
                    ]"
                    tabindex="0"
                    @mouseenter="
                        speakWithMascot(
                            game
                        )
                    "
                    @focus="
                        speakWithMascot(
                            game
                        )
                    "
                >


                    <!-- =====================================
                         VISUAL
                    ====================================== -->

                    <div class="game-favorite-card__visual">


                        <!-- TWITCH COVER -->

                        <img
                            v-if="
                                getTwitchGame(
                                    game
                                )?.boxArtUrl
                            "
                            :src="
                                getTwitchGame(
                                    game
                                )!.boxArtUrl
                            "
                            :alt="
                                `Jaquette de ${getGameName(game)}`
                            "
                            class="game-favorite-card__image"
                            loading="lazy"
                        >


                        <!-- FALLBACK -->

                        <div
                            v-else
                            class="game-favorite-card__placeholder"
                            aria-hidden="true"
                        >
                            🎮
                        </div>


                        <!-- STATUS -->

                        <span
                            class="game-favorite-card__status"
                            :class="[
                                `game-favorite-card__status--${game.status}`
                            ]"
                        >

                            <span aria-hidden="true">

                                {{
                                    getStatusIcon(
                                        game.status
                                    )
                                }}

                            </span>


                            {{
                                getStatusLabel(
                                    game.status
                                )
                            }}

                        </span>

                    </div>


                    <!-- =====================================
                         CONTENT
                    ====================================== -->

                    <div class="game-favorite-card__content">


                        <!-- GAME NAME -->

                        <h3 class="game-favorite-card__title">

                            {{
                                getGameName(
                                    game
                                )
                            }}

                        </h3>


                        <!-- TAGS -->

                        <div
                            v-if="
                                game.tags &&
                                game.tags.length > 0
                            "
                            class="game-favorite-card__tags"
                        >

                            <span
                                v-for="tag in game.tags"
                                :key="tag"
                                class="game-favorite-card__tag"
                            >

                                {{ tag }}

                            </span>

                        </div>


                        <!-- DESCRIPTION -->

                        <p
                            v-if="game.description"
                            class="game-favorite-card__description"
                        >

                            {{ game.description }}

                        </p>


                        <!-- FOOTER -->

                        <div class="game-favorite-card__footer">


                            <!-- RATING -->

                            <div
                                v-if="
                                    game.rating !== null &&
                                    game.rating !== undefined
                                "
                                class="game-favorite-card__rating"
                            >

                                <span aria-hidden="true">
                                    ⭐
                                </span>


                                <strong>
                                    {{ game.rating }}
                                </strong>


                                <span>
                                    / 10
                                </span>

                            </div>


                            <!-- YOUTUBE -->

                            <a
                                v-if="game.youtube_playlist"
                                :href="game.youtube_playlist"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="game-favorite-card__youtube"
                                @mouseenter.stop="
                                    speakWithMascot(
                                        game
                                    )
                                "
                            >

                                <span aria-hidden="true">
                                    ▶️
                                </span>

                                Playlist

                            </a>

                        </div>


                        <!-- POLL -->

                        <div
                            v-if="game.poll_enabled"
                            class="game-favorite-card__poll"
                        >

                            <span aria-hidden="true">
                                🗳️
                            </span>


                            <span>
                                Disponible dans les sondages
                            </span>

                        </div>

                    </div>

                </article>

            </div>

        </template>

    </section>

</template>