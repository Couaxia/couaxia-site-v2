<script setup lang="ts">

import {
    onBeforeUnmount,
    onMounted,
    ref
} from "vue";

import {
    apiFetch
} from "../../services/api";


/* =========================================================
   TYPES
========================================================= */

interface TwitchFollowersResponse {

    success:
        boolean;

    data?: {
        followers:
            number;
    };

    message?:
        string;

    error?:
        string;

}


interface TwitchTag {

    label:
        string;

    messages:
        string[];

}


/* =========================================================
   STATE
========================================================= */

const followerCount =
    ref<number | null>(
        null
    );


const followersLoading =
    ref(
        true
    );


const followersError =
    ref<string | null>(
        null
    );


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
   HERO MESSAGES
========================================================= */

const heroMessages = [

    "Bienvenue sur ma page Twitch ! 💜",

    "C'est ici que tu peux retrouver toutes mes aventures en direct !",

    "Tu veux voir à quoi ressemble le chaos en live ? 👀",

    "Twitch, c'est un peu ma deuxième maison sur Terre. 🐙",

    "Installe-toi, les Poups ne sont jamais très loin !",

    "Entre multigaming, discussions et chaos... bienvenue sur Twitch !"

];


/* =========================================================
   FOLLOWERS MESSAGES
========================================================= */

function speakAboutFollowers() {

    const count =
        followerCount.value;


    if (
        count === null
    ) {

        startMascotHover(
            [

                "Je compte les Poups... attends un peu ! 👀",

                "Le compteur Twitch réfléchit encore...",

                "Les followers arrivent, mes tentacules comptent ! 🐙"

            ]
        );


        return;

    }


    startMascotHover(
        [

            `Vous êtes actuellement ${count} à suivre mes aventures ! 💜`,

            `${count} Poups sur Twitch... ça commence à faire du monde !`,

            `Merci aux ${count} personnes qui suivent la chaîne ! 🐙`,

            `On est déjà ${count} dans cette aventure !`,

            `${count} followers... et l'aventure continue ! ✨`

        ]
    );

}


/* =========================================================
   TAGS
========================================================= */

const tags:
    TwitchTag[] = [

        {
            label:
                "🎮 Multi-Gaming",

            messages: [

                "Impossible de me limiter à un seul jeu ! 🎮",

                "Du chill à l'horreur, j'aime découvrir un peu de tout.",

                "Le multigaming, c'est parfait pour varier les aventures !",

                "Ma bibliothèque de jeux commence à devenir dangereusement grande. 👀"

            ]
        },


        {
            label:
                "👾 VTubeuse",

            messages: [

                "Oui oui, je suis une VTubeuse venue de Saphira ! 👾",

                "Derrière ce modèle se cache tout un univers.",

                "Le VTubing me permet de donner vie à Couaxia !",

                "Tentacules, lore et streams : excellente combinaison. 🐙"

            ]
        },


        {
            label:
                "🇫🇷 Française",

            messages: [

                "Baguette, fromage, saucisson ! 🇫🇷",

                "Les streams sont principalement en français !",

                "Tu entendras sûrement quelques expressions bien françaises.",

                "Bienvenue, peu importe d'où tu viens !"

            ]
        },


        {
            label:
                "💜 Safe Place",

            messages: [

                "Ici, respect et bienveillance avant tout. 💜",

                "Je veux que tout le monde puisse passer un bon moment.",

                "Les Poups prennent soin les uns des autres.",

                "Une bonne communauté, c'est une communauté où chacun se sent bien."

            ]
        },


        {
            label:
                "🐙 Octopus",

            messages: [

                "Les poulpes sont les maîtres du monde. 🐙",

                "Tu avais remarqué mes tentacules ? 👀",

                "Les tentacules font légèrement partie de mon identité.",

                "Bienvenue dans le royaume des poulpes !"

            ]
        },


        {
            label:
                "🤝 Collab",

            messages: [

                "J'adore streamer avec d'autres créateurs !",

                "Plus on est nombreux, plus le chaos augmente. 🤝",

                "Les collaborations donnent toujours de bons souvenirs !",

                "Tu me verras souvent jouer avec des amis."

            ]
        },


        {
            label:
                "⚡ Énergie",

            messages: [

                "Je tiens rarement en place pendant un stream ! ⚡",

                "J'ai toujours beaucoup trop d'énergie.",

                "Prépare-toi à quelques moments complètement chaotiques !",

                "Chez moi, ça bouge presque tout le temps !"

            ]
        },


        {
            label:
                "🌙 Chill",

            messages: [

                "Même en mode détente, on rigole beaucoup. 🌙",

                "Installe-toi tranquillement et profite du stream !",

                "Une boisson chaude, un plaid et c'est parfait.",

                "Entre deux catastrophes, on sait aussi se poser un peu !"

            ]
        },


        {
            label:
                "🔞 +18",

            messages: [

                "Attention... ici on filtre rarement nos bêtises. 😂",

                "Quelques gros mots peuvent parfois s'échapper... oups !",

                "Le contenu est réservé à un public averti.",

                "Promis, on essaie d'être sages... enfin presque !"

            ]
        }

    ];


/* =========================================================
   TWITCH BUTTON MESSAGES
========================================================= */

const twitchButtonMessages = [

    "Tu veux venir voir les lives directement ? 💜",

    "Direction Twitch !",

    "Viens rejoindre les Poups en direct ! 🐙",

    "Je suis peut-être déjà en live... va vérifier ! 👀",

    "Un clic et te voilà sur la chaîne Twitch !",

    "Prépare-toi au chaos en direct !"

];


/* =========================================================
   IMAGE MESSAGES
========================================================= */

const imageMessages = [

    "Oui, c'est bien Couaxia et Myo ! 💜",

    "Tu regardes l'illustration de près ? 👀",

    "Myo fait partie des rencontres importantes de mon aventure.",

    "Une petite illustration de notre univers ! ✨",

    "Pas touche à l'image, mes tentacules surveillent. 🐙",

    "J'aime beaucoup cette illustration de nous deux !"

];


/* =========================================================
   LOAD FOLLOWERS
========================================================= */

async function loadFollowers():
    Promise<void> {

    followersError.value =
        null;


    try {

        const result =
            await apiFetch<TwitchFollowersResponse>(
                "/api/twitch/followers"
            );


        if (
            !result.success
            ||
            !result.data
        ) {

            throw new Error(
                result.error
                ??
                result.message
                ??
                "Impossible de récupérer le nombre de followers."
            );

        }


        followerCount.value =
            result.data.followers;

    }

    catch (
        error:
            unknown
    ) {

        console.error(
            "Erreur followers Twitch :",
            error
        );


        followersError.value =
            error instanceof Error
                ? error.message
                : "Une erreur inconnue est survenue.";

    }

    finally {

        followersLoading.value =
            false;

    }

}


/* =========================================================
   MOUNT
========================================================= */

onMounted(
    loadFollowers
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
        class="twitch-hero"

        tabindex="0"

        @mouseenter="
            startMascotHover(
                heroMessages
            )
        "

        @mouseleave="
            stopMascotHover
        "

        @focus="
            startMascotHover(
                heroMessages
            )
        "

        @blur="
            stopMascotHover
        "
    >

        <!-- =================================================
             TEXTE
        ================================================== -->

        <div class="twitch-hero__content">

            <span class="twitch-hero__eyebrow">
                CHAÎNE TWITCH
            </span>


            <h1 class="twitch-hero__title">

                Retrouve-moi
                <br>

                en direct sur

                <span class="twitch-hero__title-highlight">
                    Twitch
                </span>

            </h1>


            <p class="twitch-hero__description">

                Viens partager mes aventures,
                mes découvertes, mes jeux
                et mes moments de folie
                avec toute la communauté.

            </p>


            <!-- =============================================
                 FOLLOWERS
            ============================================== -->

            <p
                class="twitch-hero__followers"

                tabindex="0"

                @mouseenter.stop="
                    speakAboutFollowers
                "

                @mouseleave.stop="
                    stopMascotHover
                "

                @focus.stop="
                    speakAboutFollowers
                "

                @blur.stop="
                    stopMascotHover
                "
            >

                Vous êtes actuellement

                <strong v-if="followersLoading">
                    …
                </strong>


                <strong v-else-if="followerCount !== null">
                    {{ followerCount }}
                </strong>


                <strong v-else>
                    —
                </strong>

                à suivre les aventures de Couaxia sur Twitch !

            </p>


            <!-- =============================================
                 ERREUR FOLLOWERS
            ============================================== -->

            <p
                v-if="followersError"
                class="twitch-hero__followers-error"
            >
                Le nombre de followers est temporairement indisponible.
            </p>


            <!-- =============================================
                 TAGS
            ============================================== -->

            <div class="twitch-hero__tags">

                <span
                    v-for="tag in tags"

                    :key="
                        tag.label
                    "

                    class="
                        twitch-hero__tag
                    "

                    tabindex="0"

                    @mouseenter.stop="
                        startMascotHover(
                            tag.messages
                        )
                    "

                    @mouseleave.stop="
                        stopMascotHover
                    "

                    @focus.stop="
                        startMascotHover(
                            tag.messages
                        )
                    "

                    @blur.stop="
                        stopMascotHover
                    "
                >
                    {{ tag.label }}
                </span>

            </div>


            <!-- =============================================
                 BOUTON TWITCH
            ============================================== -->

            <div class="twitch-hero__actions">

                <a
                    href="https://www.twitch.tv/couaxia"

                    target="_blank"

                    rel="noopener noreferrer"

                    class="
                        twitch-hero__button
                    "

                    @mouseenter.stop="
                        startMascotHover(
                            twitchButtonMessages
                        )
                    "

                    @mouseleave.stop="
                        stopMascotHover
                    "

                    @focus.stop="
                        startMascotHover(
                            twitchButtonMessages
                        )
                    "

                    @blur.stop="
                        stopMascotHover
                    "
                >

                    <span aria-hidden="true">
                        💬
                    </span>


                    Voir la chaîne Twitch


                    <span aria-hidden="true">
                        ↗
                    </span>

                </a>

            </div>

        </div>


        <!-- =================================================
             VISUEL
        ================================================== -->

        <div
            class="
                twitch-hero__visual
            "

            tabindex="0"

            @mouseenter.stop="
                startMascotHover(
                    imageMessages
                )
            "

            @mouseleave.stop="
                stopMascotHover
            "

            @focus.stop="
                startMascotHover(
                    imageMessages
                )
            "

            @blur.stop="
                stopMascotHover
            "
        >

            <div class="twitch-hero__image-wrapper">

                <img
                    src="https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/artworks/couple/Couaxia_Myo.png"
                    alt="Couaxia et Myo"
                    class="twitch-hero__image"
                >

            </div>

        </div>

    </section>

</template>