<script setup lang="ts">

import {
    computed,
    onBeforeUnmount,
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
   MASCOT TIMER
========================================================= */

let mascotHoverTimer:
    number | null =
        null;


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
   RANDOM MESSAGE
========================================================= */

function getRandomMessage(
    messages:
        string[]
):
    string {

    if (
        !messages
        ||
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
        messages[randomIndex]
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

                sendMascotMessage(
                    getRandomMessage(
                        messages
                    )
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
   MASCOT — STAT
========================================================= */

function speakAboutStat(
    type:
        string,

    value:
        number
) {

    const messages:
        Record<
            string,
            string[]
        > = {

            current: [

                `J'ai ${value} aventure${value > 1 ? "s" : ""} en cours ! 🔥`,

                "Ce sont les aventures en cours !",

                "Ces jeux occupent actuellement mes tentacules ! 🐙",

                "On n’a pas encore fini avec ceux-là !",

                value > 0
                    ? "Pas de spoilers, ces aventures continuent encore ! 👀"
                    : "Pour l'instant, aucune aventure en cours !"

            ],


            regular: [

                `J'ai ${value} jeu${value > 1 ? "x" : ""} régulier${value > 1 ? "s" : ""} ! 🔁`,

                "Ceux-là reviennent souvent en stream !",

                "Des valeurs sûres de la chaîne !",

                "Impossible de les abandonner trop longtemps !",

                "Les réguliers finissent souvent par créer beaucoup trop de chaos. 😂"

            ],


            backlog: [

                `${value} jeu${value > 1 ? "x" : ""} dans ma liste à faire... oups. 📚`,

                "Ma liste de jeux à faire commence à devenir dangereusement longue...",

                "Un jour, je finirai peut-être toute cette liste !",

                "Encore des aventures qui m’attendent !",

                value > 10
                    ? "Je crois qu'il va falloir plusieurs vies pour terminer tout ça. 👀"
                    : "Ça reste encore raisonnable... enfin je crois."

            ],


            finished: [

                `${value} aventure${value > 1 ? "s" : ""} terminée${value > 1 ? "s" : ""} ! 🏆`,

                "Mission accomplie !",

                "Ceux-là, on les a terminés ensemble !",

                "Encore quelques aventures rangées dans les souvenirs !",

                "Chaque jeu terminé laisse quelques souvenirs avec les Poups. 💜"

            ]

        };


    startMascotHover(
        messages[type]
        ??
        [
            "Encore une statistique de ma bibliothèque ! 🎮"
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
        class="games-stats"
        aria-label="Statistiques des jeux"
    >

        <article
            v-for="stat in stats"

            :key="
                stat.type
            "

            class="
                games-stat
            "

            :class="[
                `games-stat--${stat.type}`
            ]"

            tabindex="0"

            @mouseenter="
                speakAboutStat(
                    stat.type,
                    stat.value
                )
            "

            @mouseleave="
                stopMascotHover
            "

            @focus="
                speakAboutStat(
                    stat.type,
                    stat.value
                )
            "

            @blur="
                stopMascotHover
            "
        >

            <!-- =================================================
                 ICON
            ================================================== -->

            <div
                class="
                    games-stat__icon
                "

                aria-hidden="true"
            >
                {{ stat.icon }}
            </div>


            <!-- =================================================
                 CONTENT
            ================================================== -->

            <div class="games-stat__content">

                <strong
                    class="
                        games-stat__number
                    "
                >

                    <span v-if="loading">
                        ...
                    </span>


                    <span v-else>
                        {{ stat.value }}
                    </span>

                </strong>


                <span
                    class="
                        games-stat__label
                    "
                >
                    {{ stat.label }}
                </span>

            </div>

        </article>

    </section>

</template>