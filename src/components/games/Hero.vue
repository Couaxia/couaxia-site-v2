<script setup lang="ts">

import {
    onBeforeUnmount
} from "vue";


/* =========================================================
   GAMES HERO
========================================================= */

const heroImage =
    "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/mascotte/YCH_Dance_V2.gif";


/* =========================================================
   TYPES
========================================================= */

interface GameTag {
    icon: string;
    label: string;
    messages: string[];
}


/* =========================================================
   HERO TAGS
========================================================= */

const gameTags: GameTag[] = [

    {
        icon:
            "🎮",

        label:
            "Multigaming",

        messages: [

            "Le multigaming, c'est parfait pour ne jamais s'ennuyer !",

            "Pourquoi choisir un seul jeu quand on peut en découvrir plein ?",

            "Ici, on change souvent d'univers... et j'adore ça !",

            "Mes tentacules sont entraînées pour jouer à beaucoup trop de jeux. 🐙",

            "Un peu de tout, beaucoup de chaos : bienvenue dans le multigaming !"

        ]
    },


    {
        icon:
            "👻",

        label:
            "Horreur",

        messages: [

            "Les jeux d'horreur et moi... c'est compliqué. 👻",

            "Je suis courageuse ! Enfin... jusqu'au premier jumpscare.",

            "Pourquoi est-ce que je continue de jouer à des jeux qui me font peur ?",

            "Les Poups aiment beaucoup trop me voir souffrir sur les jeux d'horreur !",

            "Un jumpscare et mes tentacules partent dans tous les sens ! 🐙"

        ]
    },


    {
        icon:
            "🤝",

        label:
            "Coop",

        messages: [

            "À plusieurs, tout devient immédiatement plus chaotique !",

            "La coopération, c'est important... normalement.",

            "Les jeux en coop avec les Poups ? Toujours une excellente idée !",

            "Promis, je n'abandonne personne derrière... enfin, j'essaie.",

            "Coopération + Couaxia = aucune garantie sur le résultat. 😂"

        ]
    },


    {
        icon:
            "📖",

        label:
            "Narratif",

        messages: [

            "J'adore me perdre dans une bonne histoire !",

            "Le problème des jeux narratifs ? Je m'attache beaucoup trop aux personnages.",

            "Et évidemment, je choisis toujours les décisions les plus compliquées.",

            "Une bonne histoire peut me rester longtemps en tête. 💜",

            "Attention... je peux passer beaucoup trop de temps à réfléchir à un choix."

        ]
    }

];


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
   HERO MESSAGES
========================================================= */

const heroMessages = [

    "Bienvenue dans ma bibliothèque de jeux ! 🎮",

    "Tu veux découvrir les jeux qui occupent mes streams ?",

    "Attention, certains jeux ici ont déjà maltraité mes tentacules ! 🐙",

    "Entre jeux d'horreur, aventures et chaos multijoueur... il y a de quoi faire !",

    "Tu reconnais certains jeux auxquels nous avons joué ensemble ?",

    "Installe-toi, il y a beaucoup d'aventures à découvrir ici !",

    "Bienvenue dans l'endroit où ma liste de jeux devient beaucoup trop longue. 😂"

];


/* =========================================================
   EXPLORE MESSAGES
========================================================= */

const exploreMessages = [

    "Tu veux voir toute ma bibliothèque ? C'est par ici ! 🎮",

    "Attention... il y a beaucoup de jeux un peu plus bas !",

    "Descendons voir les aventures qui occupent mes tentacules ! 🐙",

    "Allez, direction la bibliothèque !",

    "Tu trouveras peut-être ton jeu préféré juste en dessous. 👀",

    "Prépare-toi à explorer beaucoup trop de jeux !"

];


/* =========================================================
   POLLS MESSAGES
========================================================= */

const pollsMessages = [

    "Tu veux choisir une de mes prochaines aventures ? 🗳️",

    "Les Poups peuvent voter pour les prochains jeux !",

    "Attention... votre vote peut être responsable de ma prochaine souffrance. 😂",

    "Direction les sondages ! Ton vote compte !",

    "Quel jeu voudrais-tu voir apparaître en stream ? 👀",

    "Les Poups ont encore des décisions importantes à prendre !"

];


/* =========================================================
   IMAGE MESSAGES
========================================================= */

const imageMessages = [

    "Oui oui... je danse encore ! 💃",

    "Pourquoi choisir un jeu quand on peut danser ?",

    "Une petite danse avant de commencer une nouvelle aventure ! ✨",

    "Mes tentacules sont prêtes pour la prochaine partie ! 🐙",

    "Tu regardes vraiment la mascotte au lieu de regarder les jeux ? 👀",

    "C'est ma danse officielle de sélection du prochain jeu ! 🎮",

    "Je danse jusqu'à ce que quelqu'un choisisse le prochain jeu !"

];


/* =========================================================
   SCROLL MESSAGES
========================================================= */

const scrollMessages = [

    "Allez, on descend ! 👇",

    "La bibliothèque est juste en dessous !",

    "Tu veux découvrir mes jeux ? Suis la flèche !",

    "Encore un petit peu plus bas... 👀",

    "Direction mes aventures ! 🎮"

];


/* =========================================================
   TAG MASCOT
========================================================= */

function speakAboutTag(
    tag:
        GameTag
) {

    startMascotHover(
        tag.messages
    );

}


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
        class="games-hero"
        aria-labelledby="games-hero-title"

        @mouseenter="
            startMascotHover(
                heroMessages
            )
        "

        @mouseleave="
            stopMascotHover
        "
    >

        <!-- =================================================
             BACKGROUND
        ================================================== -->

        <div
            class="games-hero__background"
            aria-hidden="true"
        ></div>


        <!-- =================================================
             CONTENT
        ================================================== -->

        <div class="games-hero__content">

            <!-- =============================================
                 TEXT
            ============================================== -->

            <div class="games-hero__text">

                <!-- =========================================
                     EYEBROW
                ========================================== -->

                <p class="games-hero__eyebrow">

                    <span
                        class="games-hero__eyebrow-icon"
                        aria-hidden="true"
                    >
                        🎮
                    </span>


                    <span>
                        LA BIBLIOTHÈQUE DE COUAXIA
                    </span>

                </p>


                <!-- =========================================
                     TITLE
                ========================================== -->

                <h1
                    id="games-hero-title"
                    class="games-hero__title"
                >

                    Mes

                    <span>
                        jeux
                    </span>

                </h1>


                <!-- =========================================
                     DESCRIPTION
                ========================================== -->

                <p class="games-hero__description">

                    Retrouve les jeux auxquels je joue
                    actuellement, mes jeux réguliers,
                    les prochaines aventures prévues
                    et celles que nous avons déjà
                    terminées ensemble !

                </p>


                <!-- =========================================
                     TAGS
                ========================================== -->

                <div
                    class="games-hero__tags"
                    aria-label="Mes styles de jeux"
                >

                    <span
                        v-for="tag in gameTags"

                        :key="
                            tag.label
                        "

                        class="
                            games-hero__tag
                        "

                        tabindex="0"

                        @mouseenter.stop="
                            speakAboutTag(
                                tag
                            )
                        "

                        @mouseleave.stop="
                            stopMascotHover
                        "

                        @focus.stop="
                            speakAboutTag(
                                tag
                            )
                        "

                        @blur.stop="
                            stopMascotHover
                        "
                    >

                        <span
                            aria-hidden="true"

                            class="
                                games-hero__tag-icon
                            "
                        >
                            {{ tag.icon }}
                        </span>


                        <span>
                            {{ tag.label }}
                        </span>

                    </span>

                </div>


                <!-- =========================================
                     ACTIONS
                ========================================== -->

                <div class="games-hero__actions">

                    <!-- =====================================
                         EXPLORE
                    ====================================== -->

                    <a
                        href="#games-library"

                        class="
                            games-hero__button
                            games-hero__button--primary
                        "

                        @mouseenter.stop="
                            startMascotHover(
                                exploreMessages
                            )
                        "

                        @mouseleave.stop="
                            stopMascotHover
                        "

                        @focus.stop="
                            startMascotHover(
                                exploreMessages
                            )
                        "

                        @blur.stop="
                            stopMascotHover
                        "
                    >

                        <span aria-hidden="true">
                            🎮
                        </span>


                        <span>
                            Explorer mes jeux
                        </span>


                        <span
                            class="
                                games-hero__button-arrow
                            "

                            aria-hidden="true"
                        >
                            ↓
                        </span>

                    </a>


                    <!-- =====================================
                         POLLS
                    ====================================== -->

                    <RouterLink
                        to="/polls"

                        class="
                            games-hero__button
                            games-hero__button--secondary
                        "

                        @mouseenter.stop="
                            startMascotHover(
                                pollsMessages
                            )
                        "

                        @mouseleave.stop="
                            stopMascotHover
                        "

                        @focus.stop="
                            startMascotHover(
                                pollsMessages
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
                            Sondages
                        </span>

                    </RouterLink>

                </div>

            </div>


            <!-- =============================================
                 VISUAL
            ============================================== -->

            <div
                class="
                    games-hero__visual
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

                <!-- =========================================
                     GLOW
                ========================================== -->

                <div
                    class="
                        games-hero__glow
                    "

                    aria-hidden="true"
                ></div>


                <!-- =========================================
                     DECORATIONS
                ========================================== -->

                <span
                    class="
                        games-hero__decoration
                        games-hero__decoration--one
                    "

                    aria-hidden="true"
                >
                    ✦
                </span>


                <span
                    class="
                        games-hero__decoration
                        games-hero__decoration--two
                    "

                    aria-hidden="true"
                >
                    ✦
                </span>


                <span
                    class="
                        games-hero__decoration
                        games-hero__decoration--three
                    "

                    aria-hidden="true"
                >
                    🎮
                </span>


                <!-- =========================================
                     IMAGE
                ========================================== -->

                <img
                    :src="
                        heroImage
                    "

                    alt="
                        Couaxia dans son univers gaming
                    "

                    class="
                        games-hero__image
                    "
                >

            </div>

        </div>


        <!-- =================================================
             SCROLL INDICATOR
        ================================================== -->

        <a
            href="#games-library"

            class="
                games-hero__scroll
            "

            aria-label="
                Découvrir les jeux
            "

            @mouseenter.stop="
                startMascotHover(
                    scrollMessages
                )
            "

            @mouseleave.stop="
                stopMascotHover
            "

            @focus.stop="
                startMascotHover(
                    scrollMessages
                )
            "

            @blur.stop="
                stopMascotHover
            "
        >

            <span>
                Découvrir
            </span>


            <span
                class="
                    games-hero__scroll-arrow
                "

                aria-hidden="true"
            >
                ↓
            </span>

        </a>

    </section>

</template>