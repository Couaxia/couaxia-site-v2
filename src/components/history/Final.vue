<script setup lang="ts">

import {
    onBeforeUnmount
} from "vue";


/* =========================================================
   FINAL IMAGE
========================================================= */

const finalImage =
    "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/site-asset/characters/couaxia.png";


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
            Math.random()
            *
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
   FINAL MESSAGES
========================================================= */

const finalMessages = [

    "Et voilà... tu connais maintenant une partie de mon histoire. 💜",

    "Mais crois-moi, l’aventure est encore loin d’être terminée.",

    "Saphira, Draquin, la Terre... et ce n’est que le commencement. 🌌",

    "Il reste encore beaucoup de choses que je ne vous ai pas racontées. 👀",

    "Merci d’avoir pris le temps de découvrir mon univers.",

    "Les prochains chapitres arriveront lorsque l’histoire continuera de grandir. 📖"

];


/* =========================================================
   IMAGE MESSAGES
========================================================= */

const imageMessages = [

    "Oui, c’est encore moi ! 🐙",

    "Après tout ce voyage, je suis toujours là. 💜",

    "Tu pensais vraiment que j’allais disparaître à la dernière page ? 👀",

    "Une Kraduk, beaucoup de kilomètres et encore énormément d’histoires à raconter.",

    "Je crois que cette aventure est loin d’être terminée."

];


/* =========================================================
   BOOK MESSAGES
========================================================= */

const bookMessages = [

    "Tu veux relire certains chapitres ? 📖",

    "Le livre est toujours là juste au-dessus !",

    "Besoin de vérifier un détail du lore ? Retourne dans les chapitres. 👀",

    "Tu peux toujours revenir tourner quelques pages.",

    "Retour aux archives de mon voyage !"

];


/* =========================================================
   HOME MESSAGES
========================================================= */

const homeMessages = [

    "Tu veux retourner à l’accueil ? 🐙",

    "Direction le reste de mon univers !",

    "L’histoire est terminée pour aujourd’hui, mais le site ne l’est pas. 💜",

    "Il reste encore beaucoup de choses à explorer !",

    "On retourne au début du site ?"

];


/* =========================================================
   CHARACTERS MESSAGES
========================================================= */

const charactersMessages = [

    "Tu veux revoir les personnages de l’histoire ? 👀",

    "Couaxia, Hylda, Cita, Avadora, Natsu et Myo t’attendent un peu plus haut.",

    "Besoin de revoir qui est qui ? Direction le codex des personnages !",

    "Même moi, parfois, j’ai besoin de revoir toute cette équipe. 😂"

];


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
        class="history-final"
        aria-labelledby="history-final-title"

        @mouseenter="
            startMascotHover(
                finalMessages
            )
        "

        @mouseleave="
            stopMascotHover
        "
    >

        <!-- =================================================
             BACKGROUND GLOWS
        ================================================== -->

        <div
            class="
                history-final__glow
                history-final__glow--left
            "
            aria-hidden="true"
        ></div>


        <div
            class="
                history-final__glow
                history-final__glow--right
            "
            aria-hidden="true"
        ></div>


        <!-- =================================================
             DECORATIONS
        ================================================== -->

        <span
            class="
                history-final__decoration
                history-final__decoration--one
            "
            aria-hidden="true"
        >
            ✦
        </span>


        <span
            class="
                history-final__decoration
                history-final__decoration--two
            "
            aria-hidden="true"
        >
            🌌
        </span>


        <span
            class="
                history-final__decoration
                history-final__decoration--three
            "
            aria-hidden="true"
        >
            ✦
        </span>


        <!-- =================================================
             CONTENT
        ================================================== -->

        <div class="history-final__content">

            <!-- =============================================
                 TEXT
            ============================================== -->

            <div class="history-final__text">

                <p class="history-final__eyebrow">
                    FIN DU PREMIER VOYAGE
                </p>


                <h2
                    id="history-final-title"
                    class="history-final__title"
                >

                    L’histoire ne fait que

                    <span>
                        commencer
                    </span>

                </h2>


                <p class="history-final__description">

                    De Saphira jusqu’à la Terre, chaque étape
                    a ajouté une nouvelle pièce à l’univers de
                    Couaxia.

                </p>


                <p class="history-final__description">

                    Des rencontres comme Natsu ou Myo,
                    les voyages avec Hylda, Cita et Avadora,
                    ainsi que les mystères du monde magique
                    ne représentent encore qu’une partie
                    de cette aventure.

                </p>


                <p class="history-final__message">

                    Les prochains chapitres restent encore
                    à écrire. 💜

                </p>


                <!-- =========================================
                     ACTIONS
                ========================================== -->

                <div class="history-final__actions">

                    <!-- =====================================
                         BOOK
                    ====================================== -->

                    <a
                        href="#history-book"

                        class="
                            history-final__button
                            history-final__button--primary
                        "

                        @mouseenter.stop="
                            startMascotHover(
                                bookMessages
                            )
                        "

                        @mouseleave.stop="
                            stopMascotHover
                        "

                        @focus.stop="
                            startMascotHover(
                                bookMessages
                            )
                        "

                        @blur.stop="
                            stopMascotHover
                        "
                    >

                        <span
                            class="
                                history-final__button-icon
                            "
                            aria-hidden="true"
                        >
                            📖
                        </span>


                        <span>
                            Relire les chapitres
                        </span>


                        <span
                            class="
                                history-final__button-arrow
                            "
                            aria-hidden="true"
                        >
                            ↑
                        </span>

                    </a>


                    <!-- =====================================
                         CHARACTERS
                    ====================================== -->

                    <a
                        href="#history-characters"

                        class="
                            history-final__button
                            history-final__button--secondary
                        "

                        @mouseenter.stop="
                            startMascotHover(
                                charactersMessages
                            )
                        "

                        @mouseleave.stop="
                            stopMascotHover
                        "

                        @focus.stop="
                            startMascotHover(
                                charactersMessages
                            )
                        "

                        @blur.stop="
                            stopMascotHover
                        "
                    >

                        <span
                            aria-hidden="true"
                            class="
                                history-final__button-icon
                            "
                        >
                            ✨
                        </span>


                        <span>
                            Revoir les personnages
                        </span>

                    </a>


                    <!-- =====================================
                         HOME
                    ====================================== -->

                    <RouterLink
                        :to="{
                            name: 'home'
                        }"

                        class="
                            history-final__button
                            history-final__button--ghost
                        "

                        @mouseenter.stop="
                            startMascotHover(
                                homeMessages
                            )
                        "

                        @mouseleave.stop="
                            stopMascotHover
                        "

                        @focus.stop="
                            startMascotHover(
                                homeMessages
                            )
                        "

                        @blur.stop="
                            stopMascotHover
                        "
                    >

                        <span
                            aria-hidden="true"
                            class="
                                history-final__button-icon
                            "
                        >
                            🏠
                        </span>


                        <span>
                            Retour à l’accueil
                        </span>

                    </RouterLink>

                </div>

            </div>


            <!-- =============================================
                 VISUAL
            ============================================== -->

            <div
                class="
                    history-final__visual
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
                     IMAGE GLOW
                ========================================== -->

                <div
                    class="
                        history-final__image-glow
                    "
                    aria-hidden="true"
                ></div>


                <!-- =========================================
                     ORBIT
                ========================================== -->

                <div
                    class="
                        history-final__orbit
                        history-final__orbit--one
                    "
                    aria-hidden="true"
                ></div>


                <div
                    class="
                        history-final__orbit
                        history-final__orbit--two
                    "
                    aria-hidden="true"
                ></div>


                <!-- =========================================
                     IMAGE
                ========================================== -->

                <img
                    :src="
                        finalImage
                    "

                    alt="
                        Couaxia
                    "

                    class="
                        history-final__image
                    "

                    loading="lazy"
                >

            </div>

        </div>


        <!-- =================================================
             FINAL QUOTE
        ================================================== -->

        <div class="history-final__quote">

            <span
                class="
                    history-final__quote-mark
                "
                aria-hidden="true"
            >
                “
            </span>


            <p>

                Chaque planète découverte,
                chaque rencontre et chaque aventure
                n’est qu’une nouvelle page
                de l’histoire.

            </p>


            <span class="history-final__quote-author">
                — Couaxia
            </span>

        </div>

    </section>

</template>