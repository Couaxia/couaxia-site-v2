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
   GAMES
========================================================= */

const games =
    ref<Game[]>([]);


const loading =
    ref(
        true
    );


/* =========================================================
   LOAD GAMES
========================================================= */

async function loadGames() {

    loading.value =
        true;


    try {

        games.value =
            await getGames();

    }

    catch (error) {

        console.error(
            "Erreur GamesStats :",
            error
        );

    }

    finally {

        loading.value =
            false;

    }

}


/* =========================================================
   STATS
========================================================= */

const stats =
    computed(
        () => [

            {
                icon:
                    "🔥",

                label:
                    "En cours",

                value:
                    games.value.filter(
                        game =>
                            game.status ===
                            "current"
                    ).length,

                type:
                    "current"
            },


            {
                icon:
                    "🔁",

                label:
                    "Réguliers",

                value:
                    games.value.filter(
                        game =>
                            game.status ===
                            "regular"
                    ).length,

                type:
                    "regular"
            },


            {
                icon:
                    "📚",

                label:
                    "À faire",

                value:
                    games.value.filter(
                        game =>
                            game.status ===
                            "backlog"
                    ).length,

                type:
                    "backlog"
            },


            {
                icon:
                    "🏆",

                label:
                    "Terminés",

                value:
                    games.value.filter(
                        game =>
                            game.status ===
                            "finished"
                    ).length,

                type:
                    "finished"
            }

        ]
    );


/* =========================================================
   MASCOT MESSAGES
========================================================= */

const statMessages:
    Record<string, string[]> = {

        current: [
            "Ce sont les aventures en cours !",
            "Ces jeux occupent actuellement mes tentacules !",
            "On n’a pas encore fini avec ceux-là !"
        ],

        regular: [
            "Ceux-là reviennent souvent en stream !",
            "Des valeurs sûres de la chaîne !",
            "Impossible de les abandonner trop longtemps !"
        ],

        backlog: [
            "Ma liste de jeux à faire commence à devenir dangereusement longue...",
            "Un jour, je finirai peut-être toute cette liste !",
            "Encore des aventures qui m’attendent !"
        ],

        finished: [
            "Mission accomplie !",
            "Ceux-là, on les a terminés ensemble !",
            "Encore quelques aventures rangées dans les souvenirs !"
        ]

    };


/* =========================================================
   MASCOT
========================================================= */

function speakWithMascot(
    type: string
) {

    const messages =
        statMessages[type];


    if (
        !messages ||
        messages.length === 0
    ) {

        return;

    }


    const randomIndex =
        Math.floor(
            Math.random() *
            messages.length
        );


    window.dispatchEvent(
        new CustomEvent(
            "couaxia-mascot-message",
            {
                detail: {
                    message:
                        messages[randomIndex]
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
        class="games-stats"
        aria-label="Statistiques des jeux"
    >

        <article
            v-for="stat in stats"
            :key="stat.type"
            class="games-stat"
            :class="[
                `games-stat--${stat.type}`
            ]"
            tabindex="0"
            @mouseenter="
                speakWithMascot(
                    stat.type
                )
            "
            @focus="
                speakWithMascot(
                    stat.type
                )
            "
        >

            <div
                class="games-stat__icon"
                aria-hidden="true"
            >
                {{ stat.icon }}
            </div>


            <div class="games-stat__content">

                <strong class="games-stat__number">

                    <span v-if="loading">
                        ...
                    </span>

                    <span v-else>
                        {{ stat.value }}
                    </span>

                </strong>


                <span class="games-stat__label">
                    {{ stat.label }}
                </span>

            </div>

        </article>

    </section>

</template>