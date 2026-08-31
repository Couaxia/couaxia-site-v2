<script setup lang="ts">

import {
    computed,
    onBeforeUnmount,
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

const favoriteGames =
    computed(
        () =>
            games.value
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
        value:
            "all",

        label:
            "Tous",

        icon:
            "🎮"
    },

    {
        value:
            "current",

        label:
            "En cours",

        icon:
            "🔥"
    },

    {
        value:
            "regular",

        label:
            "Réguliers",

        icon:
            "🔁"
    },

    {
        value:
            "backlog",

        label:
            "À faire",

        icon:
            "📚"
    },

    {
        value:
            "finished",

        label:
            "Terminés",

        icon:
            "🏆"
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
           LOOKUP
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
    game:
        Game
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
        ]
        ??
        null
    );

}


/* =========================================================
   GAME NAME
========================================================= */

function getGameName(
    game:
        Game
):
    string {

    const twitchGame =
        getTwitchGame(
            game
        );


    return (
        twitchGame?.name
        ??
        game.twitch_name
        ??
        "Jeu sans nom"
    );

}


/* =========================================================
   STATUS LABEL
========================================================= */

function getStatusLabel(
    status:
        string
):
    string {

    const labels:
        Record<
            string,
            string
        > = {

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
        labels[
            status
        ]
        ??
        status
    );

}


/* =========================================================
   STATUS ICON
========================================================= */

function getStatusIcon(
    status:
        string
):
    string {

    const icons:
        Record<
            string,
            string
        > = {

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
        icons[
            status
        ]
        ??
        "🎮"
    );

}


/* =========================================================
   MASCOT TIMER
========================================================= */

let mascotHoverTimer:
    number | null =
        null;


/* =========================================================
   RANDOM MESSAGE
========================================================= */

function getRandomMessage(
    messages:
        string[]
):
    string {

    if (
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
   START MASCOT HOVER
========================================================= */

function startMascotHover(
    messages:
        string[]
) {

    stopMascotHover();


    mascotHoverTimer =
        window.setTimeout(
            () => {

                const message =
                    getRandomMessage(
                        messages
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
   STOP MASCOT HOVER
========================================================= */

function stopMascotHover() {

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
   MASCOT — LIBRARY
========================================================= */

function speakAboutLibrary() {

    const amount =
        favoriteGames.value.length;


    startMascotHover(
        [

            `Bienvenue dans ma bibliothèque ! J'ai ${amount} jeu${amount > 1 ? "x" : ""} ici.`,

            "Voici toutes les aventures qui sont passées entre mes tentacules ! 🐙",

            "Attention... cette bibliothèque contient beaucoup trop de jeux !",

            "Tu cherches quelque chose à regarder ? Fouille un peu par ici ! 👀",

            "Entre les jeux terminés et ma liste à faire... j'ai encore du travail !"

        ]
    );

}


/* =========================================================
   MASCOT — FILTER
========================================================= */

function speakAboutFilter(
    filter:
        typeof filters[number]
) {

    const messages:
        Record<
            string,
            string[]
        > = {

            all: [

                "Tu veux vraiment TOUT voir ? Bon courage !",

                "Voilà toute ma bibliothèque ! 🎮",

                "Attention, il commence à y avoir beaucoup de jeux ici !"

            ],


            current: [

                "Voici les aventures qui sont encore en cours !",

                "Pas de spoilers sur ceux-là ! 👀",

                "Mes tentacules travaillent encore sur ces jeux !"

            ],


            regular: [

                "Ceux-là reviennent régulièrement en stream !",

                "Les habitués de la chaîne sont par ici !",

                "Prépare-toi, les réguliers finissent souvent en chaos."

            ],


            backlog: [

                "Ahem... oui, ma liste de jeux à faire commence à être longue.",

                "Ils attendent patiemment leur tour !",

                "Je vais les faire un jour. Promis. Enfin... probablement."

            ],


            finished: [

                "Mission accomplie ! 🏆",

                "Toutes ces aventures sont terminées !",

                "Que de souvenirs dans cette catégorie ! 💜"

            ]

        };


    startMascotHover(
        messages[
            filter.value
        ]
        ??
        [
            "Voyons ce qu'on trouve ici !"
        ]
    );

}


/* =========================================================
   MASCOT — GAME
========================================================= */

function speakAboutGame(
    game:
        Game
) {

    const gameName =
        getGameName(
            game
        );


    const statusMessages:
        Record<
            string,
            string[]
        > = {

            current: [

                `${gameName} est encore en cours !`,

                `Pas de spoilers sur ${gameName}, l'aventure n'est pas terminée !`,

                `On continue bientôt ${gameName} ensemble !`,

                `Mes tentacules sont encore occupées avec ${gameName} !`

            ],


            regular: [

                `${gameName} revient régulièrement sur la chaîne !`,

                `${gameName}, un habitué des streams !`,

                `Tu risques de revoir souvent ${gameName} par ici.`,

                `${gameName} + les Poups = probablement du chaos.`

            ],


            backlog: [

                `${gameName} attend encore son tour !`,

                `Oui oui... je jouerai à ${gameName} un jour !`,

                `${gameName} est encore dans ma liste à découvrir.`,

                `Il faudrait peut-être que je commence ${gameName}... 👀`

            ],


            paused: [

                `${gameName} est en pause pour le moment.`,

                `On reviendra peut-être sur ${gameName} plus tard !`,

                `Même les Kraduks ont parfois besoin d'une pause !`,

                `${gameName} attend sagement que je revienne.`

            ],


            finished: [

                `${gameName} ? Mission accomplie ! 🏆`,

                `J'ai terminé ${gameName} !`,

                `${gameName} fait maintenant partie des souvenirs des Poups !`,

                `Une aventure terminée de plus avec ${gameName} !`

            ]

        };


    startMascotHover(
        statusMessages[
            game.status
        ]
        ??
        [
            `${gameName} fait partie de ma bibliothèque !`
        ]
    );

}


/* =========================================================
   MASCOT — TAG
========================================================= */

function speakAboutTag(
    game:
        Game,

    tag:
        string
) {

    const gameName =
        getGameName(
            game
        );


    startMascotHover(
        [

            `${tag} fait partie des thèmes de ${gameName} !`,

            `Hmm... "${tag}", ça décrit plutôt bien ${gameName}.`,

            `Tu aimes les jeux "${tag}" ? 👀`,

            `${gameName} est classé dans "${tag}" !`,

            `Encore un peu de "${tag}" dans ma bibliothèque !`

        ]
    );

}


/* =========================================================
   MASCOT — RATING
========================================================= */

function speakAboutRating(
    game:
        Game
) {

    if (
        game.rating === null
        ||
        game.rating === undefined
    ) {

        return;

    }


    const gameName =
        getGameName(
            game
        );


    const rating =
        game.rating;


    const messages = [

        `J'ai donné ${rating}/10 à ${gameName} !`,

        `${gameName} obtient ${rating}/10 !`,

        `${rating}/10... tu aurais mis combien à ${gameName} ? 👀`

    ];


    if (
        rating >= 9
    ) {

        messages.push(
            `${rating}/10 ! Oui... j'ai vraiment adoré ${gameName} ! 💜`
        );

    }

    else if (
        rating >= 7
    ) {

        messages.push(
            `${gameName} s'en sort plutôt bien avec ${rating}/10 !`
        );

    }

    else if (
        rating >= 5
    ) {

        messages.push(
            `${rating}/10... sympathique, mais pas parfait !`
        );

    }

    else {

        messages.push(
            `${rating}/10... disons que ${gameName} et moi, ça n'a pas vraiment fonctionné. 😅`
        );

    }


    startMascotHover(
        messages
    );

}


/* =========================================================
   MASCOT — PLAYLIST
========================================================= */

function speakAboutPlaylist(
    game:
        Game
) {

    const gameName =
        getGameName(
            game
        );


    startMascotHover(
        [

            `Tu veux revoir mes aventures sur ${gameName} ?`,

            `La playlist de ${gameName} est juste ici ! ▶️`,

            `Attention aux spoilers dans la playlist de ${gameName} ! 👀`,

            `Installe-toi confortablement... direction ${gameName} !`,

            `Envie d'un petit marathon ${gameName} ?`

        ]
    );

}


/* =========================================================
   MASCOT — POLL
========================================================= */

function speakAboutPoll(
    game:
        Game
) {

    const gameName =
        getGameName(
            game
        );


    startMascotHover(
        [

            `${gameName} est disponible dans les sondages ! 🗳️`,

            `Tu peux voter pour ${gameName} !`,

            `Peut-être que ton vote fera revenir ${gameName} en stream... 👀`,

            `Les Poups peuvent donner leur avis sur ${gameName} !`,

            `Direction les sondages si tu veux soutenir ${gameName} !`

        ]
    );

}


/* =========================================================
   MOUNT
========================================================= */

onMounted(
    loadGames
);


/* =========================================================
   CLEANUP
========================================================= */

onBeforeUnmount(
    () => {

        stopMascotHover();

    }
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

        <header
            class="games-favorites__header"

            tabindex="0"

            @mouseenter="
                speakAboutLibrary
            "

            @mouseleave="
                stopMascotHover
            "

            @focus="
                speakAboutLibrary
            "

            @blur="
                stopMascotHover
            "
        >

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
            v-else-if="
                favoriteGames.length === 0
            "

            class="
                games-library__empty
            "
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

                    :key="
                        filter.value
                    "

                    type="button"

                    class="
                        games-favorites__filter
                    "

                    :class="{
                        'games-favorites__filter--active':
                            selectedStatus ===
                            filter.value
                    }"

                    @click="
                        selectedStatus =
                            filter.value
                    "

                    @mouseenter="
                        speakAboutFilter(
                            filter
                        )
                    "

                    @mouseleave="
                        stopMascotHover
                    "

                    @focus="
                        speakAboutFilter(
                            filter
                        )
                    "

                    @blur="
                        stopMascotHover
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
                 NO RESULT
            ============================================== -->

            <div
                v-if="
                    filteredGames.length === 0
                "

                class="
                    games-library__empty
                "
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

                    :key="
                        game.id
                    "

                    class="
                        game-favorite-card
                    "

                    :class="[
                        `game-favorite-card--${game.status}`
                    ]"

                    tabindex="0"

                    @mouseenter="
                        speakAboutGame(
                            game
                        )
                    "

                    @mouseleave="
                        stopMascotHover
                    "

                    @focus="
                        speakAboutGame(
                            game
                        )
                    "

                    @blur="
                        stopMascotHover
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

                            class="
                                game-favorite-card__image
                            "

                            loading="lazy"
                        >


                        <!-- FALLBACK -->

                        <div
                            v-else

                            class="
                                game-favorite-card__placeholder
                            "

                            aria-hidden="true"
                        >
                            🎮
                        </div>


                        <!-- STATUS -->

                        <span
                            class="
                                game-favorite-card__status
                            "

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

                        <h3
                            class="
                                game-favorite-card__title
                            "
                        >

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

                            class="
                                game-favorite-card__tags
                            "
                        >

                            <span
                                v-for="tag in game.tags"

                                :key="
                                    tag
                                "

                                class="
                                    game-favorite-card__tag
                                "

                                tabindex="0"

                                @mouseenter.stop="
                                    speakAboutTag(
                                        game,
                                        tag
                                    )
                                "

                                @mouseleave.stop="
                                    stopMascotHover
                                "

                                @focus.stop="
                                    speakAboutTag(
                                        game,
                                        tag
                                    )
                                "

                                @blur.stop="
                                    stopMascotHover
                                "
                            >

                                {{ tag }}

                            </span>

                        </div>


                        <!-- DESCRIPTION -->

                        <p
                            v-if="
                                game.description
                            "

                            class="
                                game-favorite-card__description
                            "
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

                                class="
                                    game-favorite-card__rating
                                "

                                tabindex="0"

                                @mouseenter.stop="
                                    speakAboutRating(
                                        game
                                    )
                                "

                                @mouseleave.stop="
                                    stopMascotHover
                                "

                                @focus.stop="
                                    speakAboutRating(
                                        game
                                    )
                                "

                                @blur.stop="
                                    stopMascotHover
                                "
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
                                v-if="
                                    game.youtube_playlist
                                "

                                :href="
                                    game.youtube_playlist
                                "

                                target="_blank"

                                rel="
                                    noopener noreferrer
                                "

                                class="
                                    game-favorite-card__youtube
                                "

                                @mouseenter.stop="
                                    speakAboutPlaylist(
                                        game
                                    )
                                "

                                @mouseleave.stop="
                                    stopMascotHover
                                "

                                @focus.stop="
                                    speakAboutPlaylist(
                                        game
                                    )
                                "

                                @blur.stop="
                                    stopMascotHover
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
                            v-if="
                                game.poll_enabled
                            "

                            class="
                                game-favorite-card__poll
                            "

                            tabindex="0"

                            @mouseenter.stop="
                                speakAboutPoll(
                                    game
                                )
                            "

                            @mouseleave.stop="
                                stopMascotHover
                            "

                            @focus.stop="
                                speakAboutPoll(
                                    game
                                )
                            "

                            @blur.stop="
                                stopMascotHover
                            "
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