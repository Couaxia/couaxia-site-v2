<script setup lang="ts">

import "../assets/styles/pages/home.css";

import TwitchSection
    from "../components/twitch/Section.vue";


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
        !messages ||
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


    if (
        !messages ||
        messages.length === 0
    ) {

        return;

    }


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
            450
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

    "Bienvenue dans mon petit univers ! 🐙💜",

    "Installe-toi, il y a beaucoup de choses à découvrir ici !",

    "Jeux, dessins, histoire, Twitch... oui, j'aime faire beaucoup trop de choses. 👀",

    "Bienvenue chez Couaxia ! Attention aux tentacules. 🐙",

    "Tu viens d'arriver ? Alors laisse-moi te faire visiter ! ✨"

];


/* =========================================================
   HERO IMAGE MESSAGES
========================================================= */

const heroImageMessages = [

    "Coucou toi ! 👀",

    "Oui oui, c'est bien moi ! 🐙",

    "Tu regardes ma petite illustration ? 💜",

    "Je surveille l'accueil depuis ici !",

    "Une petite Couaxia pour t'accueillir comme il se doit. ✨"

];


/* =========================================================
   UNIVERSE MESSAGES
========================================================= */

const universeMessages = [

    "Tu ne sais pas par où commencer ? Je peux t'aider ! 👀",

    "Voici trois bons endroits pour commencer l'exploration.",

    "Jeux, sondages ou artworks... à toi de choisir !",

    "Bienvenue dans les différentes branches de mon univers ! 🐙"

];


/* =========================================================
   GAMES MESSAGES
========================================================= */

const gamesMessages = [

    "Tu veux voir à quoi je joue en ce moment ? 🎮",

    "Attention, il y a beaucoup trop de jeux dans ma bibliothèque !",

    "Horreur, coopération, aventure... je touche à tout !",

    "Viens voir les jeux qui occupent mes streams. 👀"

];


/* =========================================================
   POLLS MESSAGES
========================================================= */

const pollsMessages = [

    "Ici, c'est toi qui peux avoir ton mot à dire ! 🗳️",

    "Tu veux choisir mon prochain jeu ou mon prochain supplice ? 👀",

    "Les Poups peuvent voter ici ! 💜",

    "Attention à ce que tu votes... je pourrais vraiment devoir le faire ! 😂"

];


/* =========================================================
   CREDITS MESSAGES
========================================================= */

const creditsMessages = [

    "Viens découvrir toutes les personnes talentueuses derrière mes illustrations ! 🎨",

    "Ma galerie contient beaucoup de très belles créations. 💜",

    "Pense à aller découvrir les artistes derrière chaque œuvre !",

    "Attention, tu risques de rester un moment dans la galerie. 👀"

];


/* =========================================================
   TWITCH MESSAGES
========================================================= */

const twitchMessages = [

    "C'est ici que tu peux voir si je suis en live ! 💜",

    "Twitch, c'est là où une bonne partie du chaos se passe. 🎮",

    "Tu peux retrouver ici mon live, mes clips et mes vidéos !",

    "Peut-être que je suis en direct en ce moment... 👀"

];


/* =========================================================
   DISCOVERY MESSAGES
========================================================= */

const discoveryMessages = [

    "Tu veux en apprendre encore plus sur moi ? 💜",

    "Cette partie te permet d'aller un peu plus loin dans mon univers.",

    "Mon histoire, mes informations... il reste encore beaucoup à découvrir !",

    "Tu pensais déjà tout savoir sur moi ? Pas si vite. 👀"

];


/* =========================================================
   ABOUT MESSAGES
========================================================= */

const aboutMessages = [

    "Tu veux en savoir un peu plus sur moi ? 👀",

    "Tu trouveras ici ma fiche complète !",

    "Mes goûts, mon parcours, ma palette... oui, j'ai beaucoup de choses à raconter. 🐙",

    "Viens découvrir la créature derrière les tentacules ! 💜"

];


/* =========================================================
   HISTORY MESSAGES
========================================================= */

const historyMessages = [

    "Tout a commencé bien loin de la Terre... 📖",

    "Saphira, Avadora, Natsu... tu veux connaître toute l'histoire ?",

    "Prépare-toi, mon aventure est bien plus grande qu'elle en a l'air ! ✨",

    "Direction mon histoire si tu veux découvrir d'où je viens. 🐙"

];


/* =========================================================
   ACCOUNT MESSAGES
========================================================= */

const accountMessages = [

    "Ton petit espace personnel se trouve par ici ! 🔐",

    "Un jour, tes favoris et d'autres fonctionnalités seront ici. 👀",

    "Tu veux rejoindre encore un peu plus mon univers ?",

    "Connexion intergalactique en approche ! 🐙"

];

</script>


<template>

    <main class="home-page">

        <div class="page-container">


            <!-- =================================================
                 HERO
            ================================================== -->

            <section
                class="home-hero"

                @mouseenter="
                    startMascotHover(
                        heroMessages
                    )
                "

                @mouseleave="
                    stopMascotHover
                "
            >

                <div class="home-hero__content">

                    <span class="home-hero__eyebrow">
                        🐙 VTUBEUSE • MULTIGAMING • HUMOUR
                    </span>


                    <h1 class="home-hero__title">

                        Bienvenue dans l'univers de

                        <span class="home-hero__title-highlight">
                            Couaxia
                        </span>

                    </h1>


                    <p class="home-hero__description">

                        Je suis Couaxia, VTubeuse multigaming.

                        Ici tu peux retrouver mon univers,
                        mes jeux, mes artworks, mon histoire,
                        mes sondages et tout ce qui concerne
                        mes lives Twitch.

                    </p>

                </div>


                <!-- =============================================
                     VISUEL
                ============================================== -->

                <div
                    class="home-hero__visual"

                    tabindex="0"

                    @mouseenter.stop="
                        startMascotHover(
                            heroImageMessages
                        )
                    "

                    @mouseleave.stop="
                        stopMascotHover
                    "

                    @focus="
                        startMascotHover(
                            heroImageMessages
                        )
                    "

                    @blur="
                        stopMascotHover
                    "
                >

                    <div class="home-hero__image-wrapper">

                        <img
                            src="https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/artworks/stream/Koleander_chibi.png"
                            alt="Illustration de Couaxia"
                            class="home-hero__image"
                            draggable="false"
                        >

                    </div>

                </div>

            </section>


            <!-- =================================================
                 MON UNIVERS
            ================================================== -->

            <section
                class="
                    home-section
                    page-section
                "

                @mouseenter="
                    startMascotHover(
                        universeMessages
                    )
                "

                @mouseleave="
                    stopMascotHover
                "
            >

                <div class="home-section__header">

                    <div>

                        <h2 class="home-section__heading">
                            Mon univers
                        </h2>


                        <p class="home-section__subtitle">
                            Quelques raccourcis pour découvrir le site.
                        </p>

                    </div>

                </div>


                <div class="home-info-grid">


                    <!-- =========================================
                         JEUX
                    ========================================== -->

                    <RouterLink
                        to="/games"
                        class="home-info-card"

                        @mouseenter.stop="
                            startMascotHover(
                                gamesMessages
                            )
                        "

                        @mouseleave.stop="
                            stopMascotHover
                        "

                        @focus="
                            startMascotHover(
                                gamesMessages
                            )
                        "

                        @blur="
                            stopMascotHover
                        "
                    >

                        <span class="home-info-card__icon">
                            🎮
                        </span>


                        <h3 class="home-info-card__title">
                            Mes jeux
                        </h3>


                        <p class="home-info-card__text">

                            Retrouve les jeux auxquels je joue,
                            mes avis, mes statuts et les prochaines
                            aventures prévues.

                        </p>

                    </RouterLink>


                    <!-- =========================================
                         SONDAGES
                    ========================================== -->

                    <RouterLink
                        to="/polls"
                        class="home-info-card"

                        @mouseenter.stop="
                            startMascotHover(
                                pollsMessages
                            )
                        "

                        @mouseleave.stop="
                            stopMascotHover
                        "

                        @focus="
                            startMascotHover(
                                pollsMessages
                            )
                        "

                        @blur="
                            stopMascotHover
                        "
                    >

                        <span class="home-info-card__icon">
                            🗳️
                        </span>


                        <h3 class="home-info-card__title">
                            Sondages
                        </h3>


                        <p class="home-info-card__text">

                            Vote pour les prochains jeux,
                            événements ou choix proposés
                            à la communauté.

                        </p>

                    </RouterLink>


                    <!-- =========================================
                         CRÉDITS
                    ========================================== -->

                    <RouterLink
                        to="/credits"
                        class="home-info-card"

                        @mouseenter.stop="
                            startMascotHover(
                                creditsMessages
                            )
                        "

                        @mouseleave.stop="
                            stopMascotHover
                        "

                        @focus="
                            startMascotHover(
                                creditsMessages
                            )
                        "

                        @blur="
                            stopMascotHover
                        "
                    >

                        <span class="home-info-card__icon">
                            🎨
                        </span>


                        <h3 class="home-info-card__title">
                            Artworks & Crédits
                        </h3>


                        <p class="home-info-card__text">

                            Découvre les illustrations,
                            créations et artistes qui participent
                            à l'univers de Couaxia.

                        </p>

                    </RouterLink>

                </div>

            </section>


            <!-- =================================================
                 TWITCH
            ================================================== -->

            <section
                class="
                    home-section
                    page-section
                "

                @mouseenter="
                    startMascotHover(
                        twitchMessages
                    )
                "

                @mouseleave="
                    stopMascotHover
                "
            >

                <div class="home-section__header">

                    <div>

                        <h2 class="home-section__heading">
                            Twitch
                        </h2>


                        <p class="home-section__subtitle">

                            Retrouve ici le statut du live,
                            les informations du stream,
                            les clips et les vidéos.

                        </p>

                    </div>

                </div>


                <TwitchSection />

            </section>


            <!-- =================================================
                 DÉCOUVRIR COUAXIA
            ================================================== -->

            <section
                class="
                    home-section
                    page-section
                "

                @mouseenter="
                    startMascotHover(
                        discoveryMessages
                    )
                "

                @mouseleave="
                    stopMascotHover
                "
            >

                <div class="home-section__header">

                    <div>

                        <h2 class="home-section__heading">
                            Découvrir Couaxia
                        </h2>


                        <p class="home-section__subtitle">
                            Explore les différentes parties
                            de mon univers.
                        </p>

                    </div>

                </div>


                <div class="home-info-grid">


                    <!-- =========================================
                         INFORMATIONS
                    ========================================== -->

                    <RouterLink
                        to="/about"
                        class="home-info-card"

                        @mouseenter.stop="
                            startMascotHover(
                                aboutMessages
                            )
                        "

                        @mouseleave.stop="
                            stopMascotHover
                        "

                        @focus="
                            startMascotHover(
                                aboutMessages
                            )
                        "

                        @blur="
                            stopMascotHover
                        "
                    >

                        <span class="home-info-card__icon">
                            👤
                        </span>


                        <h3 class="home-info-card__title">
                            Mes informations
                        </h3>


                        <p class="home-info-card__text">

                            Apprends-en plus sur moi,
                            mon VTubing et mon parcours.

                        </p>

                    </RouterLink>


                    <!-- =========================================
                         HISTOIRE
                    ========================================== -->

                    <RouterLink
                        to="/history"
                        class="home-info-card"

                        @mouseenter.stop="
                            startMascotHover(
                                historyMessages
                            )
                        "

                        @mouseleave.stop="
                            stopMascotHover
                        "

                        @focus="
                            startMascotHover(
                                historyMessages
                            )
                        "

                        @blur="
                            stopMascotHover
                        "
                    >

                        <span class="home-info-card__icon">
                            📚
                        </span>


                        <h3 class="home-info-card__title">
                            Mon histoire
                        </h3>


                        <p class="home-info-card__text">

                            Découvre le lore,
                            les personnages et les aventures
                            de l'univers Couaxia.

                        </p>

                    </RouterLink>


                    <!-- =========================================
                         PROFIL
                    ========================================== -->

                    <RouterLink
                        to="/login"
                        class="home-info-card"

                        @mouseenter.stop="
                            startMascotHover(
                                accountMessages
                            )
                        "

                        @mouseleave.stop="
                            stopMascotHover
                        "

                        @focus="
                            startMascotHover(
                                accountMessages
                            )
                        "

                        @blur="
                            stopMascotHover
                        "
                    >

                        <span class="home-info-card__icon">
                            🔐
                        </span>


                        <h3 class="home-info-card__title">
                            Ton espace
                        </h3>


                        <p class="home-info-card__text">

                            Connecte-toi pour accéder
                            plus tard à ton profil,
                            tes favoris et tes fonctionnalités.

                        </p>

                    </RouterLink>

                </div>

            </section>

        </div>

    </main>

</template>