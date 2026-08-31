<script setup lang="ts">

/* =========================================================
   ABOUT FINAL
========================================================= */

const finalImage =
    "https://qudeuzkwvwprlhqtzsct.supabase.co/storage/v1/object/public/artworks/Couaxia/forme-2/SPOILER_Jack_O_Lantern_Violet_-_background.png";


/* =========================================================
   MASCOT TIMER
========================================================= */

let mascotHoverTimer:
    number | null =
        null;


/* =========================================================
   MESSAGES — STORY BUTTON
========================================================= */

const storyMessages = [

    "Tu veux vraiment connaître toute mon histoire ? 👀",

    "Tout a commencé bien avant mon arrivée sur Terre... 🌌",

    "Saphira, Avadora, Natsu... il y a beaucoup de choses à raconter !",

    "Prépare-toi, mon histoire est un peu plus mouvementée qu'elle en a l'air ! 🐙",

    "Si tu veux comprendre mon univers, c'est par ici ! 📖"

];


/* =========================================================
   MESSAGES — IMAGE
========================================================= */

const imageMessages = [

    "Oh, celle-là me rappelle de bons souvenirs ! 💜",

    "Tu regardes encore mon illustration ? 👀",

    "Même en image, je garde mes tentacules à l'œil ! 🐙",

    "J'aime beaucoup cette version de moi !",

    "Oui oui, c'est encore moi ! ✨"

];


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

</script>


<template>

    <section
        class="about-final"
        aria-labelledby="about-final-title"
    >

        <!-- =================================================
             GLOW
        ================================================== -->

        <div
            class="
                about-final__glow
                about-final__glow--left
            "
            aria-hidden="true"
        ></div>


        <div
            class="
                about-final__glow
                about-final__glow--right
            "
            aria-hidden="true"
        ></div>


        <!-- =================================================
             CONTENT
        ================================================== -->

        <div class="about-final__content">

            <!-- =============================================
                 TEXT
            ============================================== -->

            <div class="about-final__text">

                <p class="about-final__eyebrow">
                    ET VOILÀ !
                </p>


                <h2
                    id="about-final-title"
                    class="about-final__title"
                >
                    Maintenant, tu en sais un peu plus
                    <span>
                        sur moi.
                    </span>
                </h2>


                <p class="about-final__description">

                    Couaxia, c’est du multigaming,
                    des tentacules, beaucoup de chaos,
                    un univers qui continue de grandir
                    et surtout une aventure partagée
                    avec toute une communauté.

                </p>


                <p class="about-final__message">
                    Merci de faire partie du voyage 💜
                </p>


                <!-- =========================================
                     ACTIONS
                ========================================== -->

                <div class="about-final__actions">

                    <RouterLink
                        to="/history"

                        class="
                            about-final__button
                            about-final__button--primary
                        "

                        @mouseenter="
                            startMascotHover(
                                storyMessages
                            )
                        "

                        @mouseleave="
                            stopMascotHover
                        "

                        @focus="
                            startMascotHover(
                                storyMessages
                            )
                        "

                        @blur="
                            stopMascotHover
                        "
                    >

                        <span
                            aria-hidden="true"
                            class="
                                about-final__button-icon
                            "
                        >
                            📖
                        </span>


                        <span>
                            Découvrir mon histoire
                        </span>

                    </RouterLink>

                </div>

            </div>


            <!-- =============================================
                 VISUAL
            ============================================== -->

            <div
                class="
                    about-final__visual
                "

                tabindex="0"

                @mouseenter="
                    startMascotHover(
                        imageMessages
                    )
                "

                @mouseleave="
                    stopMascotHover
                "

                @focus="
                    startMascotHover(
                        imageMessages
                    )
                "

                @blur="
                    stopMascotHover
                "
            >

                <div
                    class="
                        about-final__image-glow
                    "
                    aria-hidden="true"
                ></div>


                <img
                    :src="
                        finalImage
                    "

                    alt="Couaxia"

                    class="
                        about-final__image
                    "

                    loading="lazy"
                >

            </div>

        </div>

    </section>

</template>