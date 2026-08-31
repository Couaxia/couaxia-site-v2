<script setup lang="ts">

/* =========================================================
   FINAL IMAGE
========================================================= */

const finalImage =
    "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/mascotte/YCH_Dance_V2.gif";

/* =========================================================
   TWITCH LOGO
========================================================= */

const twitchLogo =
    "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/logo/twitch-logo-transparent.png";
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
   START HOVER
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
   STOP HOVER
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
   SECTION MESSAGES
========================================================= */

const finalMessages = [

    "Alors, tu as trouvé un jeu que tu aimerais voir en stream ?",

    "La bibliothèque va encore grandir, c’est certain !",

    "Il reste encore beaucoup trop de jeux à découvrir ensemble.",

    "Les Poups auront encore beaucoup de décisions à prendre !",

    "Une nouvelle aventure peut commencer n’importe quand...",

    "Qui sait quel jeu va devenir notre prochaine obsession ? 👀",

    "J'ai encore beaucoup trop de jeux dans ma liste... au secours. 🎮"

];


/* =========================================================
   TWITCH MESSAGES
========================================================= */

const twitchMessages = [

    "Tu veux venir voir tout ça en direct ? 💜",

    "Direction Twitch ! Mes tentacules t'attendent. 🐙",

    "Les prochaines aventures se passent directement sur Twitch !",

    "Viens rejoindre les Poups pendant les lives !",

    "Promis, il y aura sûrement du chaos en direct. 👀",

    "Un petit tour sur Twitch ? Je suis peut-être déjà en live !"

];


/* =========================================================
   POLLS MESSAGES
========================================================= */

const pollsMessages = [

    "Tu veux m'aider à choisir les prochaines aventures ? 🗳️",

    "Les Poups ont leur mot à dire !",

    "Direction les sondages pour voter !",

    "Ton vote pourrait décider du prochain jeu en stream. 👀",

    "Attention, vous êtes parfois responsables de mes futures souffrances ! 😂",

    "Voyons ce que les Poups veulent me faire jouer ensuite !"

];


/* =========================================================
   IMAGE MESSAGES
========================================================= */

const imageMessages = [

    "Oui oui, je danse encore ! 💃🐙",

    "Tu regardes la mascotte au lieu de choisir un jeu ? 👀",

    "Une petite danse pour célébrer toutes ces aventures !",

    "Mes tentacules ont aussi besoin de bouger un peu !",

    "Je suis prête pour la prochaine aventure ! 🎮",

    "Tu crois que cette danse porte chance pour le prochain jeu ? ✨"

];

</script>


<template>

    <section
        class="games-final"
        aria-labelledby="games-final-title"

        tabindex="0"

        @mouseenter="
            startMascotHover(
                finalMessages
            )
        "

        @mouseleave="
            stopMascotHover
        "

        @focus="
            startMascotHover(
                finalMessages
            )
        "

        @blur="
            stopMascotHover
        "
    >

        <!-- =================================================
             GLOWS
        ================================================== -->

        <div
            class="
                games-final__glow
                games-final__glow--left
            "
            aria-hidden="true"
        ></div>


        <div
            class="
                games-final__glow
                games-final__glow--right
            "
            aria-hidden="true"
        ></div>


        <!-- =================================================
             CONTENT
        ================================================== -->

        <div class="games-final__content">

            <!-- =============================================
                 TEXT
            ============================================== -->

            <div class="games-final__text">

                <p class="games-final__eyebrow">
                    LA SUITE ?
                </p>


                <h2
                    id="games-final-title"
                    class="games-final__title"
                >

                    Quelle sera la prochaine

                    <span>
                        aventure ?
                    </span>

                </h2>


                <p class="games-final__description">

                    Ma bibliothèque continue d’évoluer au fil
                    des streams, des découvertes et des envies
                    de la communauté.

                </p>


                <p class="games-final__description">

                    Certains jeux sont choisis directement,
                    d’autres passent par les sondages des Poups...
                    et parfois une idée complètement imprévue
                    débarque au dernier moment.

                </p>


                <p class="games-final__message">
                    On se retrouve pour la prochaine aventure 💜
                </p>


                <!-- =========================================
                     ACTIONS
                ========================================== -->

                <div class="games-final__actions">

                    <!-- =====================================
                         TWITCH
                    ====================================== -->

                    <a
                        href="
                            https://www.twitch.tv/couaxia
                        "

                        target="_blank"

                        rel="
                            noopener noreferrer
                        "

                        class="
                            games-final__button
                            games-final__button--primary
                        "

                        @mouseenter.stop="
                            startMascotHover(
                                twitchMessages
                            )
                        "

                        @mouseleave.stop="
                            stopMascotHover
                        "

                        @focus.stop="
                            startMascotHover(
                                twitchMessages
                            )
                        "

                        @blur.stop="
                            stopMascotHover
                        "
                    >

                        <img
                            :src="twitchLogo"

                            alt=""

                            class="
                                games-final__button-icon
                            "
                        >


                        <span>
                            Me retrouver sur Twitch
                        </span>


                        <span
                            class="
                                games-final__button-arrow
                            "

                            aria-hidden="true"
                        >
                            →
                        </span>

                    </a>


                    <!-- =====================================
                         POLLS
                    ====================================== -->

                    <RouterLink
                        :to="{
                            name: 'polls'
                        }"

                        class="
                            games-final__button
                            games-final__button--secondary
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

                        <span
                            class="games-final__button-emoji"
                            aria-hidden="true"
                        >
                            🗳️
                        </span>

                        <span>
                            Voir les sondages
                        </span>

                        <span
                            class="games-final__button-arrow"
                            aria-hidden="true"
                        >
                            →
                        </span>

                    </RouterLink>

                </div>

            </div>


            <!-- =============================================
                 VISUAL
            ============================================== -->

            <div
                class="
                    games-final__visual
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

                <div
                    class="
                        games-final__image-glow
                    "

                    aria-hidden="true"
                ></div>


                <span
                    class="
                        games-final__decoration
                        games-final__decoration--one
                    "

                    aria-hidden="true"
                >
                    ✦
                </span>


                <span
                    class="
                        games-final__decoration
                        games-final__decoration--two
                    "

                    aria-hidden="true"
                >
                    🎮
                </span>


                <img
                    :src="
                        finalImage
                    "

                    alt="
                        Couaxia
                    "

                    class="
                        games-final__image
                    "

                    loading="lazy"
                >

            </div>

        </div>

    </section>

</template>