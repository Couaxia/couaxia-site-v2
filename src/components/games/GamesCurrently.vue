<script setup lang="ts">

import {
    computed,
    onMounted,
    ref
} from "vue";

import {
    getGames,
    type Game
} from "../../services/games.service";


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
   CURRENT GAMES
========================================================= */

const currentGames =
    computed(
        () =>
            games.value.filter(
                game =>
                    game.status ===
                    "current"
            )
    );


/* =========================================================
   LOAD GAMES
========================================================= */

async function loadGames() {

    loading.value =
        true;


    error.value =
        null;


    try {

        games.value =
            await getGames();


        console.log(
            "🎮 Jeux en cours :",
            currentGames.value
        );

    }

    catch (err) {

        console.error(
            "Erreur GamesCurrently :",
            err
        );


        error.value =
            err instanceof Error
                ? err.message
                : "Impossible de récupérer les jeux en cours.";

    }

    finally {

        loading.value =
            false;

    }

}


/* =========================================================
   GAME NAME
========================================================= */

function getGameName(
    game: Game
) {

    return (
        game.twitch_name ??
        "Jeu sans nom"
    );

}


/* =========================================================
   RANDOM MESSAGE
========================================================= */

function getRandomMessage(
    messages: string[]
) {

    if (
        messages.length === 0
    ) {

        return null;

    }


    const index =
        Math.floor(
            Math.random() *
            messages.length
        );


    return messages[index];

}


/* =========================================================
   MASCOT — GAME
========================================================= */

function speakAboutGame(
    game: Game
) {

    const gameName =
        getGameName(
            game
        );


    const messages = [

        `En ce moment, je joue à ${gameName} !`,

        `${gameName}, c'est l'une de mes aventures du moment !`,

        `On n'a pas encore terminé ${gameName} !`,

        `Pas de spoilers sur ${gameName}, l'aventure continue !`,

        `Mes tentacules sont encore occupées avec ${gameName} !`

    ];


    const message =
        getRandomMessage(
            messages
        );


    if (!message) {

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
   MASCOT — SECTION
========================================================= */

function speakAboutCurrentGames() {

    const amount =
        currentGames.value.length;


    const messages =
        amount > 0

            ? [

                `J'ai ${amount} aventure${amount > 1 ? "s" : ""} en cours !`,

                "Voici les jeux qu'on est en train de découvrir ensemble !",

                "Attention aux spoilers, ces aventures ne sont pas encore terminées !",

                "C'est ici que tu peux voir mes aventures du moment !"

            ]

            : [

                "Aucune aventure en cours pour le moment !",

                "Mes tentacules cherchent leur prochaine aventure...",

                "Il va bientôt falloir choisir un nouveau jeu !"

            ];


    const message =
        getRandomMessage(
            messages
        );


    if (!message) {

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
   MOUNT
========================================================= */

onMounted(
    loadGames
);

</script>


<template>

    <section
        class="games-currently"
        aria-labelledby="games-currently-title"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header
            class="games-currently__header"
            tabindex="0"
            @mouseenter="speakAboutCurrentGames"
            @focus="speakAboutCurrentGames"
        >

            <div class="games-currently__heading">

                <span
                    class="games-currently__heading-icon"
                    aria-hidden="true"
                >
                    🔥
                </span>


                <div>

                    <p class="games-currently__eyebrow">
                        EN CE MOMENT
                    </p>


                    <h2
                        id="games-currently-title"
                        class="games-currently__title"
                    >
                        Mes aventures
                        <span>
                            en cours
                        </span>
                    </h2>

                </div>

            </div>


            <p class="games-currently__description">
                Les jeux et aventures que je suis
                actuellement en train de découvrir
                en stream avec les Poups.
            </p>

        </header>


        <!-- =================================================
             LOADING
        ================================================== -->

        <div
            v-if="loading"
            class="games-currently__state"
        >

            <span
                class="games-currently__state-icon"
                aria-hidden="true"
            >
                🎮
            </span>


            <p>
                Recherche des aventures en cours...
            </p>

        </div>


        <!-- =================================================
             ERROR
        ================================================== -->

        <div
            v-else-if="error"
            class="
                games-currently__state
                games-currently__state--error
            "
        >

            <span
                class="games-currently__state-icon"
                aria-hidden="true"
            >
                ⚠️
            </span>


            <p>
                {{ error }}
            </p>

        </div>


        <!-- =================================================
             EMPTY
        ================================================== -->

        <div
            v-else-if="currentGames.length === 0"
            class="
                games-currently__state
                games-currently__state--empty
            "
        >

            <span
                class="games-currently__state-icon"
                aria-hidden="true"
            >
                🐙
            </span>


            <h3>
                Pas d'aventure en cours
            </h3>


            <p>
                Mes tentacules attendent encore
                leur prochaine aventure !
            </p>

        </div>


        <!-- =================================================
             CURRENT GAMES
        ================================================== -->

        <div
            v-else
            class="games-currently__grid"
        >

            <article
                v-for="game in currentGames"
                :key="game.id"
                class="games-current-card"
                tabindex="0"
                @mouseenter="
                    speakAboutGame(
                        game
                    )
                "
                @focus="
                    speakAboutGame(
                        game
                    )
                "
            >

                <!-- =========================================
                     VISUAL
                ========================================== -->

                <div class="games-current-card__visual">

                    <img
                        v-if="game.box_art_url"
                        :src="game.box_art_url"
                        :alt="`Jaquette de ${game.twitch_name}`"
                        class="games-current-card__image"
                    >

                    <div
                        v-else
                        class="games-current-card__placeholder"
                    >
                     🎮
                    </div>


                    <!-- =====================================
                         STATUS
                    ====================================== -->

                    <span class="games-current-card__status">

                        <span
                            aria-hidden="true"
                        >
                            🔥
                        </span>

                        En cours

                    </span>

                </div>


                <!-- =========================================
                     CONTENT
                ========================================== -->

                <div class="games-current-card__content">

                    <!-- GAME NAME -->

                    <h3 class="games-current-card__title">

                        {{
                            getGameName(
                                game
                            )
                        }}

                    </h3>


                    <!-- =====================================
                         TAGS
                    ====================================== -->

                    <div
                        v-if="
                            game.tags &&
                            game.tags.length > 0
                        "
                        class="games-current-card__tags"
                    >

                        <span
                            v-for="tag in game.tags"
                            :key="tag"
                            class="games-current-card__tag"
                        >
                            {{ tag }}
                        </span>

                    </div>


                    <!-- =====================================
                         DESCRIPTION
                    ====================================== -->

                    <p
                        v-if="game.description"
                        class="games-current-card__description"
                    >
                        {{ game.description }}
                    </p>


                    <!-- =====================================
                         FOOTER
                    ====================================== -->

                    <div class="games-current-card__footer">

                        <!-- RATING -->

                        <div
                            v-if="
                                game.rating !== null &&
                                game.rating !== undefined
                            "
                            class="games-current-card__rating"
                        >

                            <span
                                aria-hidden="true"
                            >
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
                            class="games-current-card__youtube"
                        >

                            <span
                                aria-hidden="true"
                            >
                                ▶️
                            </span>

                            Playlist

                        </a>

                    </div>

                </div>

            </article>

        </div>

    </section>

</template>