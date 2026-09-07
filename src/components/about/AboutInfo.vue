<script setup lang="ts">

/* =========================================================
   TYPES
========================================================= */

interface InfoCard {
    icon: string;
    title: string;
    value: string;
    messages: string[];
}


/* =========================================================
   MASCOT TIMER
========================================================= */

let mascotHoverTimer: number | null = null;


/* =========================================================
   RANDOM MESSAGE
========================================================= */

function getRandomMessage(messages: string[]): string {

    if (!messages || messages.length === 0) {
        return "";
    }

    const randomIndex = Math.floor(
        Math.random() * messages.length
    );

    return messages[randomIndex] ?? "";
}


/* =========================================================
   SEND MASCOT MESSAGE
========================================================= */

function sendMascotMessage(message: string) {

    if (!message.trim()) {
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

function startMascotHover(messages: string[]) {

    stopMascotHover();

    mascotHoverTimer = window.setTimeout(
        () => {

            sendMascotMessage(
                getRandomMessage(messages)
            );

            mascotHoverTimer = null;

        },
        400
    );
}


/* =========================================================
   STOP HOVER
========================================================= */

function stopMascotHover() {

    if (mascotHoverTimer === null) {
        return;
    }

    window.clearTimeout(mascotHoverTimer);

    mascotHoverTimer = null;
}


/* =========================================================
   INFORMATIONS
========================================================= */

const informations: InfoCard[] = [

    /* =====================================================
       PSEUDO
    ===================================================== */

    {
        icon: "🐙",

        title: "Pseudo",

        value: "Couaxia",

        messages: [
            "Couaxia ! Oui oui, c'est moi ! 🐙",
            "Tu connais maintenant mon petit nom ! 💜",
            "Couaxia... un nom parfaitement normal pour une Kraduk.",
            "Facile à retenir : Couaxia et beaucoup de tentacules !"
        ]
    },


    /* =====================================================
       GENRE
    ===================================================== */

    {
        icon: "♀️",

        title: "Genre",

        value: "Femme",

        messages: [
            "Une Kraduk, oui madame ! 💜",
            "Une femme, quelques tentacules et beaucoup trop d'énergie !",
            "Rien de très mystérieux ici ! 👀"
        ]
    },


    /* =====================================================
       ÂGE
    ===================================================== */

    {
        icon: "🎂",

        title: "Âge",

        value: "126 ans (26 ans humain)",

        messages: [
            "126 ans ? Je suis encore jeune pour une Kraduk ! 👀",
            "Sur Terre ça correspond à environ 26 ans !",
            "Non, je ne suis pas vieille ! C'est vous les humains qui vieillissez vite ! 😂",
            "Le temps ne passe pas exactement pareil quand on vient de Saphira. 🌌"
        ]
    },


    /* =====================================================
       POIDS
    ===================================================== */

    {
        icon: "⚖️",

        title: "Poids",

        value: "65 kg",

        messages: [
            "On ne demande normalement pas son poids à une dame ! 👀",
            "65 kg... les tentacules sont incluses dans le calcul ?",
            "Les voyages spatiaux, ça entretient ! 🚀"
        ]
    },


    /* =====================================================
       TAILLE
    ===================================================== */

    {
        icon: "📏",

        title: "Taille",

        value: "1,60 m",

        messages: [
            "1,60 m ! Parfaitement à la bonne hauteur !",
            "Petite ? Moi ? Absolument pas ! 😤",
            "Ce qui compte, c'est la taille des tentacules ! 🐙",
            "Je fais 1,60 m... sans compter toute mon énergie !"
        ]
    },


    /* =====================================================
       ASTROLOGIE
    ===================================================== */

    {
        icon: "♉",

        title: "Signe astrologique",

        value: "Taureau",

        messages: [
            "Taureau ! Ça explique peut-être mon caractère. 👀",
            "Têtue ? Moi ? Jamais ! ... enfin presque.",
            "Taureau jusque sur une autre planète ! ✨"
        ]
    },


    /* =====================================================
       ESPÈCE
    ===================================================== */

    {
        icon: "🐙",

        title: "Espèce",

        value: "Poulpe de l’espace de la race des Kraduks",

        messages: [
            "Je suis une Kraduk venue de la planète Saphira ! 🌌",
            "Oui, techniquement je suis un poulpe de l'espace. 🐙",
            "Les Kraduks sont quand même plutôt fascinants !",
            "Tentacules + espace = Kraduk !"
        ]
    },


    /* =====================================================
       LANGUE
    ===================================================== */

    {
        icon: "🇫🇷",

        title: "Langue",

        value: "Français",

        messages: [
            "Baguette, fromage, saucisson ! 🇫🇷",
            "Les streams sont principalement en français !",
            "J'ai appris le français après mon arrivée sur Terre... enfin, presque ! 👀",
            "Tu entendras sûrement quelques expressions bien françaises ici !"
        ]
    },


    /* =====================================================
       CONTENU
    ===================================================== */

    {
        icon: "🎮",

        title: "Contenu",

        value: "Multigaming",

        messages: [
            "Impossible de me limiter à un seul jeu ! 🎮",
            "Du chill, de l'horreur, du multijoueur... j'aime tout essayer !",
            "Chez moi, on change souvent d'univers !",
            "Multigaming veut surtout dire : beaucoup trop de jeux dans ma bibliothèque. 👀"
        ]
    },


    /* =====================================================
       COMMUNAUTÉ
    ===================================================== */

    {
        icon: "💜",

        title: "Communauté",

        value: "Les Poups",

        messages: [
            "Les Poups ! Ma petite communauté adorée ! 💜",
            "Si tu restes assez longtemps, tu deviendras peut-être un Poup toi aussi ! 🐙",
            "Les Poups prennent soin les uns des autres.",
            "Une Kraduk sans ses Poups, ce serait beaucoup moins drôle !"
        ]
    },


    /* =====================================================
       AMBIANCE
    ===================================================== */

    {
        icon: "✨",

        title: "Ambiance",

        value: "Humour et bonne humeur",

        messages: [
            "Ici, l'objectif principal est de passer un bon moment ! 💜",
            "Humour, bonne humeur... et parfois beaucoup de chaos.",
            "On essaie d'être sages... mais ce n'est pas toujours gagné ! 😂",
            "Installe-toi confortablement, ici on aime rigoler !"
        ]
    }

];

</script>


<template>

    <section
        class="about-info"
        aria-labelledby="about-info-title"
    >

        <!-- =================================================
             HEADER
        ================================================== -->

        <header
            class="
                about-info__header
                about-info__banner
            "
        >

            <img
                src="https://ik.imagekit.io/couaxia/artworks/forme-3/Couaxia's_Chibi.png?updatedAt=1788685705555"
                alt=""
                class="about-info__banner-image"
                aria-hidden="true"
            >


            <div
                class="about-info__banner-overlay"
                aria-hidden="true"
            ></div>


            <div class="about-info__banner-content">

                <p class="about-info__eyebrow">
                    FICHE D’IDENTITÉ
                </p>


                <h2
                    id="about-info-title"
                    class="about-info__title"
                >
                    Quelques infos sur moi
                </h2>


                <p class="about-info__description">

                    Quelques petites informations pour mieux
                    connaître la créature derrière les tentacules.

                </p>

            </div>

        </header>


        <!-- =================================================
             GRID
        ================================================== -->

        <div class="about-info__grid">

            <article
                v-for="info in informations"

                :key="info.title"

                class="about-info-card"

                tabindex="0"

                @mouseenter="
                    startMascotHover(
                        info.messages
                    )
                "

                @mouseleave="
                    stopMascotHover
                "

                @focus="
                    startMascotHover(
                        info.messages
                    )
                "

                @blur="
                    stopMascotHover
                "
            >

                <!-- =========================================
                     ICON
                ========================================== -->

                <span
                    class="about-info-icon"
                    aria-hidden="true"
                >
                    {{ info.icon }}
                </span>


                <!-- =========================================
                     TITLE
                ========================================== -->

                <h3>
                    {{ info.title }}
                </h3>


                <!-- =========================================
                     VALUE
                ========================================== -->

                <p>
                    {{ info.value }}
                </p>

            </article>

        </div>

    </section>

</template>